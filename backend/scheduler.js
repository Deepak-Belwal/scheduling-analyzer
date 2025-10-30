function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function fcfs(processes) {
  let currentTime = 0;
  const results = [];
  for (const p of processes) {
    const start = Math.max(p.arrivalTime, currentTime);
    const finish = start + p.burstTime;
    const tat = finish - p.arrivalTime;
    const wt = tat - p.burstTime;
    results.push({ ...p, start, finish, tat, wt });
    currentTime = finish;
  }
  return { algo: "FCFS", avgWT: avg(results.map(p => p.wt)), avgTAT: avg(results.map(p => p.tat)) };
}

function sjf(processes) {
  const procs = [...processes];
  let currentTime = 0, completed = [];
  while (procs.length) {
    const available = procs.filter(p => p.arrivalTime <= currentTime);
    if (!available.length) { currentTime++; continue; }
    const next = available.reduce((a, b) => a.burstTime < b.burstTime ? a : b);
    currentTime = Math.max(currentTime, next.arrivalTime) + next.burstTime;
    const tat = currentTime - next.arrivalTime;
    const wt = tat - next.burstTime;
    completed.push({ ...next, tat, wt });
    procs.splice(procs.indexOf(next), 1);
  }
  return { algo: "SJF", avgWT: avg(completed.map(p => p.wt)), avgTAT: avg(completed.map(p => p.tat)) };
}

function srtf(processes) {
  const n = processes.length;
  const remaining = processes.map(p => p.burstTime);
  const wt = Array(n).fill(0);
  const tat = Array(n).fill(0);
  let time = 0, complete = 0;
  while (complete < n) {
    let idx = -1, min = Infinity;
    for (let i = 0; i < n; i++) {
      if (processes[i].arrivalTime <= time && remaining[i] > 0 && remaining[i] < min) {
        min = remaining[i]; idx = i;
      }
    }
    if (idx === -1) { time++; continue; }
    remaining[idx]--; time++;
    if (remaining[idx] === 0) {
      complete++; const finish = time;
      tat[idx] = finish - processes[idx].arrivalTime;
      wt[idx] = tat[idx] - processes[idx].burstTime;
    }
  }
  return { algo: "SRTF", avgWT: avg(wt), avgTAT: avg(tat) };
}

function rr(processes, quantum = 2) {
  const n = processes.length;
  const rem = processes.map(p => p.burstTime);
  const wt = Array(n).fill(0);
  const tat = Array(n).fill(0);
  let time = 0, done = 0;
  while (done < n) {
    let progress = false;
    for (let i = 0; i < n; i++) {
      if (processes[i].arrivalTime <= time && rem[i] > 0) {
        const exec = Math.min(quantum, rem[i]);
        rem[i] -= exec; time += exec; progress = true;
        if (rem[i] === 0) {
          done++; tat[i] = time - processes[i].arrivalTime;
          wt[i] = tat[i] - processes[i].burstTime;
        }
      }
    }
    if (!progress) time++;
  }
  return { algo: "RR", avgWT: avg(wt), avgTAT: avg(tat) };
}

function npp(processes) {
  const procs = [...processes];
  let currentTime = 0, completed = [];
  while (procs.length) {
    const available = procs.filter(p => p.arrivalTime <= currentTime);
    if (!available.length) { currentTime++; continue; }
    const next = available.reduce((a, b) => a.priority < b.priority ? a : b);
    currentTime = Math.max(currentTime, next.arrivalTime) + next.burstTime;
    const tat = currentTime - next.arrivalTime;
    const wt = tat - next.burstTime;
    completed.push({ ...next, tat, wt });
    procs.splice(procs.indexOf(next), 1);
  }
  return { algo: "NPP", avgWT: avg(completed.map(p => p.wt)), avgTAT: avg(completed.map(p => p.tat)) };
}

function pp(processes) {
  const n = processes.length;
  const remaining = processes.map(p => p.burstTime);
  const wt = Array(n).fill(0);
  const tat = Array(n).fill(0);
  let time = 0, complete = 0;
  while (complete < n) {
    let idx = -1, best = Infinity;
    for (let i = 0; i < n; i++) {
      if (processes[i].arrivalTime <= time && remaining[i] > 0 && processes[i].priority < best) {
        best = processes[i].priority; idx = i;
      }
    }
    if (idx === -1) { time++; continue; }
    remaining[idx]--; time++;
    if (remaining[idx] === 0) {
      complete++; const finish = time;
      tat[idx] = finish - processes[idx].arrivalTime;
      wt[idx] = tat[idx] - processes[idx].burstTime;
    }
  }
  return { algo: "PP", avgWT: avg(wt), avgTAT: avg(tat) };
}


function analyzeScheduling(processes, algorithm, quantum = 2) {
  console.log("🔹 Received:", { algorithm, quantum, processes });

  let result;
  switch (algorithm.toUpperCase()) {
    case "FCFS":
      result = fcfs(processes);
      break;
    case "SJF":
      result = sjf(processes);
      break;
    case "SRTF":
      result = srtf(processes);
      break;
    case "RR":
      result = rr(processes, quantum);
      break;
    case "NPP":
      result = npp(processes);
      break;
    case "PP":
      result = pp(processes);
      break;
    default:
      result = { error: "Unknown algorithm" };
  }

  console.log("Result:", result);
  if (result && typeof result === 'object') {
    if ('avgWT' in result) result.avgWaitingTime = result.avgWT;
    if ('avgTAT' in result) result.avgTurnAroundTime = result.avgTAT;
    delete result.avgWT;
    delete result.avgTAT;
  }

  return result;
}


export { analyzeScheduling };
