#include<stdio.h>
#include<stdlib.h>

struct process {
    int id, at, bt, st, ct, rt, completed;
    float tat, wt;
};
typedef struct process process;

//ONLY THIS IS DIFF ELSE EVERYTHING IS SAME AS SJFS
int findNextProcess(process p[], int n, int currentTime) {
    int maxBt = -1;  // A small value for comparison
    int maxIndex = -1;
    for (int i = 0; i < n; i++) {
        if (p[i].completed == 0 && p[i].at <= currentTime) {
            if (p[i].bt > maxBt) {
                maxBt = p[i].bt;
                maxIndex = i;
            } else if (p[i].bt == maxBt) {
                if (p[i].at < p[maxIndex].at) {
                    maxIndex = i;
                } else if (p[i].at == p[maxIndex].at) {
                    if (p[i].id < p[maxIndex].id) {
                        maxIndex = i;
                    }
                }
            }
        }
    }
    return maxIndex;
}

int main() {
    int n;
    printf("Enter the number of processes: ");
    scanf("%d", &n);
    process p[n];

    // Input arrival time and burst time for each process
    for (int i = 0; i < n; i++) {
        printf("\nEnter arrival time and burst time for process %d: ", i + 1);
        scanf("%d%d", &p[i].at, &p[i].bt);
        p[i].id = i + 1;  // Set process ID
        p[i].completed = 0; // Initialize completed to 0 (not completed)
    }

    int totalWt = 0, totalTat = 0, totalBt = 0;
    int currentTime = 0, completedProcesses = 0;
    int totalIdleTime = 0; // Variable to track idle time

    // Arrays to store Gantt chart details
    int ganttProcess[n], ganttStartTime[n], ganttCompletionTime[n];
    int ganttIndex = 0;

    // LJFS Scheduling
    while (completedProcesses < n) {
        int nextProcessIndex = findNextProcess(p, n, currentTime);
        if (nextProcessIndex == -1) {
            // No process has arrived yet, increment time
            currentTime++;
        } else {
            // Schedule the next process
            if (p[nextProcessIndex].at > currentTime) {
                // CPU is idle, calculate idle time
                totalIdleTime += (p[nextProcessIndex].at - currentTime);
                currentTime = p[nextProcessIndex].at;
            }
            // Store Gantt chart details
            ganttProcess[ganttIndex] = p[nextProcessIndex].id;
            ganttStartTime[ganttIndex] = currentTime;
            p[nextProcessIndex].st = currentTime;
            p[nextProcessIndex].ct = p[nextProcessIndex].st + p[nextProcessIndex].bt;
            ganttCompletionTime[ganttIndex] = p[nextProcessIndex].ct;
            ganttIndex++;
            // Calculate times
            p[nextProcessIndex].tat = p[nextProcessIndex].ct - p[nextProcessIndex].at;  // Turnaround time
            p[nextProcessIndex].wt = p[nextProcessIndex].tat - p[nextProcessIndex].bt;  // Waiting time
            p[nextProcessIndex].rt = p[nextProcessIndex].wt;  // Response time (same as waiting time in non-preemptive)
            p[nextProcessIndex].completed = 1;  // Mark the process as completed
            totalWt += p[nextProcessIndex].wt;
            totalTat += p[nextProcessIndex].tat;
            totalBt += p[nextProcessIndex].bt;
            currentTime = p[nextProcessIndex].ct;
            completedProcesses++;
        }
    }

    // Calculate average waiting time, average turnaround time, CPU utilization, and throughput
    float avgWt = (float)totalWt / n;
    float avgTat = (float)totalTat / n;
    float cpu_utilization = (float)totalBt / currentTime * 100;
    float throughput = (float)n / currentTime;

    // Print Gantt chart
    printf("\nGantt Chart:\n|");
    for (int i = 0; i < ganttIndex; i++) {
        printf(" P%d |", ganttProcess[i]);
    }
    printf("\n");
    
    // Print the time below the Gantt chart
    printf("%d", ganttStartTime[0]);
    for (int i = 0; i < ganttIndex; i++) {
        printf("\t%d", ganttCompletionTime[i]);
    }

    // Print process details after sorting by process ID
    printf("\n\nPID\tAT\tBT\tCT\tRT\tTAT\tWT\n");
    for (int i = 0; i < n; i++) {
        printf("%d\t%d\t%d\t%d\t%d\t%.2f\t%.2f\n",
               p[i].id, p[i].at, p[i].bt, p[i].ct, p[i].rt, p[i].tat, p[i].wt);
    }

    // Print summary
    printf("\nTotal Idle Time: %d units\n", totalIdleTime);
    printf("CPU Utilization: %.2f%%\n", cpu_utilization);
    printf("Throughput: %.2f processes/unit time\n", throughput);
    printf("Average Waiting Time: %.2f\n", avgWt);
    printf("Average Turnaround Time: %.2f\n", avgTat);
    return 0;
}

