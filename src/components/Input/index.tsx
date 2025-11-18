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
    display: flex;
    justify-content: center;
    align-items: center;
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
  // Use the parent's selectedAlgo so programmatic updates (AI recommend)
  // are immediately reflected in the UI. The parent passes these via props.
  // (props.selectedAlgo may be null initially; fall back to defaultOption)
  const selectedAlgo = (props.selectedAlgo as any) || defaultOption;
  const setSelectedAlgo = props.setSelectedAlgo;
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

    const arrivalTimeArr = arrivalTime.trim().split(/\s+/).map(Number);
    const burstTimeArr = burstTime.trim().split(/\s+/).map(Number);
    const timeQuantumInt = parseInt(timeQuantum);
    let prioritiesArr = priorities.trim().split(/\s+/).map(Number);

    if (burstTimeArr.includes(0)) {
      invalidInputSwal('0 burst time is invalid');
      return;
    }

    if (arrivalTimeArr.length !== burstTimeArr.length) {
      invalidInputSwal('Number of arrival times and burst times do not match');
      return;
    }

    if (
      arrivalTimeArr.some(isNaN) ||
      burstTimeArr.some(isNaN) ||
      (selectedAlgo.value === 'RR' && isNaN(timeQuantumInt))
    ) {
      invalidInputSwal('Please enter only integers');
      return;
    }

    if (arrivalTimeArr.some((t) => t < 0) || burstTimeArr.some((t) => t < 0)) {
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
    setRecommendation(null);
    setResultsList([]);

    let algorithms: string[] = [];

    if (selectedAlgo.value === 'RR')
      algorithms = ['FCFS', 'SJF', 'SRTF', 'RR'];
    else if (selectedAlgo.value === 'NPP' || selectedAlgo.value === 'PP')
      algorithms = ['FCFS', 'SJF', 'SRTF', 'NPP', 'PP'];
    else
      algorithms = ['FCFS', 'SJF', 'SRTF'];

    const arrivalArr = arrivalTime.trim().split(/\s+/).map(Number);
    const burstArr = burstTime.trim().split(/\s+/).map(Number);
    const tq = parseInt(timeQuantum);

    if (arrivalArr.length !== burstArr.length) {
      invalidInputSwal('Number of arrival and burst times must match');
      return;
    }

    const allResults: any[] = [];

    for (const algo of algorithms) {
      try {
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

        const data = await response.json();

        allResults.push({
          algo,
          avgWaitingTime: data.avgWaitingTime ?? NaN,
          avgTurnAroundTime: data.avgTurnAroundTime ?? NaN,
        });
      } catch (err) {
        console.error(`Error analyzing ${algo}:`, err);
      }
    }

    if (allResults.length > 0) {
      let best = allResults[0];
      for (const res of allResults) {
        const score =
          (res.avgWaitingTime || 99999) +
          (res.avgTurnAroundTime || 99999);

        const bestScore =
          (best.avgWaitingTime || 99999) +
          (best.avgTurnAroundTime || 99999);

        if (score < bestScore) best = res;
      }

      setResultsList(allResults);
      setRecommendation(best.algo);
    }
  };

  const handleAIRecommend = async () => {
  console.log("🤖 AI Recommend clicked");

  const arrivalArr = arrivalTime.trim().split(/\s+/).map(Number);
  const burstArr = burstTime.trim().split(/\s+/).map(Number);
  const tq = parseInt(timeQuantum) || 2;

  if (arrivalArr.length !== burstArr.length) {
    invalidInputSwal("Arrival and burst time count must match");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/recommend?quantum=${tq}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          arrivalArr.map((at, i) => ({
            arrivalTime: at,
            burstTime: burstArr[i],
            priority: priorities[i] || 0,
          }))
        )
      }
    );

    const data = await response.json();
    console.log("AI Recommendation:", data);

    if (data.error) {
      invalidInputSwal("AI Model error: " + data.error);
      return;
    }

    const recommended = data.recommendedAlgorithm;

    // 🔥 Update dropdown visually
    props.setSelectedAlgo({ label: recommended, value: recommended });

    // 🔥 Update internal recommendation state
    setRecommendation(recommended);

    // 🔥 Fetch analysis for the recommended algorithm so we can show real metrics
    try {
      const processesForAnalyze = arrivalArr.map((at, i) => ({
        arrivalTime: at,
        burstTime: burstArr[i],
        priority: priorities[i] || 0,
      }));

      const analyzeResp = await fetch(
        `http://localhost:5000/analyze?algorithm=${recommended}&quantum=${tq}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(processesForAnalyze),
        }
      );

      if (!analyzeResp.ok) {
        console.error("Analyze failed for recommended algo:", analyzeResp.status);
        invalidInputSwal("Failed to fetch analysis for recommended algorithm");
        return;
      }

      const analyzeData = await analyzeResp.json();
      console.log("Analyze data for recommended:", analyzeData);

      setResultsList([
        {
          algo: recommended,
          avgWaitingTime:
            analyzeData.avgWaitingTime ?? analyzeData.avgWT ?? NaN,
          avgTurnAroundTime:
            analyzeData.avgTurnAroundTime ?? analyzeData.avgTAT ?? NaN,
        },
      ]);
    } catch (err) {
      console.error("Failed to get analysis for recommended algo:", err);
      invalidInputSwal("AI model recommended but analysis failed");
    }

  } catch (err) {
    console.error("AI Recommend error:", err);
    invalidInputSwal("AI model failed");
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
          <label>Arrival Times</label>
          <input
            onChange={(e) => setArrivalTime(e.target.value)}
            placeholder="e.g. 0 2 4 6"
            ref={arrivalTimeRef}
          />
        </fieldset>

        <fieldset>
          <label>Burst Times</label>
          <input
            onChange={(e) => setBurstTime(e.target.value)}
            placeholder="e.g. 2 4 6 8"
            ref={burstTimeRef}
          />
        </fieldset>

        {selectedAlgo.value === "RR" && (
          <fieldset>
            <label>Time Quantum</label>
            <input
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(e.target.value)}
              type="number"
              min="1"
              placeholder="e.g. 3"
            />
          </fieldset>
        )}

        {(selectedAlgo.value === "NPP" ||
          selectedAlgo.value === "PP") && (
          <fieldset>
            <label>Priorities</label>
            <input
              value={priorities}
              onChange={(e) => setPriorities(e.target.value)}
              placeholder="Lower number = higher priority"
            />
          </fieldset>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <Button type="submit">Solve</Button>
          <Button type="button" onClick={handleAnalyze}>Analyze</Button>
          <Button type="button" onClick={handleAIRecommend}>AI Recommend</Button>
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
                className={res.algo === recommendation ? "best" : ""}
              >
                <td>{res.algo}</td>
                <td>{isNaN(res.avgWaitingTime) ? "NaN" : res.avgWaitingTime.toFixed(2)}</td>
                <td>{isNaN(res.avgTurnAroundTime) ? "NaN" : res.avgTurnAroundTime.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </StyledInput>
  );
};

export default Input;
