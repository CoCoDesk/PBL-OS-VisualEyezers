class Process {
    constructor(id, at, bt) {
      this.id = id;
      this.at = at;
      this.bt = bt;
      this.st = 0;
      this.ct = 0;
      this.rt = 0;
      this.tat = 0;
      this.wt = 0;
      this.completed = false;
    }
  }
  
  function findNextProcess(processes, currentTime) {
    let maxBt = -1;
    let maxIndex = -1;
    for (let i = 0; i < processes.length; i++) {
      const p = processes[i];
      if (!p.completed && p.at <= currentTime) {
        if (p.bt > maxBt) {
          maxBt = p.bt;
          maxIndex = i;
        } else if (p.bt === maxBt) {
          if (p.at < processes[maxIndex].at) {
            maxIndex = i;
          } else if (p.at === processes[maxIndex].at) {
            if (p.id < processes[maxIndex].id) {
              maxIndex = i;
            }
          }
        }
      }
    }
    return maxIndex;
  }
  
  // Sample input (replace with prompt or form inputs as needed)
  const n = 4;
  const input = [
    [0, 4],  // P1: arrival time, burst time
    [1, 3],  // P2
    [2, 1],  // P3
    [3, 2]   // P4
  ];
  
  const processes = input.map((item, i) => new Process(i + 1, item[0], item[1]));
  
  let totalWt = 0, totalTat = 0, totalBt = 0;
  let currentTime = 0, completedProcesses = 0, totalIdleTime = 0;
  let ganttProcess = [], ganttStartTime = [], ganttCompletionTime = [];
  
  while (completedProcesses < n) {
    const nextIndex = findNextProcess(processes, currentTime);
    if (nextIndex === -1) {
      currentTime++;
    } else {
      const p = processes[nextIndex];
      if (p.at > currentTime) {
        totalIdleTime += (p.at - currentTime);
        currentTime = p.at;
      }
      ganttProcess.push(p.id);
      ganttStartTime.push(currentTime);
  
      p.st = currentTime;
      p.ct = p.st + p.bt;
      p.tat = p.ct - p.at;
      p.wt = p.tat - p.bt;
      p.rt = p.wt;
      p.completed = true;
  
      ganttCompletionTime.push(p.ct);
      totalWt += p.wt;
      totalTat += p.tat;
      totalBt += p.bt;
      currentTime = p.ct;
      completedProcesses++;
    }
  }
  
  const avgWt = totalWt / n;
  const avgTat = totalTat / n;
  const cpuUtilization = (totalBt / currentTime) * 100;
  const throughput = n / currentTime;
  
  // Output
  console.log("\nGantt Chart:");
  console.log("| " + ganttProcess.map(p => `P${p}`).join(" | ") + " |");
  console.log(ganttStartTime[0] + "\t" + ganttCompletionTime.join("\t"));
  
  console.log("\nPID\tAT\tBT\tCT\tRT\tTAT\tWT");
  processes.forEach(p => {
    console.log(`${p.id}\t${p.at}\t${p.bt}\t${p.ct}\t${p.rt}\t${p.tat.toFixed(2)}\t${p.wt.toFixed(2)}`);
  });
  
  console.log(`\nTotal Idle Time: ${totalIdleTime} units`);
  console.log(`CPU Utilization: ${cpuUtilization.toFixed(2)}%`);
  console.log(`Throughput: ${throughput.toFixed(2)} processes/unit time`);
  console.log(`Average Waiting Time: ${avgWt.toFixed(2)}`);
  console.log(`Average Turnaround Time: ${avgTat.toFixed(2)}`);
  