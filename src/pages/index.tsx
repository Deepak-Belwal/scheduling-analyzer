import Head from 'next/head';
import React, { useState } from 'react';
import styled from 'styled-components';
import Input from '../components/Input';
import Output from '../components/Output';
import { media } from '../components/GlobalStyle.css';

const Main = styled.main`
  display: flex;
  ${media['1050']`flex-direction: column;`}
  margin: 45px auto 1rem !important;
  ${media['600']`margin: 20px auto 1rem !important`};
  gap: clamp(0.5rem, 2.5vw, 4rem);
  ${media['1050']`gap: 0.75rem`};
`;

const Footer = styled.footer`
  padding: 20px 0 40px 0;
  display: flex;
  align-items: center;
  ${media['600']`
    font-size: 14px;
  `}
  a {
    display: inline-flex;
    align-items: center;
    transition: color 0.3s;

    svg {
      margin-right: 0.5rem;
      transition: fill 0.3s;
      width: 20px;
      height: 20px;
      ${media['600']`
        width: 18px;
        height: 18px;
      `}
    }

    &:hover {
      color: #005bff;

      svg {
        fill: #005bff;
      }
    }
  }
`;

const Separator = styled.div`
  margin: 0 1rem;
  width: 1px;
  height: 16px;
  background-color: rgb(0 0 0 / 50%);
`;

export default function Home() {
  const [selectedAlgo, setSelectedAlgo] = useState(null);
  const [arrivalTime, setArrivalTime] = useState<number[]>([]);
  const [burstTime, setBurstTime] = useState<number[]>([]);
  const [timeQuantum, setTimeQuantum] = useState<number>();
  const [priorities, setPriorities] = useState<number[]>([]);

  const [history, setHistory] = useState<
    { algorithm: string; avgWaitingTime: number; avgTurnAroundTime: number }[]
  >([]);

  return (
    <div>
      <Head>
        <title>Process Scheduling Solver</title>
        <meta
          name="description"
          content="Dynamically generates gantt chart and calculates TAT (turnaround time) and WAT (waiting time) based on various CPU scheduling algorithms."
        />
        <meta property="og:title" content="Process Scheduling Solver" />
        <meta
          property="og:description"
          content="Dynamically generates gantt chart and calculates TAT (turnaround time) and WAT (waiting time) based on various CPU scheduling algorithms."
        />
      </Head>

      <Main className="container">
        <Input
          selectedAlgo={selectedAlgo}
          setSelectedAlgo={setSelectedAlgo}
          setArrivalTime={setArrivalTime}
          setBurstTime={setBurstTime}
          setTimeQuantum={setTimeQuantum}
          setPriorities={setPriorities}
        />
        <Output
          selectedAlgo={selectedAlgo}
          arrivalTime={arrivalTime}
          burstTime={burstTime}
          timeQuantum={timeQuantum}
          priorities={priorities}
          setHistory={setHistory}
        />
      </Main>

      {history.length > 0 && (
        <div className="container" style={{ marginTop: '2rem' }}>
          <h3>Previous Runs</h3>
          {history.map((h, i) => (
            <div key={i}>
              <strong>{h.algorithm}</strong> : Avg Waiting Time -{' '}
              {h.avgWaitingTime.toFixed(2)} ; Avg Turn Around Time -{' '}
              {h.avgTurnAroundTime.toFixed(2)}
            </div>
          ))}
        </div>
      )}

      <Footer className="container">
        <a
          href="https://github.com/Deepak-Belwal/scheduling-analyzer.git"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </Footer>
    </div>
  );
}
