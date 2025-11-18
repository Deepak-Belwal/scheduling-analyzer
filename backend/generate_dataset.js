import fs from "fs";
import { analyzeScheduling } from "./scheduler.js";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomProcesses() {
  const n = randomInt(3, 10);
  const processes = [];
  for (let i = 0; i < n; i++) {
    processes.push({
      pid: `P${i + 1}`,
      burstTime: randomInt(1, 15),
      arrivalTime: randomInt(0, 10),
      priority: randomInt(1, 5),
    });
  }
  return processes;
}

function extractFeatures(processes) {
  const n = processes.length;
  const bursts = processes.map(p => p.burstTime);
  const arrivals = processes.map(p => p.arrivalTime);

  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const max = arr => Math.max(...arr);
  const min = arr => Math.min(...arr);

  return {
    n,
    avgBT: avg(bursts),
    maxBT: max(bursts),
    minBT: min(bursts),
    avgAT: avg(arrivals),
    maxAT: max(arrivals),
  };
}

const ALGOS = ["FCFS", "SJF", "SRTF", "RR", "NPP", "PP"];

const rows = [];
rows.push("n,avgBT,maxBT,minBT,avgAT,maxAT,label");

for (let i = 0; i < 2000; i++) {
  const processes = generateRandomProcesses();
  const feats = extractFeatures(processes);

  const results = ALGOS.map(algo => {
    const q = algo === "RR" ? 2 : 2;
    const r = analyzeScheduling(processes, algo, q);
    return { algo, avgWT: r.avgWaitingTime, avgTAT: r.avgTurnAroundTime };
  });

  const best = results.reduce((a, b) => (b.avgWT < a.avgWT ? b : a));

  rows.push(
    `${feats.n},${feats.avgBT},${feats.maxBT},${feats.minBT},${feats.avgAT},${feats.maxAT},${best.algo}`
  );
}

fs.writeFileSync("dataset.csv", rows.join("\n"), "utf8");
console.log("dataset.csv generated");
