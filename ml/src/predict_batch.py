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
        input_data = sys.stdin.read()
        if not input_data.strip():
            print(json.dumps([]))
            return
        
        pairs = json.loads(input_data)
        if not pairs:
            print(json.dumps([]))
            return

        model_data = joblib.load(MODEL_PATH)
        model = model_data["model"]
        feature_columns = model_data["features"]

        results = []
        for pair in pairs:
            rec1 = pair["record1"]
            rec2 = pair["record2"]
            features = extract_features(rec1, rec2)
            feature_values = [features[col] for col in feature_columns]
            
            probs = model.predict_proba([feature_values])[0]
            results.append(float(probs[1]))
            
        print(json.dumps(results))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
