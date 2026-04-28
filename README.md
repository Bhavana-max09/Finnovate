# EthiCredit Pro

EthiCredit Pro is a modern, full-stack **Financial Services Aggregator** combined with an **Agentic Fair Lending Engine**. It transforms traditional, opaque bank lending processes into a unified, unbiased, and transparent decision engine by leveraging machine learning, explainable AI (XAI), and large language models (LLMs).

## 🎯 Project Objective

Traditional loan processing often repeats historical discriminatory mistakes and operates as a "black-box". EthiCredit Pro solves this by:
1. Providing a centralized aggregator for users to compare loans, cards, and forex.
2. Injecting an intelligent, unbiased **AI Underwriter** into the eligibility process.
3. Explaining AI decisions using human-readable narratives and actionable metrics.
4. Ensuring structural fairness and compliance with strict data protection and regulatory frameworks.

## 🚀 Key Features

### Frontend: Financial Aggregator
- **Dynamic UI**: Built with React, Vite, and TailwindCSS, featuring a sleek dark/light mode experience.
- **Multi-Module Dashboard**: Compare Credit Cards, Home/Car/Education Loans, Savings, and Forex rates.
- **Agentic Eligibility Checker**: A multi-step wizard that gathers user financial data and fetches a real-time decision from the AI Underwriter.

### Backend: Agentic AI Underwriter
- **ML Prediction Engine**: Utilizes XGBoost to predict loan default probabilities based on the Home Credit dataset.
- **Business Guardrails**: Hard rule evaluation (e.g., age, minimum income, debt-to-income ratio) applied before ML inference to ensure baseline safety.
- **Explainable AI (XAI)**: Integrated SHAP and DiCE to provide clear feature importance and counterfactuals (e.g., "If your income was $5,000 higher, you would be approved").
- **LLM Narratives**: Uses **Google Gemini 1.5 Flash** to automatically generate professional, plain-language summaries of the AI's underwriting decisions for loan officers.
- **Bias & Compliance Auditing**: 
  - Adversarial stress testing to ensure the model's stability against noisy inputs.
  - Proxy feature hunting to identify data points correlated with sensitive attributes.
  - DPDP Act Compliance mechanisms, including right-to-erasure simulations.

## 🛠️ Tech Stack

**Frontend:**
- React 19, Vite, TailwindCSS 4, Lucide React
- Deployed on **Vercel**

**Backend:**
- Python 3, FastAPI, Uvicorn
- Machine Learning: XGBoost, Scikit-Learn, Pandas, NumPy
- Explainability: SHAP
- LLM Integration: Google Generative AI (Gemini)
- Deployed on **Railway**

## 🚦 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 1. Start the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt

# (Optional) Export your Gemini API key for AI Narratives
export GEMINI_API_KEY="your-api-key"

uvicorn main:app --reload --port 8000
```
The FastAPI backend will be available at `http://localhost:8000`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The React frontend will be available at `http://localhost:5173`. 
*(Note: In local development, the Vite config automatically proxies `/api` requests to the local backend).*

## 🌐 Production Deployment

The project is structured to deploy the backend and frontend independently.
- **Frontend** expects an environment variable `VITE_API_URL` containing the live backend URL (e.g., `https://your-backend.up.railway.app`). If set, the React app will securely route API calls directly to the live backend.
