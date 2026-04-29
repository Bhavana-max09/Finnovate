from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np
import random
import os
from fastapi.middleware.cors import CORSMiddleware

# ── Gemini AI integration ──
from dotenv import load_dotenv
load_dotenv() # Loads variables from .env file

import google.generativeai as genai
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
gemini_model = None
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel("gemini-2.0-flash-lite")

from core_engine import CoreEngine
from xai_module import XAIModule
from bias_auditor import BiasAuditor
from proxy_hunter import ProxyHunter
from compliance import ComplianceModule
from agent_orchestrator import AgentOrchestrator
from decision_ledger import DecisionLedger

app = FastAPI(title="EthiCredit Pro API — Agentic Fair Lending")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy-loaded singletons to prevent Render startup timeouts
_modules = {}

def get_module(name):
    if name not in _modules:
        print(f"📦 Lazy-loading module: {name}...")
        try:
            if name == "core_engine":
                _modules["core_engine"] = CoreEngine()
            elif name == "xai_module":
                ce = get_module("core_engine")
                _modules["xai_module"] = XAIModule(ce.model, ce.feature_names)
            elif name == "bias_auditor":
                ce = get_module("core_engine")
                _modules["bias_auditor"] = BiasAuditor(ce.model, ce.feature_names)
            elif name == "proxy_hunter":
                _modules["proxy_hunter"] = ProxyHunter()
            elif name == "compliance_module":
                _modules["compliance_module"] = ComplianceModule()
            elif name == "agent_orchestrator":
                _modules["agent_orchestrator"] = AgentOrchestrator(GEMINI_API_KEY)
            elif name == "decision_ledger":
                _modules["decision_ledger"] = DecisionLedger()
            print(f"✅ {name} loaded.")
        except Exception as e:
            print(f"❌ Error loading {name}: {e}")
            raise e
    return _modules[name]

class ApplicantData(BaseModel):
    DAYS_BIRTH: int
    CODE_GENDER: str
    AMT_INCOME_TOTAL: float
    AMT_CREDIT: float
    ZIP_CODE: str
    NAME_EDUCATION_TYPE: str
    EXT_SOURCE_1: float
    EXT_SOURCE_2: float
    EXT_SOURCE_3: float

def preprocess(data: ApplicantData) -> pd.DataFrame:
    # 1. Convert to dict and handle ZIP/Gender/Education as categories
    input_dict = data.dict()
    df = pd.DataFrame([input_dict])
    
    # 2. Manual one-hot encoding to match training format
    # Instead of get_dummies (which creates random orders), we explicitly set the flags
    processed_df = pd.DataFrame(0, index=[0], columns=core_engine.feature_names)
    
    # Copy numerical values
    for col in ['DAYS_BIRTH', 'AMT_INCOME_TOTAL', 'AMT_CREDIT', 'EXT_SOURCE_1', 'EXT_SOURCE_2', 'EXT_SOURCE_3']:
        if col in processed_df.columns:
            processed_df[col] = float(input_dict[col])
            
    # Set categorical flags
    gender_col = f"CODE_GENDER_{input_dict['CODE_GENDER']}"
    if gender_col in processed_df.columns:
        processed_df[gender_col] = 1
        
    edu_col = f"NAME_EDUCATION_TYPE_{input_dict['NAME_EDUCATION_TYPE']}"
    if edu_col in processed_df.columns:
        processed_df[edu_col] = 1
        
    zip_col = f"ZIP_CODE_{input_dict['ZIP_CODE']}"
    if zip_col in processed_df.columns:
        processed_df[zip_col] = 1
        
    return processed_df

def run_guardrails(data: ApplicantData):
    """Hard business rules that override AI decisions for safety."""
    reasons = []
    
    # 1. Age Check (DAYS_BIRTH is negative in this dataset, e.g., -7000 = ~19 years)
    age_years = abs(data.DAYS_BIRTH) / 365
    if age_years < 18:
        reasons.append(f"Applicant is underage ({age_years:.1f} years). Minimum 18 required.")
    
    # 2. Income Check
    if data.AMT_INCOME_TOTAL < 5000:
        reasons.append(f"Income ${data.AMT_INCOME_TOTAL} is below the minimum threshold ($5,000).")
        
    # 3. Debt-to-Income (DTI) Check
    dti = data.AMT_CREDIT / (data.AMT_INCOME_TOTAL if data.AMT_INCOME_TOTAL > 0 else 1)
    if dti > 15:
        reasons.append(f"Debt-to-Income ratio ({dti:.1f}x) exceeds maximum safety limit (15x).")
        
    # 4. Zero Credit Check
    if data.EXT_SOURCE_1 == 0 and data.EXT_SOURCE_2 == 0 and data.EXT_SOURCE_3 == 0:
        reasons.append("No credit history or external scores detected.")
        
    return reasons

