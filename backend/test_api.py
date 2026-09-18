# backend/test_api.py
import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def run_test(name, path, method="GET", payload=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    data = json.dumps(payload).encode("utf-8") if payload else None
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read().decode("utf-8"))
            print(f"✅ PASS: {name}")
            return body
    except Exception as e:
        print(f"❌ FAIL: {name} -> {e}")
        return None

if __name__ == "__main__":
    print("--- Running FinTech Backend API Tests ---")
    run_test("Fetch Dashboard", "/api/dashboard")
    run_test("Log Transaction", "/api/transactions", "POST", {"merchant": "Campus Grocery", "amount": 23.40})
    run_test("Alternative Credit Score", "/api/credit/alternative-score")
    run_test("Scam Scanner", "/api/security/scan-message", "POST", {"message_text": "Urgent! Share OTP now."})
    run_test("AI Advisor Chat", "/api/advisor/chat", "POST", {"message": "How much can I spend today?"})
