# ml/train_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from joblib import dump

df = pd.read_csv("../backend/dataset.csv")

X = df[["n", "avgBT", "maxBT", "minBT", "avgAT", "maxAT"]]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=200, random_state=42)
clf.fit(X_train, y_train)

print("Train accuracy:", clf.score(X_train, y_train))
print("Test  accuracy:", clf.score(X_test, y_test))

dump(clf, "model.joblib")
print("Saved model to model.joblib")
