#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

struct process {
    int id, at, bt, st, ct, rt, completed, remaining_bt;  
    float wt, tat;
};
typedef struct process process;

// Function to find the next process based on SRTF
int findNextProcess(process p[], int n, int currentTime) {
    int minBt = INT_MAX;  // A large value for comparison
    int minIndex = -1;
    for (int i = 0; i < n; i++) {
        if (p[i].completed == 0 && p[i].at <= currentTime) {
            if (p[i].remaining_bt < minBt) {
                minBt = p[i].remaining_bt;
                minIndex = i;
            } else if (p[i].remaining_bt == minBt) {
                if (p[i].at < p[minIndex].at) {
                    minIndex = i;
                } else if (p[i].at == p[minIndex].at) {
                    if (p[i].id < p[minIndex].id) {
                        minIndex = i;
                    }
                }
            }
        }
    }
    return minIndex;
}

int main() {
    int n;
    printf("Enter the number of processes: ");
    scanf("%d", &n);
    
    process p[n];
    for (int i = 0; i < n; i++) {
        printf("\nEnter arrival time and burst time for process %d: ", i + 1);
        scanf("%d%d", &p[i].at, &p[i].bt);
        p[i].id = i + 1;
        p[i].completed = 0;
        p[i].remaining_bt = p[i].bt; // Initialize remaining burst time
    }

    int gChart[100], gIdx = 0; // Gantt chart array
    int totalTat = 0, totalWt = 0, currentTime = 0, totalIdleTime = 0;
    int complete_count = 0;

    // Simulation loop
    while (complete_count < n) {
        int nextP = findNextProcess(p, n, currentTime);
        
        if (nextP == -1) {
            currentTime++;  // Increment idle time if no process is ready
            totalIdleTime++; // Increment total idle time
        } else {
            // Execute the selected process for 1 time unit
            if (p[nextP].remaining_bt == p[nextP].bt) { // First execution of the process
                p[nextP].st = currentTime; // Start time of the process
            }

            // Store in Gantt chart
            gChart[gIdx++] = p[nextP].id; 
            p[nextP].remaining_bt--; // Decrease remaining burst time
            currentTime++;           // Move current time forward
            
            // If process is completed
            if (p[nextP].remaining_bt == 0) {
                p[nextP].ct = currentTime; // Set completion time
                
                p[nextP].tat = p[nextP].ct - p[nextP].at; // Turnaround time
                p[nextP].wt = p[nextP].tat - p[nextP].bt; // Waiting time
                p[nextP].rt = p[nextP].st - p[nextP].at;  // Response time
                
                totalWt += p[nextP].wt;
                totalTat += p[nextP].tat;
                
                p[nextP].completed = 1;   // Mark as completed
                complete_count++;         // Increment completed count
            }
        }
    }

    // Print the Gantt Chart with times
    printf("\nGantt Chart: \n");
    for (int i = 0; i < gIdx; i++) {
        printf("P%d\t|", gChart[i]);
    }
    printf("\n0\t");

    for (int i = 0; i < gIdx; i++) {
        printf("\t%d", (i == gIdx - 1) ? currentTime : (i + 1));
    }
    printf("\n");

    // Print process details
    printf("\nPID\tAT\tBT\tCT\tRT\tTAT\tWT\n");
    for (int i = 0; i < n; i++) {
        printf("%d\t%d\t%d\t%d\t%d\t%.2f\t%.2f\n", p[i].id, p[i].at, p[i].bt, p[i].ct, p[i].rt, p[i].tat, p[i].wt);
    }

    // Calculate CPU utilization, average waiting time, average turnaround time, and throughput
    float avgWt = (float)totalWt / n;
    float avgTat = (float)totalTat / n;
    float cpu_utilization = (float)(currentTime - totalIdleTime) / currentTime * 100; // Correct CPU utilization
    float throughput = (float)n / currentTime;

    printf("\nCPU Utilization: %.2f%%\n", cpu_utilization);
    printf("Throughput: %.2f processes/unit time\n", throughput);
    printf("Average Waiting Time: %.2f\n", avgWt);
    printf("Average Turnaround Time: %.2f\n", avgTat);

    return 0;
}