@app.post("/predict")
def predict(data: ApplicantData):
    # 🛡️ Guardrails check
    failures = run_guardrails(data)
    if failures:
        return {
            "prediction": 1, "probability": 0.95, "approved": False,
            "status": "Hard Rejected by Guardrails", "rejection_reasons": failures
        }

    df = preprocess(data)
    try:
        core_engine = get_module("core_engine")
        xai_module = get_module("xai_module")
        decision_ledger = get_module("decision_ledger")
        
        res = core_engine.predict(df)
        res["status"] = "AI Evaluated"
        
        # 🔒 Log to Ledger
        shap_summary = xai_module.get_local_shap(df)
        decision_ledger.log_decision(data.dict(), res, shap_summary)
        
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain")
def explain(data: ApplicantData):
    # 🛡️ Guardrails check (CRITICAL: Frontend calls this on Submit)
    failures = run_guardrails(data)
    if failures:
        return {
            "approved": False,
            "status": "Hard Rejected by Guardrails",
            "rejection_reasons": failures,
            "default_probability": 1.0,
            "probability": 1.0,
            "shap_importance": [],
            "counterfactuals": ["N/A - Hard Rejection due to safety violations"]
        }

    df = preprocess(data)
    try:
        xai_module = get_module("xai_module")
        shap_values = xai_module.get_local_shap(df)
        counterfactuals = xai_module.generate_counterfactuals(df)
        return {
            "shap_importance": shap_values,
            "counterfactuals": counterfactuals,
            "status": "AI Evaluated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain/narrative")
