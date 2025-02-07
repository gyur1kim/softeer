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
  const [N, K] = input.shift(); // 점 N개, 색 K개
  const dots = Array(K + 1)
    .fill()
    .map(() => []);
  for (const [x, y, k] of input) {
    dots[k].push([x, y]);
  }

  let answer = 2_000 * 2_000 + 1;
  for (const [x, y] of dots[1]) {
    dfs(2, x, x, y, y);
  }

  function getArea(minX, maxX, minY, maxY) {
    return (maxX - minX) * (maxY - minY);
  }

  function dfs(color, minX, maxX, minY, maxY) {
    // 모든 색을 탐색했어여
    if (color > K) {
      answer = Math.min(answer, getArea(minX, maxX, minY, maxY));
      return;
    }

    for (const [x, y] of dots[color]) {
      const tmpMinX = Math.min(minX, x);
      const tmpMaxX = Math.max(maxX, x);
      const tmpMinY = Math.min(minY, y);
      const tmpMaxY = Math.max(maxY, y);
      const tmpArea = getArea(tmpMinX, tmpMaxX, tmpMinY, tmpMaxY);

      if (tmpArea < answer) {
        dfs(color + 1, tmpMinX, tmpMaxX, tmpMinY, tmpMaxY);
      }
    }
  }

  console.log(answer);

  process.exit(0);
});
