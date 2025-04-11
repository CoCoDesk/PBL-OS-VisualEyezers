#include <stdio.h>
#include <stdlib.h>
struct process {
    int pid, at, bt, ct, st, rt;
    float tat, wt;
};
typedef struct process process;
int compareAT(const void *p1, const void *p2) {
    int a = ((process *)p1)->at;
    int b = ((process *)p2)->at;
    return (a == b) ? 0 : (a < b) ? -1 : 1;
}
int compareST(const void *p1, const void *p2) {
    int st1 = ((process *)p1)->st;
    int st2 = ((process *)p2)->st;
    return (st1 == st2) ? 0 : (st1 < st2) ? -1 : 1;
}
int compareId(const void *p1,const void *p2){
	int a=((process *)p1)->pid;
	int b=((process *)p2)->pid;
	return a-b;
}
int main() {
    int n;
    printf("Enter number of processes: ");
    scanf("%d", &n);
    process p[n];
    // Input arrival and burst times for each process
    for (int i = 0; i < n; i++) {
        printf("\nEnter arrival time for process P%d: ", i + 1);
        scanf("%d", &p[i].at);
        printf("Enter burst time for process P%d: ", i + 1);
        scanf("%d", &p[i].bt);
        p[i].pid = i + 1;
    }
    // Sort processes by arrival time
    qsort((void *)p, n, sizeof(process), compareAT);
    float totalBt = 0.0, totalWt = 0.0, totalTat = 0.0;
    // Calculate completion time, turnaround time, waiting time, etc.
    for (int i = 0; i < n; i++) {
        if (i == 0) {
            p[i].st = p[i].at;
        } else {
            p[i].st = (p[i].at > p[i - 1].ct) ? p[i].at : p[i - 1].ct;
        }
        p[i].ct = p[i].st + p[i].bt;
        p[i].tat = p[i].ct - p[i].at;
        p[i].wt = p[i].tat - p[i].bt;
        p[i].rt = p[i].wt;

        totalBt += p[i].bt;
        totalWt += p[i].wt;
        totalTat += p[i].tat;
    }
    // Calculate averages and CPU utilization
    float avgWt = totalWt / n;
    float avgTat = totalTat / n;
    float endTime = 0;
    for (int i = 0; i < n; i++) {
        if (p[i].ct > endTime) {
            endTime = p[i].ct;
        }
    }
    float cpu_utilization = (totalBt / endTime) * 100;
    float throughput = n / endTime;
    // Print Gantt chart sequence (only process IDs in execution order)
    qsort((void *)p, n, sizeof(process), compareST);
    printf("\nGantt Chart Process Sequence:\n|");
    for (int i = 0; i < n; i++) {
        printf("  P%d  |", p[i].pid);
    }
    printf("\n");
    // Print process details sorted by PID
    qsort((void *)p,n,sizeof(process),compareId);
    printf("\nPID\tAT\tBT\tST\tCT\tTAT\t\tWT\t\tRT\n");
    for (int i = 0; i < n; i++) {
        printf("P%d\t%d\t%d\t%d\t%d\t%.2f\t\t%.2f\t\t%d\n", 
            p[i].pid, p[i].at, p[i].bt, p[i].st, p[i].ct, p[i].tat, p[i].wt, p[i].rt);
    }
    // Print totals and averages
    printf("\nTotal Turn Around Time: %.2f\nAverage Turn Around Time: %.2f\n", totalTat, avgTat);
    printf("Total Waiting Time: %.2f\nAverage Waiting Time: %.2f\n", totalWt, avgWt);
    printf("CPU Utilization: %.2f%%\nThroughput: %.2f processes/unit time\n", cpu_utilization, throughput);

    return 0;
}