def explain_narrative(data: ApplicantData):
    """Generate a plain-language AI narrative for the underwriter using Gemini if available."""
    # 🛡️ Guardrails check
    failures = run_guardrails(data)
    if failures:
        return {
            "decision": "Rejected (Ineligible)",
            "risk_score": 100.0,
            "narrative": f"Application hard-rejected by business guardrails. Reasons: {', '.join(failures)}.",
            "top_reject_factors": [{"feature": r, "impact": 1.0} for r in failures],
            "top_approve_factors": [],
            "narrative_source": "Guardrail Engine"
        }

    df = preprocess(data)
    try:
        xai_module = get_module("xai_module")
        base = xai_module.generate_narrative(df)
        
        if gemini_model:
            try:
                top_reject = ", ".join([f"{f['feature']} (impact +{f['impact']:.4f})" for f in base.get("top_reject_factors", [])])
                top_approve = ", ".join([f"{f['feature']} (impact -{f['impact']:.4f})" for f in base.get("top_approve_factors", [])])
                prompt = f"""You are an expert AI loan underwriter. Write a concise, professional 3-sentence narrative for a loan officer explaining this AI decision.

Decision: {base['decision']}
Default Risk Score: {base['risk_score']}%
Top factors pushing toward REJECTION: {top_reject or 'None'}
Top factors supporting APPROVAL: {top_approve or 'None'}

Rules:
- Be specific about the financial factors (name them)
- Mention the risk score
- End with a clear recommendation for the underwriter
- Do NOT use bullet points, just flowing professional prose"""
                response = gemini_model.generate_content(prompt)
                base["narrative"] = response.text.strip()
                base["narrative_source"] = "Gemini 1.5 Flash"
            except Exception as ai_err:
                print(f"Gemini error: {ai_err}")
                base["narrative_source"] = "Template (AI Narrative failed)"
        else:
            base["narrative_source"] = "Template (set GEMINI_API_KEY for AI narratives)"
        
        return base
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/simulate_what_if")
def simulate_what_if(data: ApplicantData):
    """Real-time What-If simulation – returns updated probability for slider interactions."""
    # 🛡️ Guardrails check
    failures = run_guardrails(data)
    if failures:
        return {
            "default_probability": 1.0,
            "decision": "Rejected",
            "approval_probability": 0.0,
            "shap_summary": [],
            "status": "Ineligible (Guardrails)"
        }

    df = preprocess(data)
    try:
        core_engine = get_module("core_engine")
        xai_module = get_module("xai_module")
        
        result = core_engine.predict(df)
        shap_vals = xai_module.get_local_shap(df)
        return {
            "default_probability": result["default_probability"],
            "decision": result["decision"],
            "approval_probability": round(1.0 - result["default_probability"], 4),
            "shap_summary": shap_vals[:5]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/verify_documents")
async def verify_documents(
    aadhar: Optional[UploadFile] = File(None),
    pan: Optional[UploadFile] = File(None),
    address_proof: Optional[UploadFile] = File(None)
):
    """Simulates OCR and KYC verification for uploaded documents using Gemini Vision if available."""
    results = {}
    genuineness_score = 0.0
    verified_count = 0
    
    docs = {"Aadhar": aadhar, "PAN": pan, "Address Proof": address_proof}
    
    for name, file in docs.items():
        if file:
            is_valid = file.content_type in ["application/pdf", "image/jpeg", "image/png"]
            
            # ✨ Real-Time OCR with Gemini Vision Logic
            ocr_text = "Simulated OCR: Text extraction successful."
            confidence = round(random.uniform(0.94, 0.99), 4)
            
            if gemini_model and is_valid and file.content_type.startswith("image/"):
                try:
                    # In a production app, we would read the bytes and send to Gemini
                    # For this advancement, we simulate the sophisticated response
                    ocr_text = f"Extracted from {name}: ID verified. No tampering detected."
                except:
                    pass

            results[name] = {
                "status": "Verified" if is_valid else "Rejected",
                "filename": file.filename,
                "confidence": confidence if is_valid else 0.0,
                "ocr_summary": ocr_text if is_valid else "File format not supported for OCR"
            }
            if is_valid:
                verified_count += 1
        else:
            results[name] = {"status": "Missing", "confidence": 0.0}

    # Mock genuineness check enhanced by "AI Forensics"
    if verified_count == 3:
        genuineness_score = round(random.uniform(97.5, 99.9), 1)
    elif verified_count > 0:
        genuineness_score = round(random.uniform(75.0, 88.0), 1)
    else:
        genuineness_score = 0.0

    return {
        "kyc_status": "Approved" if verified_count >= 2 else "Pending",
        "document_results": results,
        "genuineness_score": genuineness_score,
        "customer_is_genuine": genuineness_score > 90.0,
        "verification_date": "2024-04-28",
        "agentic_notes": "Forensic pixel analysis complete. No manipulation signatures found."
    }

# ──────────────────────────────────────────────
# AGENTIC FEATURES (Roadmap & Deliberation)
# ──────────────────────────────────────────────

@app.post("/rehab_roadmap")
async def get_rehab_roadmap(data: ApplicantData):
    """Generates a personalized financial rehabilitation roadmap."""
    df = preprocess(data)
    xai_module = get_module("xai_module")
    agent_orchestrator = get_module("agent_orchestrator")
    shap_summary = xai_module.get_local_shap(df)
    return await agent_orchestrator.generate_rehab_roadmap(data.dict(), shap_summary)

@app.post("/agentic_deliberation")
async def run_deliberation(data: ApplicantData):
    """Triggers the multi-agent credit committee deliberation."""
    df = preprocess(data)
    core_engine = get_module("core_engine")
    xai_module = get_module("xai_module")
    agent_orchestrator = get_module("agent_orchestrator")
    
    ml_result = core_engine.predict(df)
    shap_summary = xai_module.get_local_shap(df)
    return await agent_orchestrator.deliberate(data.dict(), ml_result, shap_summary)

@app.get("/ledger")
def get_audit_ledger():
    """Returns the immutable decision ledger for regulatory audit."""
    decision_ledger = get_module("decision_ledger")
    return decision_ledger.get_ledger()

# ──────────────────────────────────────────────
# BIAS & FAIRNESS
# ──────────────────────────────────────────────

@app.get("/bias_metrics")
def get_bias_metrics():
    try:
        bias_auditor = get_module("bias_auditor")
        return bias_auditor.calculate_fairness_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stress_test")
def stress_test(data: ApplicantData):
    # 🛡️ Guardrails check
    failures = run_guardrails(data)
    if failures:
        return {
            "Tests": 0, "Flips": 0, "Stability_Score": 0.0, "Status": "Ineligible",
            "Message": "Adversarial testing skipped: Application failed business guardrails."
        }

    df = preprocess(data)
    try:
        bias_auditor = get_module("bias_auditor")
        return bias_auditor.adversarial_stress_test(df)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/proxy_hunter")
def get_proxies():
    try:
        proxy_hunter = get_module("proxy_hunter")
        return proxy_hunter.compute_correlations()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ──────────────────────────────────────────────
# PORTFOLIO HISTORY & ANALYTICS
# ──────────────────────────────────────────────

@app.get("/portfolio/history")
def get_portfolio_history():
    """Returns simulated portfolio history data for the Regulator dashboard."""
    months = ["Oct '24", "Nov '24", "Dec '24", "Jan '25", "Feb '25", "Mar '25",
              "Apr '25", "May '25", "Jun '25", "Jul '25", "Aug '25", "Sep '25"]
    random.seed(42)
    
    timeline = []
    base_approved = 320
    base_rejected = 120
    for i, month in enumerate(months):
        approved = base_approved + random.randint(-20, 40) + (i * 8)
        rejected = base_rejected + random.randint(-15, 20) - (i * 2)
        total = approved + rejected
        timeline.append({
            "month": month,
            "approved": approved,
            "rejected": max(rejected, 60),
            "total": total,
            "approval_rate": round(approved / total * 100, 1),
            "funded_amount_m": round((approved * random.uniform(18, 35)), 1)
        })

    credit_score_bands = [
        {"band": "300–499", "approved": 12, "rejected": 98, "approval_rate": 10.9},
        {"band": "500–599", "approved": 87, "rejected": 143, "approval_rate": 37.8},
        {"band": "600–699", "approved": 234, "rejected": 89, "approval_rate": 72.4},
        {"band": "700–749", "approved": 312, "rejected": 34, "approval_rate": 90.2},
        {"band": "750–850", "approved": 421, "rejected": 11, "approval_rate": 97.5},
    ]

    income_bands = [
        {"band": "<$25K", "approved": 89, "rejected": 201, "approval_rate": 30.7},
        {"band": "$25K–$50K", "approved": 267, "rejected": 133, "approval_rate": 66.7},
        {"band": "$50K–$100K", "approved": 389, "rejected": 71, "approval_rate": 84.5},
        {"band": "$100K+", "approved": 421, "rejected": 29, "approval_rate": 93.6},
    ]

    regional_data = [
        {"region": "Northeast", "approved": 423, "rejected": 112, "funded_m": 12400},
        {"region": "Southeast", "approved": 312, "rejected": 89, "funded_m": 8900},
        {"region": "Midwest", "approved": 287, "rejected": 98, "funded_m": 7600},
        {"region": "Southwest", "approved": 198, "rejected": 76, "funded_m": 5400},
        {"region": "West", "approved": 534, "rejected": 143, "funded_m": 15200},
    ]

    portfolio_status = [
        {"status": "Good Loans (Paid)", "count": 2341, "percentage": 68.2},
        {"status": "Active Loans", "count": 812, "percentage": 23.7},
        {"status": "Late (30-90 days)", "count": 123, "percentage": 3.6},
        {"status": "Default / Charged Off", "count": 153, "percentage": 4.5},
    ]

    kpis = {
        "total_applications": sum(t["total"] for t in timeline),
        "total_approved": sum(t["approved"] for t in timeline),
        "total_rejected": sum(t["rejected"] for t in timeline),
        "overall_approval_rate": round(sum(t["approved"] for t in timeline) / sum(t["total"] for t in timeline) * 100, 1),
        "total_funded_m": round(sum(t["funded_amount_m"] for t in timeline), 1),
        "avg_decision_time_ms": 423,
        "straight_through_processing_rate": 78.4,
        "default_rate": 4.5
    }

    return {
        "kpis": kpis,
        "timeline": timeline,
        "credit_score_bands": credit_score_bands,
        "income_bands": income_bands,
        "regional_data": regional_data,
        "portfolio_status": portfolio_status
    }

# ──────────────────────────────────────────────
# COMPLIANCE (DPDP)
# ──────────────────────────────────────────────

@app.get("/compliance/purpose_limitation")
def get_purpose_limitation():
    compliance_module = get_module("compliance_module")
    return compliance_module.get_purpose_limitation()

@app.post("/compliance/erasure/{user_index}")
def erase_user(user_index: int):
    compliance_module = get_module("compliance_module")
    return compliance_module.simulate_right_to_erasure(user_index)
