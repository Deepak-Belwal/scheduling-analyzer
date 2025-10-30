import React, {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import styled from 'styled-components';
import AlgoSelect, { OptionType, defaultOption } from './AlgoSelect';
import Button from './Button';
import { invalidInputSwal } from './swal';
import { media } from '../GlobalStyle.css';

const StyledInput = styled.div`
  padding: 1rem 2rem 2rem 2rem;
  ${media['600']`padding: 0.5rem 1.1rem 1.5rem 1.1rem;`}
  background: #ffffff;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1),
    0px 2px 32px rgba(15, 91, 206, 0.1);
  border-radius: 15px;
  align-self: flex-start;
  ${media['1050']`align-self: normal;max-width: 100%;width: 100%;`}
  min-width: 230px;
  max-width: 335px;
  width: 26.5vw;
`;

const Form = styled.form`
  & > * + * {
    margin-top: 20px;
  }

  fieldset {
    padding: 0;
    margin-left: 0;
    margin-right: 0;
    border: none;
  }

  label {
    display: inline-block;
    font-size: 14px;
    padding-bottom: 8px;
  }

  input {
    width: 100%;
    border: 1px solid #c5c7d0;
    border-radius: 5px;
    padding: 11px 12px;
    transition: all 0.2s ease-out;
    font-size: 14px;

    &:hover {
      background-color: #fafafa;
      border-color: rgb(179, 179, 179);
    }

    &:focus {
      border-color: #2684ff;
      background-color: #fff;
      outline: none;
    }
  }

  button {
    background-color: #2684ff;
    border-radius: 5px;
    color: #fff;
    width: 5.625rem;
    height: 2.5rem;
    transition: background-color 0.2s ease-out;
    position: relative;
    overflow: hidden;

    &:hover {
      background-color: #005bff;
    }
  }

  span.ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms ease-out;
    background-color: rgba(255, 255, 255, 0.7);
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #f7f9fc;
    color: #333;
  }

  tr.best {
    background-color: #e8f8ef;
    font-weight: 600;
    color: #0b8900;
  }

  tr:hover {
    background-color: #f0f4ff;
  }
`;

type InputProps = {
  selectedAlgo: OptionType;
  setSelectedAlgo: Dispatch<SetStateAction<{}>>;
  setArrivalTime: Dispatch<SetStateAction<number[]>>;
  setBurstTime: Dispatch<SetStateAction<number[]>>;
  setTimeQuantum: Dispatch<SetStateAction<number>>;
  setPriorities: Dispatch<SetStateAction<number[]>>;
};

const Input = (props: InputProps) => {
  const [selectedAlgo, setSelectedAlgo] = useState(defaultOption);
  const [arrivalTime, setArrivalTime] = useState('');
  const [burstTime, setBurstTime] = useState('');
  const [timeQuantum, setTimeQuantum] = useState('');
  const [priorities, setPriorities] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [resultsList, setResultsList] = useState<any[]>([]);

  const arrivalTimeRef = useRef<HTMLInputElement>(null);
  const burstTimeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (arrivalTimeRef.current && burstTimeRef.current) {
      arrivalTimeRef.current.value = '';
      burstTimeRef.current.value = '';
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const arrivalTimeArr = arrivalTime
      .trim()
      .split(/\s+/)
      .map((at) => parseInt(at));
    const burstTimeArr = burstTime
      .trim()
      .split(/\s+/)
      .map((bt) => parseInt(bt));
    const timeQuantumInt = parseInt(timeQuantum);
    let prioritiesArr = priorities
      .trim()
      .split(/\s+/)
      .map((priority) => parseInt(priority));

    if (burstTimeArr.includes(0)) {
      invalidInputSwal('0 burst time is invalid');
      return;
    } else if (arrivalTimeArr.length !== burstTimeArr.length) {
      invalidInputSwal('Number of arrival times and burst times do not match');
      return;
    } else if (
      arrivalTimeArr.some(isNaN) ||
      burstTimeArr.some(isNaN) ||
      (selectedAlgo.value === 'RR' && isNaN(timeQuantumInt))
    ) {
      invalidInputSwal('Please enter only integers');
      return;
    } else if (
      arrivalTimeArr.some((t) => t < 0) ||
      burstTimeArr.some((t) => t < 0)
    ) {
      invalidInputSwal('Negative numbers are invalid');
      return;
    }

    if (selectedAlgo.value === 'NPP' || selectedAlgo.value === 'PP') {
      if (priorities.trim() === '') {
        prioritiesArr = arrivalTimeArr.map(() => 0);
      } else if (prioritiesArr.length !== arrivalTimeArr.length) {
        invalidInputSwal('Arrival, burst, and priorities must match in length');
        return;
      }
    }

    props.setSelectedAlgo(selectedAlgo);
    props.setArrivalTime(arrivalTimeArr);
    props.setBurstTime(burstTimeArr);
    props.setTimeQuantum(timeQuantumInt);
    props.setPriorities(prioritiesArr);
  };

  const handleAnalyze = async () => {
    console.log("🔵 Analyze clicked");

    setRecommendation(null);
    setResultsList([]);
    let algorithms: string[] = [];

    if (selectedAlgo.value === 'RR') algorithms = ['FCFS', 'SJF', 'SRTF', 'RR'];
    else if (selectedAlgo.value === 'NPP' || selectedAlgo.value === 'PP')
      algorithms = ['FCFS', 'SJF', 'SRTF', 'NPP', 'PP'];
    else algorithms = ['FCFS', 'SJF', 'SRTF'];

    console.log("📊 Algorithms to test:", algorithms);

    const arrivalArr = arrivalTime.trim().split(/\s+/).map(Number);
    const burstArr = burstTime.trim().split(/\s+/).map(Number);
    const tq = parseInt(timeQuantum);

    console.log("📥 Input data:", { arrivalArr, burstArr, tq });

    if (arrivalArr.length !== burstArr.length) {
      invalidInputSwal('Number of arrival and burst times must match');
      return;
    }

    const allResults: any[] = [];

    for (const algo of algorithms) {
      try {
        console.log(`🚀 Sending request to backend for ${algo}...`);
        const response = await fetch(
          `http://localhost:5000/analyze?algorithm=${algo}&quantum=${tq || 2}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
              arrivalArr.map((at, i) => ({
                arrivalTime: at,
                burstTime: burstArr[i],
                priority: 0,
              }))
            ),
          }
        );

        if (!response.ok) {
          console.error(`HTTP error for ${algo}:`, response.status);
          continue;
        }

        const data = await response.json();
        console.log(`Response for ${algo}:`, data);

        allResults.push({
          algo,
          avgWaitingTime: data.avgWaitingTime ?? NaN,
          avgTurnAroundTime: data.avgTurnAroundTime ?? NaN,
        });
      } catch (err) {
        console.error(`Error analyzing ${algo}:`, err);
      }
    }

    console.log("All results collected:", allResults);

    if (allResults.length > 0) {
      let best = allResults[0];
      for (const res of allResults) {
        const currentScore =
          (res.avgWaitingTime || 99999) + (res.avgTurnAroundTime || 99999);
        const bestScore =
          (best.avgWaitingTime || 99999) + (best.avgTurnAroundTime || 99999);
        if (currentScore < bestScore) best = res;
      }

      console.log("Best algorithm found:", best);
      setResultsList(allResults);
      setRecommendation(best.algo);
    } else {
      console.warn("No valid results found!");
      setResultsList([]);
      setRecommendation("No valid result found");
    }
  };


  return (
    <StyledInput>
      <h1>Input</h1>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="react-select-algo">Algorithm</label>
          <AlgoSelect
            selectedAlgo={selectedAlgo}
            setSelectedAlgo={setSelectedAlgo}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="arrival-time">Arrival Times</label>
          <input
            onChange={(e) => setArrivalTime(e.target.value)}
            type="text"
            id="arrival-time"
            placeholder="e.g. 0 2 4 6 8"
            ref={arrivalTimeRef}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="burst-time">Burst Times</label>
          <input
            onChange={(e) => setBurstTime(e.target.value)}
            type="text"
            id="burst-time"
            placeholder="e.g. 2 4 6 8 10"
            ref={burstTimeRef}
          />
        </fieldset>
        {selectedAlgo.value === 'RR' && (
          <fieldset>
            <label htmlFor="time-quantum">Time Quantum</label>
            <input
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(e.target.value)}
              type="number"
              id="time-quantum"
              placeholder="e.g. 3"
              min="1"
              step="1"
            />
          </fieldset>
        )}
        {(selectedAlgo.value === 'NPP' || selectedAlgo.value === 'PP') && (
          <fieldset>
            <label htmlFor="priorities">Priorities</label>
            <input
              value={priorities}
              onChange={(e) => setPriorities(e.target.value)}
              type="text"
              id="priorities"
              placeholder="Lower # = higher priority"
            />
          </fieldset>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
          <Button type="submit">Solve</Button>
          <Button type="button" onClick={handleAnalyze}>
            Analyze
          </Button>
        </div>
      </Form>

      {resultsList.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Avg WT</th>
              <th>Avg TAT</th>
            </tr>
          </thead>
          <tbody>
            {resultsList.map((res, idx) => (
              <tr
                key={idx}
                className={res.algo === recommendation ? 'best' : ''}
              >
                <td>{res.algo}</td>
                <td>
                  {isNaN(res.avgWaitingTime)
                    ? 'NaN'
                    : res.avgWaitingTime.toFixed(2)}
                </td>
                <td>
                  {isNaN(res.avgTurnAroundTime)
                    ? 'NaN'
                    : res.avgTurnAroundTime.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </StyledInput>
  );
};

export default Input;
