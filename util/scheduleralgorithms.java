package schedulinganalyzer.util;

import schedulinganalyzer.model.ProcessModel;
import java.util.*;

public class scheduleralgorithms {

    public static class P {
        public int pid, arrivalTime, burstTime, remainingTime, waitingTime, turnaroundTime, priority;
        public P(int pid, int a, int b, int pr) { this.pid = pid; arrivalTime=a; burstTime=b; remainingTime=b; priority=pr; }
    }

    public static List<P> cloneInput(List<processmodel> input) {
        List<P> out = new ArrayList<>();
        for (processmodel m : input) out.add(new P(m.getPid(), m.getArrivalTime(), m.getBurstTime(), m.getPriority()));
        return out;
    }

    // FCFS
    public static Map<String, Object> runFCFS(List<processmodel> input) {
        List<P> list = cloneInput(input);
        list.sort(Comparator.comparingInt(p -> p.arrivalTime));
        int time = 0;
        List<List<String>> gantt = new ArrayList<>();
        for (P p : list) {
            if (time < p.arrivalTime) time = p.arrivalTime;
            int start = time;
            p.waitingTime = start - p.arrivalTime;
            p.turnaroundTime = p.waitingTime + p.burstTime;
            time += p.burstTime;
            gantt.add(Arrays.asList("P" + p.pid, String.valueOf(start), String.valueOf(time)));
        }
        Map<String,Object> res = new HashMap<>();
        res.put("processes", list);
        res.put("gantt", gantt);
        return res;
    }

    // SJF, RR, PRIORITY - similar refactor of your methods into static functions that return Map<String,Object>
    // For brevity, implement SJF, RR, PRIORITY using the logic from your Swing app.
}
