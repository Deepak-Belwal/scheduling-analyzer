package schedulinganalyzer.dto;

import schedulinganalyzer.model.processmodel;
import java.util.List;
import java.util.Map;

public class schedulerresponse {
    private List<Map<String, Object>> results; // per-process results (pid, at, bt, wt, tat)
    private List<List<String>> gantt; // gantt blocks e.g. [["P1","0","3"], ...]
    private double averageWaiting;
    private double averageTurnaround;
    private String suggestion; // optional from optimizer

    // constructors/getters/setters
}
