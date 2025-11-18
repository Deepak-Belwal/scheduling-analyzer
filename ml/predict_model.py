# ml/predict_model.py
import sys
import json
import os
import joblib
import numpy as np

# ---------- Build Features (MUST match your training pipeline) ----------
def build_features(processes, quantum: int = 2):
    n = len(processes)

    if n == 0:
        return [0, 0, 0, 0, 0, 0]

    burst_times = [p.get("burstTime", 0) for p in processes]
    arrival_times = [p.get("arrivalTime", 0) for p in processes]

    avg_bt = sum(burst_times) / n
    max_bt = max(burst_times)
    min_bt = min(burst_times)

    avg_at = sum(arrival_times) / n
    max_at = max(arrival_times)

    return [n, avg_bt, max_bt, min_bt, avg_at, max_at]


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No payload received"}))
        return

    payload = json.loads(sys.argv[1])

    processes = payload.get("processes", [])
    quantum = int(payload.get("quantum", 2))

    X = np.array([build_features(processes, quantum)])

    # ---------- Load the trained model ----------
    here = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(here, "model.joblib")  # <-- important!

    model = joblib.load(model_path)

    # Prediction: model returns class index or class label
    prediction = model.predict(X)[0]

    # If your model returns index, map it here:
    idx_to_algo = {
        0: "FCFS",
        1: "SJF",
        2: "SRTF",
        3: "RR",
        4: "NPP",
        5: "PP"
    }

    # If model already predicts string labels, this will just fallback properly.
    recommended_algorithm = idx_to_algo.get(prediction, str(prediction))

    print(json.dumps({
        "recommendedAlgorithm": recommended_algorithm,
        "features": X.tolist()[0]
    }))


if __name__ == "__main__":
    main()
