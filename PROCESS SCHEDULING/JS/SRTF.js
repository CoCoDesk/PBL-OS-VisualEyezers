class Process {
    constructor(id, at, bt) {
        this.id = id;
        this.at = at;
        this.bt = bt;
        this.st = -1;
        this.ct = 0;
        this.rt = 0;
        this.wt = 0;
        this.tat = 0;
        this.completed = false;
        this.remaining_bt = bt;
    }
}

function findNextProcess(p, currentTime) {
    let minBt = Infinity;
    let minIndex = -1;
    for (let i = 0; i < p.length; i++) {
        if (!p[i].completed && p[i].at <= currentTime) {
            if (p[i].remaining_bt < minBt) {
                minBt = p[i].remaining_bt;
                minIndex = i;
            } else if (p[i].remaining_bt === minBt) {
                if (p[i].at < p[minIndex]?.at) {
                    minIndex = i;
                } else if (p[i].at === p[minIndex]?.at) {
                    if (p[i].id < p[minIndex]?.id) {
                        minIndex = i;
                    }
                }
            }
        }
    }
    return minIndex;
}

function srtfScheduling(inputProcesses) {
    let processes = inputProcesses.map((p, i) => new Process(i + 1, p.at, p.bt));
    let currentTime = 0, totalTat = 0, totalWt = 0, totalIdleTime = 0, completeCount = 0;
    let gChart = [];

    while (completeCount < processes.length) {
        let idx = findNextProcess(processes, currentTime);

        if (idx === -1) {
            currentTime++;
            totalIdleTime++;
        } else {
            let proc = processes[idx];

            if (proc.remaining_bt === proc.bt) {
                proc.st = currentTime;
            }

            gChart.push(proc.id);
            proc.remaining_bt--;
            currentTime++;

            if (proc.remaining_bt === 0) {
                proc.ct = currentTime;
                proc.tat = proc.ct - proc.at;
                proc.wt = proc.tat - proc.bt;
                proc.rt = proc.st - proc.at;

                totalWt += proc.wt;
                totalTat += proc.tat;
                proc.completed = true;
                completeCount++;
            }
        }
    }

    // Output
    console.log("Name: Pranjal Kundu");
    console.log("Section: A1\nRoll no.: 46\n");

    // Gantt Chart
    console.log("\nGantt Chart:");
    let gStr = "", timeStr = "0\t";
    for (let i = 0; i < gChart.length; i++) {
        gStr += `P${gChart[i]}\t|`;
        timeStr += `${i + 1}\t`;
    }
    console.log(gStr);
    console.log(timeStr);

    // Process Table
    console.log("\nPID\tAT\tBT\tCT\tRT\tTAT\tWT");
    for (let p of processes) {
        console.log(`${p.id}\t${p.at}\t${p.bt}\t${p.ct}\t${p.rt}\t${p.tat.toFixed(2)}\t${p.wt.toFixed(2)}`);
    }

    let avgWt = totalWt / processes.length;
    let avgTat = totalTat / processes.length;
    let cpuUtil = ((currentTime - totalIdleTime) / currentTime) * 100;
    let throughput = processes.length / currentTime;

    console.log(`\nCPU Utilization: ${cpuUtil.toFixed(2)}%`);
    console.log(`Throughput: ${throughput.toFixed(2)} processes/unit time`);
    console.log(`Average Waiting Time: ${avgWt.toFixed(2)}`);
    console.log(`Average Turnaround Time: ${avgTat.toFixed(2)}`);
}

// Example usage:
const processes = [
    { at: 0, bt: 5 },
    { at: 1, bt: 3 },
    { at: 2, bt: 1 },
    { at: 4, bt: 2 }
];

srtfScheduling(processes);

