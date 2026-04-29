import hashlib
import json
import time
import os

class DecisionLedger:
    def __init__(self, storage_path="ledger.json"):
        self.storage_path = os.path.join(os.path.dirname(__file__), storage_path)
        self._ensure_file()

    def _ensure_file(self):
        if not os.path.exists(self.storage_path):
            with open(self.storage_path, 'w') as f:
                json.dump([], f)

    def log_decision(self, applicant_data: dict, ml_result: dict, xai_summary: list):
        """Creates an immutable-style log entry with a SHA-256 hash."""
        entry_data = {
            "timestamp": time.time(),
            "applicant_snapshot": applicant_data,
            "ml_decision": ml_result,
            "xai_hash": hashlib.sha256(json.dumps(xai_summary).encode()).hexdigest()
        }
        
        # Chain hash (simple version)
        with open(self.storage_path, 'r') as f:
            ledger = json.load(f)
        
        prev_hash = ledger[-1]["block_hash"] if ledger else "0" * 64
        block_content = json.dumps(entry_data) + prev_hash
        block_hash = hashlib.sha256(block_content.encode()).hexdigest()
        
        entry_data["prev_hash"] = prev_hash
        entry_data["block_hash"] = block_hash
        
        ledger.append(entry_data)
        
        with open(self.storage_path, 'w') as f:
            json.dump(ledger, f, indent=2)
            
        return block_hash

    def get_ledger(self):
        with open(self.storage_path, 'r') as f:
            return json.load(f)
