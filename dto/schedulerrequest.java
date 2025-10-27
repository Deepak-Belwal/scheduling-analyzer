package schedulinganalyzer.dto;

import schedulinganalyzer.model.processmodel;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class schedulerrequest {
    @NotEmpty
    private List<processmodel> processes;

    @NotNull
    private String algorithm; // "FCFS", "SJF", "RR", "PRIORITY", "OPTIMIZER"

    private Integer timeQuantum; // optional for RR

    // getters/setters
}
