# FinShield AI Copilot Service Layer
# Synthesizes authenticated financial metrics with NVIDIA NIM LLM or deterministic fallback

import json
from decimal import Decimal
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
import httpx

from app.core.config import settings
from app.models.financial import Transaction, Budget, SavingsGoal, User
from app.schemas.copilot import CopilotQuestionRequest, CopilotAnswerResponse


class CopilotService:
    @staticmethod
    def answer_question(db: Session, user_id: str, request: CopilotQuestionRequest) -> CopilotAnswerResponse:
        """
        Answers user's financial question grounded exclusively in their actual database records.
        Never invents transaction records or arbitrary financial figures.
        """
        user = db.query(User).filter(User.id == user_id).first()
        income_val = db.query(func.coalesce(func.sum(Transaction.amount), Decimal("0.00"))).filter(
            Transaction.user_id == user_id, Transaction.type == "income"
        ).scalar()
        total_income = Decimal(str(income_val or "0.00"))

        expense_val = db.query(func.coalesce(func.sum(Transaction.amount), Decimal("0.00"))).filter(
            Transaction.user_id == user_id, Transaction.type == "expense"
        ).scalar()
        total_expense = Decimal(str(expense_val or "0.00"))

        net_savings = total_income - total_expense

        # Category spending
        cat_rows = (
            db.query(Transaction.category, func.sum(Transaction.amount).label("amt"))
            .filter(Transaction.user_id == user_id, Transaction.type == "expense")
            .group_by(Transaction.category)
            .order_by(func.sum(Transaction.amount).desc())
            .all()
        )
        top_categories = {cat: float(amt) for cat, amt in cat_rows[:4]}
        largest_cat = cat_rows[0][0] if cat_rows else "None"
        largest_amt = float(cat_rows[0][1]) if cat_rows else 0.0

        # Goals total
        vault_val = db.query(func.coalesce(func.sum(SavingsGoal.current_amount), Decimal("0.00"))).filter(
            SavingsGoal.user_id == user_id
        ).scalar()
        total_saved_in_goals = Decimal(str(vault_val or "0.00"))

        # Budget count
        budgets_count = db.query(Budget).filter(Budget.user_id == user_id).count()

        grounded_data: Dict[str, Any] = {
            "total_income": float(total_income),
            "total_expenses": float(total_expense),
            "net_savings": float(net_savings),
            "largest_category": largest_cat,
            "largest_category_amount": largest_amt,
            "top_categories": top_categories,
            "total_savings_in_goals": float(total_saved_in_goals),
            "active_budgets_count": budgets_count,
        }

        # Followup recommendations
        followups = [
            "What is my largest spending category?",
            "How much have I accumulated in savings goals?",
            "Can you suggest a spending cut for next month?",
        ]

        # 1. Attempt generation with NVIDIA NIM (if configured)
        if settings.NVIDIA_API_KEY and settings.NVIDIA_API_KEY.startswith("nvapi-"):
            try:
                system_prompt = (
                    "You are FinShield AI, an empathetic financial coach and financial safety mentor for students and young adults. "
                    "You MUST ground all responses strictly in the real user financial numbers provided below. "
                    "Never invent transaction records or hallucinate balances. Keep your reply concise (3-4 sentences max), "
                    "actionable, and supportive.\n\n"
                    f"Verified User Financial Data:\n{json.dumps(grounded_data, indent=2)}"
                )
                headers = {
                    "Authorization": f"Bearer {settings.NVIDIA_API_KEY}",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
                payload = {
                    "model": settings.NVIDIA_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": request.question},
                    ],
                    "temperature": 0.2,
                    "max_tokens": 180,
                }
                with httpx.Client(timeout=10.0) as client:
                    resp = client.post(f"{settings.NVIDIA_BASE_URL}/chat/completions", headers=headers, json=payload)
                    if resp.status_code == 200:
                        ans = resp.json()["choices"][0]["message"]["content"].strip()
                        return CopilotAnswerResponse(
                            question=request.question,
                            answer=ans,
                            grounded_metrics=grounded_data,
                            suggested_followups=followups,
                            ai_provider="NVIDIA NIM (Llama 3.2)",
                        )
            except Exception:
                pass  # Fall through to deterministic engine

        # 2. Deterministic Insights Engine (Guaranteed zero-failure fallback)
        q_lower = request.question.lower()
        if any(w in q_lower for w in ["largest", "biggest", "category", "where did money go"]):
            if largest_cat != "None":
                answer = (
                    f"Your largest spending category is '{largest_cat}', accounting for ₹{largest_amt:.2f} of your "
                    f"total ₹{float(total_expense):.2f} in recorded expenses. Focusing on small weekly reductions in "
                    f"'{largest_cat}' will deliver the quickest boost to your cash cushion."
                )
            else:
                answer = "You haven't logged any expenses yet! Once you record transactions, I'll calculate your highest spending areas."

        elif any(w in q_lower for w in ["saved", "savings", "goal", "vault"]):
            answer = (
                f"You currently have ₹{float(total_saved_in_goals):.2f} allocated across your active savings goals, "
                f"with a net cash surplus of ₹{float(net_savings):.2f} across all logged transactions. Keep funneling "
                f"regular spare change into your goals to maintain momentum."
            )

        elif any(w in q_lower for w in ["afford", "buy", "spend", "purchase"]):
            safe_cushion = max(0.0, float(net_savings) * 0.35)
            answer = (
                f"Based on your recorded net balance of ₹{float(net_savings):.2f}, you have an estimated discretionary "
                f"buffer of around ₹{safe_cushion:.2f} that you can spend without putting pressure on your upcoming baseline needs."
            )

        else:
            answer = (
                f"Here is your current financial snapshot: You have logged ₹{float(total_income):.2f} in income and "
                f"₹{float(total_expense):.2f} in expenses, leaving a net cushion of ₹{float(net_savings):.2f}. Your "
                f"highest expense category is '{largest_cat}' (₹{largest_amt:.2f})."
            )

        return CopilotAnswerResponse(
            question=request.question,
            answer=answer,
            grounded_metrics=grounded_data,
            suggested_followups=followups,
            ai_provider="FinShield Deterministic Engine",
        )
