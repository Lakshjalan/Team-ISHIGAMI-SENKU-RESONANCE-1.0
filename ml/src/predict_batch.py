import sys
import json
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from src.feature_extraction import extract_features
MODEL_PATH = BASE_DIR / "models" / "matcher.pkl"

def main():
    try:
        # Diagnostic info to stderr (doesn't affect JSON stdout)
        print(f"[ML] predict_batch.py starting", file=sys.stderr)
        print(f"[ML] Model path: {MODEL_PATH} (exists: {MODEL_PATH.exists()})", file=sys.stderr)
        
        input_data = sys.stdin.read()
        if not input_data.strip():
            print(json.dumps([]))
            return
        
        pairs = json.loads(input_data)
        if not pairs:
            print(json.dumps([]))
            return

        print(f"[ML] Received {len(pairs)} pairs to score", file=sys.stderr)

        model_data = joblib.load(MODEL_PATH)
        model = model_data["model"]
        feature_columns = model_data["features"]
        print(f"[ML] Model loaded. Features: {feature_columns}", file=sys.stderr)

        results = []
        for i, pair in enumerate(pairs):
            rec1 = pair["record1"]
            rec2 = pair["record2"]
            features = extract_features(rec1, rec2)
            feature_values = [features[col] for col in feature_columns]
            
            probs = model.predict_proba([feature_values])[0]
            score = float(probs[1])
            results.append(score)
            
            # Log high-confidence matches for debugging
            if score >= 0.60:
                print(f"[ML] Pair {i}: {rec1.get('name','')} vs {rec2.get('name','')} → {score:.4f}", file=sys.stderr)
            
        print(f"[ML] Scored {len(results)} pairs. Range: [{min(results):.4f}, {max(results):.4f}]", file=sys.stderr)
        print(json.dumps(results))
    except Exception as e:
        print(f"[ML FATAL] {type(e).__name__}: {e}", file=sys.stderr)
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
