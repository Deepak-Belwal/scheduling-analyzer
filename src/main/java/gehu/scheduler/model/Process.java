package gehu.scheduler.model;

public class Process {
    private String pid;
    private int burstTime;
    private int arrivalTime;

    public Process() {}

    public Process(String pid, int burstTime, int arrivalTime) {
        this.pid = pid;
        this.burstTime = burstTime;
        this.arrivalTime = arrivalTime;
    }

    public String getPid() { return pid; }
    public void setPid(String pid) { this.pid = pid; }

    public int getBurstTime() { return burstTime; }
    public void setBurstTime(int burstTime) { this.burstTime = burstTime; }

    public int getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(int arrivalTime) { this.arrivalTime = arrivalTime; }
}
