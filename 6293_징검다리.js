const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const input = [];

rl.on("line", line => {
  input.push(line.split(" ").map(Number));
});

rl.on("close", () => {
  const N = input[0][0];
  const stones = [0, ...input[1]];
  const dp = Array(N + 1).fill(1);

  for (let i = N - 1; i > 0; i--) {
    dp[i] = findMax(i, N, stones, dp) + 1;
  }

  console.log(Math.max(...dp));
  process.exit(0);
});

function findMax(now, N, stones, dp) {
  let max = 0;
  for (let next = now + 1; next < N + 1; next++) {
    if (stones[now] < stones[next]) max = Math.max(max, dp[next]);
  }

  return max;
}
