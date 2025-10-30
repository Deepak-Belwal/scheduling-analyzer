import { fcfs } from './fcfs';
import { sjf } from './sjf';
import { srtf } from './srtf';
import { rr } from './rr';
import { npp } from './npp';
import { pp } from './pp';
import { AlgoType } from '../components/Input/AlgoSelect';

export type ganttChartInfoType = {
  job: string;
  start: number;
  stop: number;
}[];

export type solvedProcessesInfoType = {
  job: string;
  at: number;
  bt: number;
  ft: number;
  tat: number;
  wat: number;
}[];

export const solve = (
  algo: AlgoType,
  arrivalTime: number[],
  burstTime: number[],
  timeQuantum: number,
  priorities: number[]
) => {
  let result;

  switch (algo) {
    case 'FCFS':
      result = fcfs(arrivalTime, burstTime);
      break;
    case 'SJF':
      result = sjf(arrivalTime, burstTime);
      break;
    case 'SRTF':
      result = srtf(arrivalTime, burstTime);
      break;
    case 'RR':
      result = rr(arrivalTime, burstTime, timeQuantum);
      break;
    case 'NPP':
      result = npp(arrivalTime, burstTime, priorities);
      break;
    case 'PP':
      result = pp(arrivalTime, burstTime, priorities);
      break;
    default:
      result = { solvedProcessesInfo: [], ganttChartInfo: [], avgWaitingTime: 0, avgTurnAroundTime: 0 };
  }

  const { solvedProcessesInfo, ganttChartInfo, avgWaitingTime, avgTurnAroundTime } = result;

  return { solvedProcessesInfo, ganttChartInfo, avgWaitingTime, avgTurnAroundTime };
};
