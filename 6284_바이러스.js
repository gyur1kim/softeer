const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let K, P, N;
const DIVIDE = 10_0000_0007n;

rl.on("line", line => {
  [K, P, N] = line.split(" ").map(BigInt);
});

rl.on("close", () => {
  for (let i = 0; i < N; i++) {
    K = (K * P) % DIVIDE;
  }
  console.log(Number(K));

  process.exit(0);
});
