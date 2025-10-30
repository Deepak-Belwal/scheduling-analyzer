import express from "express";
import cors from "cors";
import { analyzeScheduling } from "./scheduler.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", (req, res) => {
  const { algorithm, quantum } = req.query;
  const processes = req.body;

  console.log("Received request:", { algorithm, quantum, processes });

  try {
    const result = analyzeScheduling(processes, algorithm, parseInt(quantum));

    res.json(result);
  } catch (error) {
    console.error("Error in analyze endpoint:", error);
    res.status(500).json({ error: "Server error while analyzing" });
  }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
