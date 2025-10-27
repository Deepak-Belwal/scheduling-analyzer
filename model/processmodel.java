package schedulinganalyzer.model;

public class processmodel {
    private int pid;
    private int arrivalTime;
    private int burstTime;
    private int priority;

    // constructors, getters, setters
    public processmodel() {}
    public processmodel(int pid, int arrivalTime, int burstTime, int priority) {
        this.pid = pid; this.arrivalTime = arrivalTime; this.burstTime = burstTime; this.priority = priority;
    }
    // getters / setters ...
}
