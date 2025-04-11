#include <stdio.h>
//#include <stdbool.h>
#include <limits.h>
struct process {
    int id, at, bt, priority, st, ct, rt, completed;
    float wt, tat;
};
typedef struct process process;
int find_max(int a, int b) {
    return (a > b) ? a : b;
}
int find_min(int a, int b) {
    return (a < b) ? a : b;
}
int findNextProcess(process p[], int n, int currTime) {
    int maxIdx = -1, maxPriority = -1;
    for (int i = 0; i < n; i++) {
        if (p[i].completed == 0 && p[i].at <= currTime) {
            if (p[i].priority > maxPriority) {
                maxPriority = p[i].priority;
                maxIdx = i;
            } else if (p[i].priority == maxPriority && p[i].at < p[maxIdx].at) {
                maxIdx = i;
            }
        }
    }
    return maxIdx;
}
int main() {
	printf("Name: Pranjal Kundu\n");
    printf("Section: A1\nRoll no.: 46\n");
	printf("\n");
    int n;
    printf("Enter the number of processes: ");
    scanf("%d", &n);
    process p[n];
    for (int i = 0; i < n; i++) {
		printf("\nEnter arrival time, burst time, and priority for process %d: ", i + 1);
        scanf("%d%d%d", &p[i].at, &p[i].bt, &p[i].priority);
        p[i].id = i + 1;
        p[i].completed = 0;
    }
    int gChart[n], gSt[n], gCt[n], gIdx = 0;
    int totalTat = 0, totalWt = 0, totalBt = 0, totalIdleTime = 0;
    int currentTime = 0, complete_count = 0;
    while (complete_count < n) {
        int nextP = findNextProcess(p, n, currentTime);
        if (nextP == -1) {
            currentTime++;
        } else {
            if (p[nextP].at > currentTime) {
                totalIdleTime += p[nextP].at - currentTime;
                currentTime = p[nextP].at;
            }
            gChart[gIdx] = p[nextP].id;
            gSt[gIdx] = currentTime;
            p[nextP].st = currentTime;
            p[nextP].ct = p[nextP].st + p[nextP].bt;
            gCt[gIdx] = p[nextP].ct;
            gIdx++;
            currentTime = p[nextP].ct;
            p[nextP].tat = p[nextP].ct - p[nextP].at;
            p[nextP].wt = p[nextP].tat - p[nextP].bt;
            p[nextP].rt = p[nextP].wt;
            totalWt += p[nextP].wt;
            totalTat += p[nextP].tat;
            totalBt += p[nextP].bt;
            p[nextP].completed = 1;
            complete_count++;
        }
    }
    printf("\nGantt Chart: \n");
    for (int i = 0; i < gIdx; i++) {
        printf("P%d\t|", gChart[i]);
    }
    printf("\n%d", gSt[0]);
    for (int i = 0; i < gIdx; i++) {
        printf("\t%d", gCt[i]);
    }
    printf("\n");
    printf("\nPID\tAT\tBT\tPriority\tCT\tRT\tTAT\tWT\n");
    for (int i = 0; i < n; i++) {
        printf("%d\t%d\t%d\t%d\t\t%d\t%d\t%.2f\t%.2f\n",
               p[i].id, p[i].at, p[i].bt, p[i].priority, p[i].ct, p[i].rt, p[i].tat, p[i].wt);
    }
    float avgWt = (float)totalWt / n;
    float avgTat = (float)totalTat / n;
    float cpu_utilization = (float)(currentTime - totalIdleTime) / currentTime * 100;
    float throughput = (float)n / currentTime;
    printf("\nCPU Utilization: %.2f%%\n", cpu_utilization);
    printf("Throughput: %.2f processes/unit time\n", throughput);
    printf("Average Waiting Time: %.2f\n", avgWt);
    printf("Average Turnaround Time: %.2f\n", avgTat);
    return 0;
}

