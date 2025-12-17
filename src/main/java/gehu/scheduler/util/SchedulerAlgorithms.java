package gehu.scheduler.util;

import gehu.scheduler.model.Process;
import java.util.*;

public class SchedulerAlgorithms {

    // ---------- FCFS ----------
    public static SchedulerResult fcfs(List<Process> processes) {
        processes.sort(Comparator.comparingInt(Process::getArrivalTime));
        List<String> order = new ArrayList<>();
        List<String> ganttChart = new ArrayList<>();

        int time = 0, totalWT = 0, totalTAT = 0;

        for (Process p : processes) {
            int start = Math.max(time, p.getArrivalTime());
            int finish = start + p.getBurstTime();
            ganttChart.add(p.getPid() + "(" + start + "-" + finish + ")");
            time = finish;
            totalWT += start - p.getArrivalTime();
            totalTAT += finish - p.getArrivalTime();
            order.add(p.getPid());
        }

        double avgWT = (double) totalWT / processes.size();
        double avgTAT = (double) totalTAT / processes.size();

        return new SchedulerResult(order, avgWT, avgTAT, ganttChart);
    }

    // ---------- SJF (Non-preemptive) ----------
    public static SchedulerResult sjf(List<Process> processes) {
    List<Process> remaining = new ArrayList<>(processes);
    List<String> order = new ArrayList<>();
    List<String> ganttChart = new ArrayList<>();

    int time = 0, totalWT = 0, totalTAT = 0;

    while (!remaining.isEmpty()) {
        // Collect all processes that have arrived
        List<Process> available = new ArrayList<>();
        for (Process p : remaining) {
            if (p.getArrivalTime() <= time) {
                available.add(p);
            }
        }

        if (available.isEmpty()) {
            time++;
            continue;
        }

        // Find the process with the smallest burst time
        Process shortest = available.get(0);
        for (Process p : available) {
            if (p.getBurstTime() < shortest.getBurstTime()) {
                shortest = p;
            }
        }

        int start = Math.max(time, shortest.getArrivalTime());
        int finish = start + shortest.getBurstTime();
        ganttChart.add(shortest.getPid() + "(" + start + "-" + finish + ")");
        time = finish;

        totalWT += start - shortest.getArrivalTime();
        totalTAT += finish - shortest.getArrivalTime();
        order.add(shortest.getPid());
        remaining.remove(shortest);
    }

    double avgWT = (double) totalWT / processes.size();
    double avgTAT = (double) totalTAT / processes.size();

    return new SchedulerResult(order, avgWT, avgTAT, ganttChart);
}


    // ---------- Round Robin ----------
    public static SchedulerResult roundRobin(List<Process> processes, int quantum) {
        Queue<Process> queue = new LinkedList<>();
        List<String> order = new ArrayList<>();
        List<String> ganttChart = new ArrayList<>();

        Map<String, Integer> remainingTime = new HashMap<>();
        processes.forEach(p -> remainingTime.put(p.getPid(), p.getBurstTime()));

        int time = 0, totalWT = 0, totalTAT = 0;
        processes.sort(Comparator.comparingInt(Process::getArrivalTime));
        int index = 0;

        while (!queue.isEmpty() || index < processes.size()) {
            while (index < processes.size() && processes.get(index).getArrivalTime() <= time) {
                queue.add(processes.get(index++));
            }

            if (queue.isEmpty()) {
                time = processes.get(index).getArrivalTime();
                continue;
            }

            Process current = queue.poll();
            int remaining = remainingTime.get(current.getPid());
            int execTime = Math.min(quantum, remaining);

            ganttChart.add(current.getPid() + "(" + time + "-" + (time + execTime) + ")");
            order.add(current.getPid());

            time += execTime;
            remainingTime.put(current.getPid(), remaining - execTime);

            while (index < processes.size() && processes.get(index).getArrivalTime() <= time) {
                queue.add(processes.get(index++));
            }

            if (remaining - execTime > 0) {
                queue.add(current);
            } else {
                totalWT += time - current.getArrivalTime() - current.getBurstTime();
                totalTAT += time - current.getArrivalTime();
            }
        }

        double avgWT = (double) totalWT / processes.size();
        double avgTAT = (double) totalTAT / processes.size();

        return new SchedulerResult(order, avgWT, avgTAT, ganttChart);
    }
}
