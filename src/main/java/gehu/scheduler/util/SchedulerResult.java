package gehu.scheduler.util;

import java.util.List;

public class SchedulerResult {
    private List<String> order;
    private double avgWaitingTime;
    private double avgTurnaroundTime;
    private List<String> ganttChart;

    public SchedulerResult(List<String> order, double avgWaitingTime, double avgTurnaroundTime, List<String> ganttChart) {
        this.order = order;
        this.avgWaitingTime = avgWaitingTime;
        this.avgTurnaroundTime = avgTurnaroundTime;
        this.ganttChart = ganttChart;
    }

    public List<String> getOrder() {
        return order;
    }

    public double getAvgWaitingTime() {
        return avgWaitingTime;
    }

    public double getAvgTurnaroundTime() {
        return avgTurnaroundTime;
    }

    public List<String> getGanttChart() {
        return ganttChart;
    }
}
