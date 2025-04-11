class Process {
    constructor(id, at, bt, priority) {
      this.id = id;
      this.at = at;
      this.bt = bt;
      this.priority = priority;
      this.st = 0;
      this.ct = 0;
      this.rt = 0;
      this.wt = 0;
      this.tat = 0;
      this.completed = false;
    }
  }
  
  function findNextProcess(processes, currentTime) {
    let maxPriority = -1;
    let nextProcess = null;
  
    for (const process of processes) {
      if (!process.completed && process.at <= currentTime) {
        if (
          process.priority > maxPriority ||
          (process.priority === maxPriority &&
            nextProcess &&
            process.at < nextProcess.at)
        ) {
          maxPriority = process.priority;
          nextProcess = process;
        }
      }
    }
  
    return nextProcess;
  }
  
  function priorityScheduling(processes) {
    let currentTime = 0;
    let completedProcesses = 0;
    const n = processes.length;
    const ganttChart = [];
    const startTimes = [];
    const completionTimes = [];
    let totalTat = 0;
    let totalWt = 0;
    let totalBt = 0;
    let totalIdleTime = 0;
  
    while (completedProcesses < n) {
      const nextProcess = findNextProcess(processes, currentTime);
  
      if (!nextProcess) {
        currentTime++;
      } else {
        if (nextProcess.at > currentTime) {
          totalIdleTime += nextProcess.at - currentTime;
          currentTime = nextProcess.at;
        }
  
        ganttChart.push(nextProcess.id);
        startTimes.push(currentTime);
        nextProcess.st = currentTime;
        nextProcess.ct = currentTime + nextProcess.bt;
        completionTimes.push(nextProcess.ct);
        currentTime = nextProcess.ct;
  
        nextProcess.tat = nextProcess.ct - nextProcess.at;
        nextProcess.wt = nextProcess.tat - nextProcess.bt;
        nextProcess.rt = nextProcess.st - nextProcess.at;
  
        totalTat += nextProcess.tat;
        totalWt += nextProcess.wt;
        totalBt += nextProcess.bt;
  
        nextProcess.completed = true;
        completedProcesses++;
      }
    }
  
    // Output Gantt Chart
    console.log("\nGantt Chart:");
    console.log(ganttChart.map((pid) => `P${pid}`).join("\t|"));
    console.log(startTimes[0], ...completionTimes.map((ct) => `\t${ct}`));
  
    // Output process details
    console.log("\nPID\tAT\tBT\tPriority\tCT\tRT\tTAT\tWT");
    for (const process of processes) {
      console.log(
        `${process.id}\t${process.at}\t${process.bt}\t${process.priority}\t\t${process.ct}\t${process.rt}\t${process.tat.toFixed(
          2
        )}\t${process.wt.toFixed(2)}`
      );
    }
  
    const avgWt = totalWt / n;
    const avgTat = totalTat / n;
    const cpuUtilization = ((currentTime - totalIdleTime) / currentTime) * 100;
    const throughput = n / currentTime;
  
    // Output summary
    console.log(`\nCPU Utilization: ${cpuUtilization.toFixed(2)}%`);
    console.log(`Throughput: ${throughput.toFixed(2)} processes/unit time`);
    console.log(`Average Waiting Time: ${avgWt.toFixed(2)}`);
    console.log(`Average Turnaround Time: ${avgTat.toFixed(2)}`);
  }
  
  // Example usage:
  const processes = [
    new Process(1, 0, 5, 2),
    new Process(2, 1, 3, 1),
    new Process(3, 2, 8, 3),
    new Process(4, 3, 6, 2),
  ];
  
  priorityScheduling(processes);
  