#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
struct process {
    int id, at, bt, st, ct, rt, completed, rem_bt, priority;
    float tat, wt;
};
typedef struct process process;
int findNextProcess(process p[], int n, int currTime) {
    int highestPriority = INT_MAX;
    int minIdx = -1;
    
    for (int i = 0; i < n; i++) {
        if (p[i].completed == 0 && p[i].at <= currTime) {
            if (p[i].priority < highestPriority) {
                highestPriority = p[i].priority;
                minIdx = i;
            } 
            else if (p[i].priority == highestPriority) {
                // Tie-breaking based on arrival time and ID
                if (p[i].at < p[minIdx].at || (p[i].at == p[minIdx].at && p[i].id < p[minIdx].id)) {
                    minIdx = i;
                }
            }
        }
    }
    return minIdx;
}
int main() {
    int n;
    printf("Enter the number of processes: ");
    scanf("%d", &n);
    process p[n];
    for (int i = 0; i < n; i++) {
        printf("Enter Arrival Time, Burst Time, and Priority for P%d: ", i);
        scanf("%d%d%d", &p[i].at, &p[i].bt, &p[i].priority);
        p[i].id = i;
        p[i].completed = 0;
        p[i].rem_bt = p[i].bt;
    }
    int totalTat = 0, totalWt = 0, totalIdleTime = 0, completed = 0, currentTime = 0;
    int gChart[100], gIdx = 0;
    while (completed < n) {
        int nextP = findNextProcess(p, n, currentTime);
        if (nextP == -1) {
            currentTime++;
            totalIdleTime++;
        }
		else {
            if (p[nextP].rem_bt==p[nextP].bt) {
                p[nextP].st = currentTime;
                p[nextP].rt = p[nextP].st - p[nextP].at; // Calculate response time
            }        
            gChart[gIdx++] = p[nextP].id;
            p[nextP].rem_bt--;
            currentTime++;
            if (p[nextP].rem_bt == 0) {
                p[nextP].ct = currentTime;
                p[nextP].completed = 1;
                completed++;
                p[nextP].tat = p[nextP].ct - p[nextP].at;
                p[nextP].wt = p[nextP].tat - p[nextP].bt;

                totalTat += p[nextP].tat;
                totalWt += p[nextP].wt;
            }
        }
    }
    float cpuUtil = (float)(currentTime - totalIdleTime) / currentTime * 100;
    float avgTat = (float)totalTat / n;
    float avgWt = (float)totalWt / n;
    // Displaying the Gantt Chart
    printf("Gantt Chart: \n|");
    for (int i = 0; i < gIdx; i++) {
        printf(" P%d |", gChart[i]);
    }
    printf("\n0");
    for (int i = 0; i < gIdx; i++) {
        printf("\t%d", i + 1);
    }
    printf("\n");
    printf("PID\tAT\tBT\tPriority\tST\tCT\tTAT\tWT\tRT\n");
    for (int i = 0; i < n; i++) {
        printf("%d\t%d\t%d\t%d\t\t%d\t%d\t%.1f\t%.1f\t%d\n", p[i].id, p[i].at, p[i].bt, p[i].priority, p[i].st, p[i].ct, p[i].tat, p[i].wt, p[i].rt);
    }
    printf("\nCPU Utilization: %.2f%%", cpuUtil);
    printf("\nAverage Turnaround Time: %.2f", avgTat);
    printf("\nAverage Waiting Time: %.2f\n", avgWt);

    return 0;
}

