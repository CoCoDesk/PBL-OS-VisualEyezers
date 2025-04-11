class Process {
  constructor(pid, at, bt) {
    this.pid = pid;
    this.at = at;
    this.bt = bt;
    this.st = 0;
    this.ct = 0;
    this.tat = 0;
    this.wt = 0;
    this.rt = 0;
  }
}

// Sample Input (you can take this via prompt or form)
const n = 3;
const p = [
  new Process(1, 0, 5),
  new Process(2, 2, 3),
  new Process(3, 4, 1)
];

// Sort by arrival time
p.sort((a, b) => a.at - b.at);

let totalBt = 0, totalWt = 0, totalTat = 0;

// Calculations
for (let i = 0; i < n; i++) {
  if (i === 0) {
    p[i].st = p[i].at;
  } else {
    p[i].st = Math.max(p[i].at, p[i - 1].ct);
  }
  p[i].ct = p[i].st + p[i].bt;
  p[i].tat = p[i].ct - p[i].at;
  p[i].wt = p[i].tat - p[i].bt;
  p[i].rt = p[i].wt;

  totalBt += p[i].bt;
  totalWt += p[i].wt;
  totalTat += p[i].tat;
}

const avgWt = totalWt / n;
const avgTat = totalTat / n;
let endTime = Math.max(...p.map(proc => proc.ct));
const cpuUtilization = (totalBt / endTime) * 100;
const throughput = n / endTime;

// Gantt Chart Order
p.sort((a, b) => a.st - b.st);
console.log("\nGantt Chart:");
console.log(p.map(proc => `P${proc.pid}`).join(" -> "));

// Restore original order by PID
p.sort((a, b) => a.pid - b.pid);

// Display Table
console.log("\nPID\tAT\tBT\tST\tCT\tTAT\tWT\tRT");
p.forEach(proc => {
  console.log(`P${proc.pid}\t${proc.at}\t${proc.bt}\t${proc.st}\t${proc.ct}\t${proc.tat.toFixed(2)}\t${proc.wt.toFixed(2)}\t${proc.rt}`);
});

// Averages
console.log(`\nTotal Turn Around Time: ${totalTat.toFixed(2)}\nAverage Turn Around Time: ${avgTat.toFixed(2)}`);
console.log(`Total Waiting Time: ${totalWt.toFixed(2)}\nAverage Waiting Time: ${avgWt.toFixed(2)}`);
console.log(`CPU Utilization: ${cpuUtilization.toFixed(2)}%\nThroughput: ${throughput.toFixed(2)} processes/unit time`);
