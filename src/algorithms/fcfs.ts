import { ganttChartInfoType } from '.';

export const fcfs = (arrivalTime: number[], burstTime: number[]) => {
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
      };
    })
    .sort((obj1, obj2) => {
      if (obj1.at > obj2.at) return 1;
      if (obj1.at < obj2.at) return -1;
      return 0;
    });

  let finishTime: number[] = [];
  let ganttChartInfo: ganttChartInfoType = [];

  const solvedProcessesInfo = processesInfo.map((process, index) => {
    if (index === 0 || process.at > finishTime[index - 1]) {
      finishTime[index] = process.at + process.bt;
      ganttChartInfo.push({
        job: process.job,
        start: process.at,
        stop: finishTime[index],
      });
    } else {
      finishTime[index] = finishTime[index - 1] + process.bt;
      ganttChartInfo.push({
        job: process.job,
        start: finishTime[index - 1],
        stop: finishTime[index],
      });
    }

    return {
      ...process,
      ft: finishTime[index],
      tat: finishTime[index] - process.at,
      wat: finishTime[index] - process.at - process.bt,
    };
  });

  const n = solvedProcessesInfo.length;
  const avgWaitingTime =
    n > 0
      ? solvedProcessesInfo.reduce((sum, p) => sum + p.wat, 0) / n
      : 0;
  const avgTurnAroundTime =
    n > 0
      ? solvedProcessesInfo.reduce((sum, p) => sum + p.tat, 0) / n
      : 0;

  return { solvedProcessesInfo, ganttChartInfo, avgWaitingTime, avgTurnAroundTime };
};
