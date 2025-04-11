function roundRobinScheduling(processes, tq) {
    let n = processes.length;
    let isFirst = true;
    let currentTime = 0;
    let totalWt = 0, totalTat = 0, completed = 0, idleTime = 0;
    const queue = [];
    const gChart = [];

    processes.sort((a, b) => a.at - b.at);
    processes.forEach((p, i) => {
        p.id = i;
        p.rem_bt = p.bt;
        p.completed = false;
    });

    queue.push(0);
    processes[0].completed = true;

    while (completed < n) {
        const idx = queue.shift();
        let p = processes[idx];

        if (p.rem_bt === p.bt) {
            p.st = Math.max(p.at, currentTime);
            if (!isFirst) idleTime += p.st - currentTime;
            currentTime = p.st;
            isFirst = false;
        }

        gChart.push(`P${p.id}`);

        if (p.rem_bt > tq) {
            p.rem_bt -= tq;
            currentTime += tq;
        } else {
            completed++;
            currentTime += p.rem_bt;
            p.ct = currentTime;
            p.tat = p.ct - p.at;
            p.wt = p.tat - p.bt;
            p.rt = p.st - p.at;
            totalTat += p.tat;
            totalWt += p.wt;
            p.rem_bt = 0;
        }

        for (let i = 1; i < n; i++) {
            let pi = processes[i];
            if (!pi.completed && pi.at <= currentTime && pi.rem_bt > 0) {
                queue.push(i);
                pi.completed = true;
            }
        }

        if (p.rem_bt > 0) {
            queue.push(idx);
        }

        if (queue.length === 0) {
            for (let i = 1; i < n; i++) {
                if (processes[i].rem_bt > 0) {
                    queue.push(i);
                    processes[i].completed = true;
                    break;
                }
            }
        }
    }

    // Output Section
    console.log("Name: Pranjal Kundu");
    console.log("Section: A1\nRoll no.: 46\n");

    console.log("\nGantt Chart:");
    console.log(gChart.join("  "));

    console.log("\nPID\tAT\tBT\tCT\tRT\tTAT\tWT");
    processes.forEach(p => {
        console.log(`${p.id}\t${p.at}\t${p.bt}\t${p.ct}\t${p.rt}\t${p.tat.toFixed(2)}\t${p.wt.toFixed(2)}`);
    });

    const totalTime = currentTime - processes[0].at;
    const cpuUtil = ((totalTime - idleTime) / totalTime) * 100;
    const avgTat = totalTat / n;
    const avgWt = totalWt / n;

    console.log(`\nAVG WT: ${avgWt.toFixed(2)}\nAVG TAT: ${avgTat.toFixed(2)}\nCPU UTIL: ${cpuUtil.toFixed(2)}%`);
}

// Example Input
const processes = [
    { at: 0, bt: 5 },
    { at: 1, bt: 3 },
    { at: 2, bt: 8 },
    { at: 3, bt: 6 }
];
const timeQuantum = 4;

roundRobinScheduling(processes, timeQuantum);
