class Process {
    constructor(pid, at, bt) {
      this.pid = pid;
      this.at = at;
      this.bt = bt;
      this.ct = 0;
      this.rt = 0;
      this.st = 0;
      this.tat = 0;
      this.wt = 0;
    }
  }
  
  function compareArrival(a, b) {
    return a.at - b.at;
  }
  
  function calculateTimes(queue, currentTimeRef, sbtRef, swtRef, statRef) {
    for (let i = 0; i < queue.length; i++) {
      const p = queue[i];
      if (i === 0) {
        p.st = Math.max(currentTimeRef.time, p.at);
      } else {
        p.st = Math.max(queue[i - 1].ct, p.at);
      }
      p.ct = p.st + p.bt;
      p.tat = p.ct - p.at;
      p.wt = p.tat - p.bt;
      p.rt = p.st - p.at;
  
      sbtRef.total += p.bt;
      swtRef.total += p.wt;
      statRef.total += p.tat;
      currentTimeRef.time = p.ct;
    }
  }
  
  // --------------------------- INPUT SECTION -----------------------------
  
  const prompt = require("prompt-sync")();
  const n = parseInt(prompt("Enter the number of processes: "));
  const processes = [];
  
  for (let i = 0; i < n; i++) {
    console.log(`For Process ${i + 1}:`);
    const at = parseInt(prompt("Enter Arrival Time: "));
    const bt = parseInt(prompt("Enter Burst Time: "));
    processes.push(new Process(i + 1, at, bt));
  }
  
  const sys_count = parseInt(prompt("Enter the number of system processes: "));
  const sys_pids = [];
  
  console.log("Enter the PIDs of system processes:");
  for (let i = 0; i < sys_count; i++) {
    sys_pids.push(parseInt(prompt(`PID ${i + 1}: `)));
  }
  
  // ----------------------- CLASSIFY SYSTEM & USER ------------------------
  
  const system_queue = [];
  const user_queue = [];
  
  for (let p of processes) {
    if (sys_pids.includes(p.pid)) {
      system_queue.push(p);
    } else {
      user_queue.push(p);
    }
  }
  
  system_queue.sort(compareArrival);
  user_queue.sort(compareArrival);
  
  // ----------------------- CALCULATIONS ------------------------
  
  let currentTimeRef = { time: 0 };
  let sbtRef = { total: 0 };
  let swtRef = { total: 0 };
  let statRef = { total: 0 };
  
  calculateTimes(system_queue, currentTimeRef, sbtRef, swtRef, statRef);
  calculateTimes(user_queue, currentTimeRef, sbtRef, swtRef, statRef);
  
  const totalProcesses = processes.length;
  const awt = swtRef.total / totalProcesses;
  const atat = statRef.total / totalProcesses;
  
  // CPU Utilization and Throughput
  let maxCT = Math.max(
    ...system_queue.map(p => p.ct),
    ...user_queue.map(p => p.ct)
  );
  
  const cu = (sbtRef.total / maxCT) * 100;
  const throughput = totalProcesses / maxCT;
  
  // ----------------------- OUTPUT ------------------------
  
  console.log("\nGantt Chart:");
  [...system_queue, ...user_queue].forEach(p => {
    process.stdout.write(`P${p.pid} `);
  });
  
  console.log("\n\nPID\tAT\tBT\tST\tCT\tTAT\t\tWT\t\tRT");
  [...system_queue, ...user_queue].forEach(p => {
    console.log(
      `P${p.pid}\t${p.at}\t${p.bt}\t${p.st}\t${p.ct}\t${p.tat.toFixed(2)}\t${p.wt.toFixed(2)}\t${p.rt}`
    );
  });
  
  console.log(`\nSum of Turnaround Time: ${statRef.total.toFixed(2)}`);
  console.log(`Average Turnaround Time: ${atat.toFixed(2)}`);
  console.log(`Sum of Waiting Time: ${swtRef.total.toFixed(2)}`);
  console.log(`Average Waiting Time: ${awt.toFixed(2)}`);
  console.log(`CPU Utilization: ${cu.toFixed(2)}%`);
  console.log(`Throughput: ${throughput.toFixed(2)} processes/unit time`);
  