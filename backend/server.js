import express from "express";
import cors from "cors";
import { analyzeScheduling } from "./scheduler.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Resolve correct directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to ml/predict_model.py
const pythonScript = path.join(__dirname, "..", "ml", "predict_model.py");

console.log("📌 Python script path:", pythonScript);

app.post("/analyze", (req, res) => {
  const { algorithm, quantum } = req.query;
  const processes = req.body;

  try {
    const result = analyzeScheduling(processes, algorithm, parseInt(quantum));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: "Analyze error", details: e.message });
  }
});

app.post("/recommend", (req, res) => {
  const processes = req.body;
  const quantum = parseInt(req.query.quantum || "2");

  console.log("🔵 /recommend called", processes);

  const payload = JSON.stringify({ processes, quantum });

  // Allow overriding python path via env var, otherwise fall back to 'python'
  const pythonPath = process.env.PYTHON_PATH || process.env.PYTHON || "python";

  console.log("📌 Using python executable:", pythonPath);

  const py = spawn(pythonPath, [pythonScript, payload]);


  let stdout = "";
  let stderr = "";

  // Track whether we've already replied to avoid multiple responses
  let replied = false;

  // Handle spawn errors (e.g., invalid python path)
  py.on('error', (err) => {
    console.error('❌ Failed to start Python process:', err);
    if (!replied) {
      replied = true;
      return res.status(500).json({ error: 'Failed to start Python', details: err.message });
    }
  });

  py.stdout.on("data", data => (stdout += data.toString()));
  py.stderr.on("data", data => (stderr += data.toString()));

  py.on("close", code => {
    if (code !== 0) {
      console.error("❌ Python error:", stderr);
      if (!replied) {
        replied = true;
        return res.status(500).json({ error: "Python error", details: stderr });
      }
      return;
    }

    try {
      const result = JSON.parse(stdout);
      if (!replied) {
        replied = true;
        res.json(result);
      }
    } catch (err) {
      console.error("❌ JSON parse fail:", stdout);
      if (!replied) {
        replied = true;
        res.status(500).json({
          error: "Invalid Python JSON",
          details: stdout
        });
      }
    }
  });
});

app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);
