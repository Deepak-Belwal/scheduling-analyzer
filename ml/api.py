from fastapi import FastAPI
from pydantic import BaseModel
from joblib import load

app = FastAPI()
model = load("model.joblib")

class Features(BaseModel):
    n: int
    avgBT: float
    maxBT: float
    minBT: float
    avgAT: float
    maxAT: float

@app.post("/recommend")
def recommend(feats: Features):
    X = [[feats.n, feats.avgBT, feats.maxBT, feats.minBT, feats.avgAT, feats.maxAT]]
    pred = model.predict(X)[0]
    return {"recommendedAlgorithm": pred}
