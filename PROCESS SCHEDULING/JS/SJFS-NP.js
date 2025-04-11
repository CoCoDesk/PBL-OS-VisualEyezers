function findNextProcess(processes, currTime) {
    let minIdx = -1;
    let minBt = Infinity;

    for (let i = 0; i < processes.length; i++) {
        const p = processes[i];
        if (!p.completed && p.at <= currTime) {
            if (p.bt < minBt || (p.bt === minBt && p.at < processes[minIdx]?.at)) {
                minBt = p.bt;
                minIdx = i;
            }
        }
    }
    return minIdx;
}

function sjfScheduling(processes) {
    let n = processes.length;
    let currentTime = 0, totalTat = 0, totalWt = 0, totalIdleTime = 0;
    let gChart = [], gSt = [], gCt = [];

    processes.forEach((p, i) => {
        p.id = i + 1;
        p.completed = false;
    });

    let completedCount = 0;

    while (completedCount < n) {
        const nextIdx = findNextProcess(processes, currentTime);

        if (nextIdx === -1) {
            currentTime++;
        } else {
            let p = processes[nextIdx];
            if (p.at > currentTime) {
                totalIdleTime += p.at - currentTime;
                currentTime = p.at;
            }

            p.st = currentTime;
            p.ct = p.st + p.bt;
            currentTime = p.ct;
            p.tat = p.ct - p.at;
            p.wt = p.tat - p.bt;
            p.rt = p.st - p.at;
            p.completed = true;

            gChart.push(`P${p.id}`);
            gSt.push(p.st);
            gCt.push(p.ct);

            totalTat += p.tat;
            totalWt += p.wt;
            completedCount++;
        }
    }

    // Output
    console.log("Name: Pranjal Kundu");
    console.log("Section: A1\nRoll no.: 46\n");

    console.log("\nGantt Chart:");
    console.log(gChart.join("\t|"));
    console.log(gSt[0], "\t", gCt.join("\t"));

    console.log("\nPID\tAT\tBT\tCT\tRT\tTAT\tWT");
    processes.forEach(p => {
        console.log(`${p.id}\t${p.at}\t${p.bt}\t${p.ct}\t${p.rt}\t${p.tat.toFixed(2)}\t${p.wt.toFixed(2)}`);
    });

    const avgWt = totalWt / n;
    const avgTat = totalTat / n;
    const cpuUtil = ((currentTime - totalIdleTime) / currentTime) * 100;
    const throughput = n / currentTime;

    console.log(`\nCPU Utilization: ${cpuUtil.toFixed(2)}%`);
    console.log(`Throughput: ${throughput.toFixed(2)} processes/unit time`);
    console.log(`Average Waiting Time: ${avgWt.toFixed(2)}`);
    console.log(`Average Turnaround Time: ${avgTat.toFixed(2)}`);
}

// Example usage:
const processes = [
    { at: 0, bt: 5 },
    { at: 2, bt: 3 },
    { at: 4, bt: 1 },
    { at: 6, bt: 2 }
];

sjfScheduling(processes);
