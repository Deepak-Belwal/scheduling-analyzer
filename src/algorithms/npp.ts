import { ganttChartInfoType } from '.';

export const npp = (
  arrivalTime: number[],
  burstTime: number[],
  priorities: number[]
) => {
  const processesInfo = arrivalTime
    .map((item, index) => {
      const job =
        arrivalTime.length > 26
          ? `P${index + 1}`
          : (index + 10).toString(36).toUpperCase();

      return {
        job,
        at: item,
        bt: burstTime[index],
        priority: priorities[index],
      };
    })
    .sort((a, b) => {
      if (a.at > b.at) return 1;
      if (a.at < b.at) return -1;
      if (a.priority > b.priority) return 1;
      if (a.priority < b.priority) return -1;
      return 0;
    });

  let finishTime: number[] = [];
  let ganttChartInfo: ganttChartInfoType = [];
  const solvedProcessesInfo: any[] = [];
  const readyQueue: any[] = [];
  const finishedJobs: any[] = [];

  for (let i = 0; i < processesInfo.length; i++) {
    if (i === 0) {
      readyQueue.push(processesInfo[0]);
      finishTime.push(processesInfo[0].at + processesInfo[0].bt);
      solvedProcessesInfo.push({
        ...processesInfo[0],
        ft: finishTime[0],
        tat: finishTime[0] - processesInfo[0].at,
        wat: finishTime[0] - processesInfo[0].at - processesInfo[0].bt,
      });
      processesInfo.forEach((p) => {
        if (p.at <= finishTime[0] && !readyQueue.includes(p)) {
          readyQueue.push(p);
        }
      });
      readyQueue.shift();
      finishedJobs.push(processesInfo[0]);
      ganttChartInfo.push({
        job: processesInfo[0].job,
        start: processesInfo[0].at,
        stop: finishTime[0],
      });
    } else {
      if (readyQueue.length === 0 && finishedJobs.length !== processesInfo.length) {
        const unfinishedJobs = processesInfo
          .filter((p) => !finishedJobs.includes(p))
          .sort((a, b) => {
            if (a.at > b.at) return 1;
            if (a.at < b.at) return -1;
            if (a.priority > b.priority) return 1;
            if (a.priority < b.priority) return -1;
            return 0;
          });
        readyQueue.push(unfinishedJobs[0]);
      }

      const rqSortedByPriority = [...readyQueue].sort((a, b) => {
        if (a.priority > b.priority) return 1;
        if (a.priority < b.priority) return -1;
        if (a.at > b.at) return 1;
        if (a.at < b.at) return -1;
        return 0;
      });

      const processToExecute = rqSortedByPriority[0];
      const previousFinishTime = finishTime[finishTime.length - 1];

      if (processToExecute.at > previousFinishTime) {
        finishTime.push(processToExecute.at + processToExecute.bt);
        ganttChartInfo.push({
          job: processToExecute.job,
          start: processToExecute.at,
          stop: finishTime[finishTime.length - 1],
        });
      } else {
        finishTime.push(previousFinishTime + processToExecute.bt);
        ganttChartInfo.push({
          job: processToExecute.job,
          start: previousFinishTime,
          stop: finishTime[finishTime.length - 1],
        });
      }

      const newestFinishTime = finishTime[finishTime.length - 1];
      solvedProcessesInfo.push({
        ...processToExecute,
        ft: newestFinishTime,
        tat: newestFinishTime - processToExecute.at,
        wat: newestFinishTime - processToExecute.at - processToExecute.bt,
      });

      processesInfo.forEach((p) => {
        if (p.at <= newestFinishTime && !readyQueue.includes(p) && !finishedJobs.includes(p)) {
          readyQueue.push(p);
        }
      });

      const indexToRemove = readyQueue.indexOf(processToExecute);
      if (indexToRemove > -1) readyQueue.splice(indexToRemove, 1);
      finishedJobs.push(processToExecute);
    }
  }

  solvedProcessesInfo.sort((a, b) => {
    if (a.at > b.at) return 1;
    if (a.at < b.at) return -1;
    if (a.job > b.job) return 1;
    if (a.job < b.job) return -1;
    return 0;
  });

  const n = solvedProcessesInfo.length;
  const avgWaitingTime =
    n > 0 ? solvedProcessesInfo.reduce((sum, p) => sum + p.wat, 0) / n : 0;
  const avgTurnAroundTime =
    n > 0 ? solvedProcessesInfo.reduce((sum, p) => sum + p.tat, 0) / n : 0;

  return { solvedProcessesInfo, ganttChartInfo, avgWaitingTime, avgTurnAroundTime };
};
