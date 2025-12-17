package gehu.scheduler.service;

import gehu.scheduler.model.Process;
import gehu.scheduler.util.SchedulerAlgorithms;
import gehu.scheduler.util.SchedulerResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchedulerService {

    public SchedulerResult analyze(List<Process> processes, String algorithm, int quantum) {
        return switch (algorithm.toLowerCase()) {
            case "fcfs" -> SchedulerAlgorithms.fcfs(processes);
            case "sjf" -> SchedulerAlgorithms.sjf(processes);
            case "rr", "roundrobin" -> SchedulerAlgorithms.roundRobin(processes, quantum);
            default -> throw new IllegalArgumentException("Invalid algorithm: " + algorithm);
        };
    }
}
