package schedulinganalyzer.service;

import schedulinganalyzer.dto.schedulerrequest;
import schedulinganalyzer.dto.schedulerresponse;
import schedulinganalyzer.model.ProcessModel;
import schedulinganalyzer.util.scheduleralgorithms;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class schedulerservice {

    public schedulerresponse run(schedulerrequest request) {
        String algo = request.getAlgorithm().toUpperCase();
        List<ProcessModel> procs = request.getProcesses();
        Map<String,Object> res;

        switch (algo) {
            case "FCFS":
                res = scheduleralgorithms.runFCFS(procs);
                break;
            case "SJF":
                res = scheduleralgorithms.runSJF(procs);
                break;
            case "RR":
                Integer tq = request.getTimeQuantum() == null ? 2 : request.getTimeQuantum();
                res = scheduleralgorithms.runRR(procs, tq);
                break;
            case "PRIORITY":
                res = scheduleralgorithms.runPriority(procs);
                break;
            case "OPTIMIZER":
                res = scheduleralgorithms.runOptimizer(procs, request.getTimeQuantum() == null ? 2 : request.getTimeQuantum());
                break;
            default:
                throw new IllegalArgumentException("Unsupported algorithm: " + algo);
        }

        // build response
        List<schedulerresponse> dummy = null;
        @SuppressWarnings("unchecked")
        List<scheduleralgorithms.P> processes = (List<scheduleralgorithms.P>) res.get("processes");
        @SuppressWarnings("unchecked")
        List<List<String>> gantt = (List<List<String>>) res.get("gantt");

        List<Map<String,Object>> procResult = processes.stream().map(p -> {
            Map<String,Object> m = new HashMap<>();
            m.put("pid", p.pid);
            m.put("arrivalTime", p.arrivalTime);
            m.put("burstTime", p.burstTime);
            m.put("waitingTime", p.waitingTime);
            m.put("turnaroundTime", p.turnaroundTime);
            return m;
        }).collect(Collectors.toList());

        double avgWT = processes.stream().mapToInt(p -> p.waitingTime).average().orElse(0.0);
        double avgTAT = processes.stream().mapToInt(p -> p.turnaroundTime).average().orElse(0.0);

        schedulerresponse resp = new schedulerresponse();
        resp.setResults(procResult);
        resp.setGantt(gantt);
        resp.setAverageWaiting(avgWT);
        resp.setAverageTurnaround(avgTAT);
        if (res.containsKey("suggestion")) resp.setSuggestion((String) res.get("suggestion"));

        return resp;
    }
}