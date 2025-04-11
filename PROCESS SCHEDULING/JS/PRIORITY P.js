function preemptivePriorityScheduling(processes) {
    const n = processes.length;
    let currentTime = 0;
    let completed = 0;
    let totalTat = 0, totalWt = 0, totalIdleTime = 0;
    const gChart = [];

    processes.forEach((p, idx) => {
        p.id = idx;
        p.completed = false;
        p.rem_bt = p.bt;
    });

    function findNextProcess(currTime) {
        let minIdx = -1;
        let highestPriority = Infinity;
        for (let i = 0; i < n; i++) {
            if (!processes[i].completed && processes[i].at <= currTime) {
                if (processes[i].priority < highestPriority) {
                    highestPriority = processes[i].priority;
                    minIdx = i;
                } else if (processes[i].priority === highestPriority) {
                    if (
                        processes[i].at < processes[minIdx].at ||
                        (processes[i].at === processes[minIdx].at && processes[i].id < processes[minIdx].id)
                    ) {
                        minIdx = i;
                    }
                }
            }
        }
        return minIdx;
    }

    while (completed < n) {
        const nextP = findNextProcess(currentTime);
        if (nextP === -1) {
            currentTime++;
            totalIdleTime++;
        } else {
            const p = processes[nextP];
            if (p.rem_bt === p.bt) {
                p.st = currentTime;
                p.rt = p.st - p.at;
            }
            gChart.push(p.id);
            p.rem_bt--;
            currentTime++;
            if (p.rem_bt === 0) {
                p.ct = currentTime;
                p.completed = true;
                p.tat = p.ct - p.at;
                p.wt = p.tat - p.bt;

                totalTat += p.tat;
                totalWt += p.wt;
                completed++;
            }
        }
    }

    const avgTat = totalTat / n;
    const avgWt = totalWt / n;
    const cpuUtil = ((currentTime - totalIdleTime) / currentTime) * 100;

    console.log("Name: Pranjal Kundu");
    console.log("Section: A1\nRoll no.: 46\n");

    console.log("\nGantt Chart:");
    let timeStr = "0";
    let gStr = "|";
    for (let i = 0; i < gChart.length; i++) {
        gStr += ` P${gChart[i]} |`;
        timeStr += `\t${i + 1}`;
    }
    console.log(gStr);
    console.log(timeStr);

    console.log("\nPID\tAT\tBT\tPriority\tST\tCT\tTAT\tWT\tRT");
    processes.forEach(p => {
        console.log(
            `${p.id}\t${p.at}\t${p.bt}\t${p.priority}\t\t${p.st}\t${p.ct}\t${p.tat.toFixed(1)}\t${p.wt.toFixed(1)}\t${p.rt}`
        );
    });

    console.log(`\nCPU Utilization: ${cpuUtil.toFixed(2)}%`);
    console.log(`Average Turnaround Time: ${avgTat.toFixed(2)}`);
    console.log(`Average Waiting Time: ${avgWt.toFixed(2)}\n`);
}

// Example input (replace with your own test cases)
const processes = [
    { at: 0, bt: 5, priority: 2 },
    { at: 1, bt: 3, priority: 1 },
    { at: 2, bt: 1, priority: 3 }
];

preemptivePriorityScheduling(processes);
