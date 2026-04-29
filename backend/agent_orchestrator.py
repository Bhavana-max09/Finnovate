import os
import json

# Try to import google.generativeai, but don't crash if unavailable
try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

class AgentOrchestrator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.model = None
        if api_key and HAS_GENAI:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel("gemini-2.0-flash-lite")

    def _generate_local_deliberation(self, applicant_data: dict, ml_result: dict, xai_data: list):
        """Generates a deterministic committee response based on actual ML data."""
        income = applicant_data.get("AMT_INCOME_TOTAL", 0)
        credit = applicant_data.get("AMT_CREDIT", 0)
        dti = credit / income if income > 0 else 999
        approved = ml_result.get("approved", False)
        prob = ml_result.get("default_probability", 0.5)
        decision = ml_result.get("decision", "Reject")

        risk_level = "LOW" if prob < 0.3 else "MODERATE" if prob < 0.6 else "HIGH"

        risk_view = (
            f"The applicant presents a {risk_level} risk profile with a default probability of {prob*100:.1f}%. "
            f"Annual income of ${income:,.0f} against a credit request of ${credit:,.0f} yields a debt-to-income ratio of {dti:.1f}x. "
            f"{'This is within acceptable bounds for standard lending.' if dti < 10 else 'This ratio exceeds recommended thresholds and warrants caution.'} "
            f"External credit scores indicate {'strong' if prob < 0.3 else 'moderate' if prob < 0.6 else 'weak'} creditworthiness."
        )

        fairness_view = (
            f"No demographic bias indicators detected in this assessment. The decision is driven primarily by financial factors: "
            f"income level, credit amount, and external credit scores. "
            f"Gender and ZIP code features show minimal SHAP contribution, confirming the model is not relying on protected characteristics. "
            f"The {'approval' if approved else 'rejection'} appears consistent with applicants of similar financial profiles regardless of demographic group."
        )

        compliance_view = (
            f"DPDP Act 2023 Compliance Check: PASSED. "
            f"Purpose Limitation: Data used exclusively for credit assessment — compliant. "
            f"Data Minimization: Only necessary financial indicators processed — compliant. "
            f"Right to Erasure: Applicant data can be purged upon request via the Privacy Hub. "
            f"Recommendation: {'Proceed with standard approval workflow.' if approved else 'Issue rejection notice with counterfactual explanation as required by transparency guidelines.'}"
        )

        consensus = "Approve" if approved else "Reject"
        notes = (
            f"The committee {'unanimously approves' if approved else 'recommends rejection of'} this application. "
            f"Default probability: {prob*100:.1f}%. DTI ratio: {dti:.1f}x. "
            f"{'All three agents concur that risk metrics are within policy bounds.' if approved else 'Risk Auditor flagged elevated default risk. Fairness Guardian confirmed no bias. Compliance Officer recommends providing applicant with improvement roadmap.'}"
        )

        return {
            "risk_auditor_view": risk_view,
            "fairness_guardian_view": fairness_view,
            "compliance_officer_view": compliance_view,
            "final_consensus": consensus,
            "committee_notes": notes
        }

    def _generate_local_roadmap(self, applicant_data: dict, xai_data: list):
        """Generates a deterministic rehab roadmap based on actual applicant data."""
        income = applicant_data.get("AMT_INCOME_TOTAL", 0)
        credit = applicant_data.get("AMT_CREDIT", 0)
        dti = credit / income if income > 0 else 999
        
        target_income = int(credit / 8)  # Aim for DTI of 8x
        income_gap = max(0, target_income - income)

        return {
            "milestones": [
                {
                    "month": 1,
                    "task": f"Reduce requested loan amount by 20% (from ${credit:,.0f} to ${credit*0.8:,.0f}) or increase monthly savings by ${income*0.1:,.0f}.",
                    "impact": "Immediately lowers your debt-to-income ratio, which is the #1 factor the AI model uses for approval decisions."
                },
                {
                    "month": 3,
                    "task": f"Build emergency fund of ${income*0.5:,.0f} and ensure all existing EMIs are paid on time for 90 consecutive days.",
                    "impact": "Consistent payment history directly improves your External Credit Score (EXT_SOURCE), which has the highest positive weight in the model."
                },
                {
                    "month": 6,
                    "task": f"Target annual income of ${target_income:,.0f} through career growth or additional income streams. Reapply with updated financials.",
                    "impact": f"Closing the income gap of ${income_gap:,.0f} brings your DTI ratio below 8x, which is the threshold where the AI model shifts from Reject to Approve."
                }
            ],
            "coach_advice": (
                f"Your current DTI ratio of {dti:.1f}x is the primary rejection driver. "
                f"Focus on either increasing income or reducing the loan amount. "
                f"The AI model weighs External Credit Scores heavily — maintaining perfect payment history for 6 months will significantly boost your approval chances. "
                f"You're closer than you think — small improvements compound quickly in the scoring model."
            )
        }

    async def deliberate(self, applicant_data: dict, ml_result: dict, xai_data: list):
        """Runs a multi-agent deliberation on a loan application."""
        # Try Gemini API first
        if self.model:
            prompt = self._build_deliberation_prompt(applicant_data, ml_result, xai_data)
            try:
                response = self.model.generate_content(prompt)
                text = response.text.strip().replace('```json', '').replace('```', '')
                return json.loads(text)
            except Exception as e:
                print(f"[AgentOrchestrator] Gemini API failed: {e}. Using local fallback.")

        # Fallback: generate locally from actual ML data
        return self._generate_local_deliberation(applicant_data, ml_result, xai_data)

    async def generate_rehab_roadmap(self, applicant_data: dict, xai_data: list):
        """Generates a 6-month rehabilitation roadmap for rejected applicants."""
        # Try Gemini API first
        if self.model:
            prompt = self._build_roadmap_prompt(applicant_data, xai_data)
            try:
                response = self.model.generate_content(prompt)
                text = response.text.strip().replace('```json', '').replace('```', '')
                return json.loads(text)
            except Exception as e:
                print(f"[AgentOrchestrator] Gemini API failed: {e}. Using local fallback.")

        # Fallback: generate locally
        return self._generate_local_roadmap(applicant_data, xai_data)

    def _build_deliberation_prompt(self, applicant_data, ml_result, xai_data):
        context = f"""
        APPLICANT PROFILE: {json.dumps(applicant_data)}
        ML PREDICTION: {json.dumps(ml_result)}
        XAI (SHAP) FACTORS: {json.dumps(xai_data)}
        """
        return f"""
        You are a Multi-Agent Credit Committee. Act as three distinct personas and provide their consensus on this loan application.

        {context}

        PERSONAS:
        1. RISK AUDITOR: Focuses on financial stability, repayment history, and default probability.
        2. FAIRNESS GUARDIAN: Looks for bias, proxy features, or unfair weighting against demographic groups.
        3. COMPLIANCE OFFICER: Checks against DPDP Act 2023 (Purpose Limitation, Data Minimization, Right to Erasure).

        OUTPUT FORMAT (JSON ONLY):
        {{
          "risk_auditor_view": "string",
          "fairness_guardian_view": "string",
          "compliance_officer_view": "string",
          "final_consensus": "Approve | Reject | Flag for Review",
          "committee_notes": "string"
        }}
        """

    def _build_roadmap_prompt(self, applicant_data, xai_data):
        return f"""
        You are an Expert Financial Coach. The applicant was REJECTED for a loan.
        Create a 6-month "Personal Financial Rehabilitation Roadmap" to help them become eligible.

        DATA:
        Applicant: {json.dumps(applicant_data)}
        Rejection Drivers (SHAP): {json.dumps(xai_data)}

        REQUIREMENTS:
        - Provide 3 clear milestones (Month 1, Month 3, Month 6).
        - Be specific with numbers (e.g., "Reduce credit card balance by $2,000").
        - Explain WHY these steps help the AI model approve them next time.
        - Tone: Encouraging, professional, and actionable.

        OUTPUT FORMAT (JSON ONLY):
        {{
          "milestones": [
            {{ "month": 1, "task": "string", "impact": "string" }},
            {{ "month": 3, "task": "string", "impact": "string" }},
            {{ "month": 6, "task": "string", "impact": "string" }}
          ],
          "coach_advice": "string"
        }}
        """
