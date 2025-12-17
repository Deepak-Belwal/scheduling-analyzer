package gehu.scheduler.controller;

import gehu.scheduler.model.Process;
import gehu.scheduler.service.SchedulerService;
import gehu.scheduler.util.SchedulerResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SchedulerController {

    private final SchedulerService schedulerService;

    public SchedulerController(SchedulerService schedulerService) {
        this.schedulerService = schedulerService;
    }

    @PostMapping("/analyze")
    public Map<String, Object> analyze(
            @RequestBody List<Process> processes,
            @RequestParam String algorithm,
            @RequestParam(required = false, defaultValue = "2") int quantum) {

        SchedulerResult result = schedulerService.analyze(processes, algorithm, quantum);

        Map<String, Object> response = new HashMap<>();
        response.put("order", result.getOrder());
        response.put("avgWaitingTime", result.getAvgWaitingTime());
        response.put("avgTurnaroundTime", result.getAvgTurnaroundTime());
        response.put("ganttChart", result.getGanttChart());

        return response;
    }
}
