package schedulinganalyzer.controller;

import schedulinganalyzer.dto.schedulerrequest;
import schedulinganalyzer.dto.schedulerresponse;
import schedulinganalyzer.service.schedulerservice;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scheduler")
@CrossOrigin(origins = "*") // allow all for dev; tighten for production
public class schedulercontroller {

    private final schedulerservice schedulerService;

    public schedulercontroller(SchedulerService schedulerService) {
        this.schedulerService = schedulerService;
    }

    @PostMapping("/run")
    public ResponseEntity<schedulerresponse> run(@Valid @RequestBody schedulerrequest request) {
        schedulerresponse response = schedulerservice.run(request);
        return ResponseEntity.ok(response);
    }
}
