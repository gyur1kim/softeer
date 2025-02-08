class Queue {
  constructor() {
    this.items = {};
    this.headIndex = 0;
    this.tailIndex = 0;
  }

  enqueue(item) {
    this.items[this.tailIndex] = item;
    this.tailIndex++;
  }

  dequeue() {
    const item = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex++;
    return item;
  }

  isEmpty() {
    return this.headIndex - this.tailIndex === 0;
  }
}

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
  const [H, W] = input[0];
  const pixels = input.slice(1, H + 1);
  const inputs = input.slice(H + 2);

  function bfs(i, j, change) {
    const queue = new Queue();
    const color = pixels[i][j];

    if (color === change) return;

    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    const visited = Array(H)
      .fill()
      .map(() => Array(W).fill(false));

    queue.enqueue([i, j]);
    visited[i][j] = true;

    while (!queue.isEmpty()) {
      const [r, c] = queue.dequeue();
      pixels[r][c] = change;

      for (const [dr, dc] of directions) {
        const [nr, nc] = [r + dr, c + dc];
        if (nr < 0 || nr >= H || nc < 0 || nc >= W) continue;
        if (!visited[nr][nc] && pixels[nr][nc] === color) {
          queue.enqueue([nr, nc]);
          visited[nr][nc] = true;
        }
      }
    }
  }

  for (const [i, j, c] of inputs) {
    bfs(i - 1, j - 1, c);
  }

  let result = "";
  for (const pixel of pixels) {
    result += `${pixel.join(" ")}\n`;
  }
  console.log(result);

  process.exit(0);
});
