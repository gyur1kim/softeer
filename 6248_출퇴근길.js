// const input = `5 9
// 1 2
// 1 4
// 2 1
// 2 3
// 3 4
// 3 5
// 4 1
// 4 3
// 5 1
// 1 3`.split("\n");

/**
 * 첫번째 시도 - 실패
 * 
 * 노드에서 dfs를 하다가, 걔가 목적지에 도달하지 못하면 다시 뺵(?) 해야하는데
 * 해당 과정이 없음

4 6
1 2
2 3
3 4
4 1
1 4
3 2
1 3
 */
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

Set.prototype.intersection = function (otherSet) {
  return new Set([...this].filter(element => otherSet.has(element)));
};

let input = [];

rl.on("line", line => {
  input.push(line.split(" ").map(Number));
});

rl.on("close", () => {
  const [n, m] = input.shift(); // 정점 개수, 노드 개수
  const [S, T] = input.pop(); // 집, 회사
  // 그래프 생성
  const graph = input.reduce(
    (acc, [x, y]) => acc.set(x, acc.has(x) ? [...acc.get(x), y] : [y]),
    new Map()
  );

  // 출근길
  const goWorkSet = dfs(n, graph, S, T);

  // 퇴근길
  const goHomeSet = dfs(n, graph, T, S);

  console.log(goWorkSet.intersection(goHomeSet).size);
  process.exit(); // 프로세스 종료
});

function dfs(n, graph, start, end) {
  const visited = Array(n + 1).fill(false);
  const visitedSet = new Set();
  const stack = [start];

  while (stack.length) {
    const x = stack.pop();
    visited[x] = true;

    // x와 연결된 친구들
    const connected = graph.get(x);
    for (const next of connected) {
      // 방문해보지 않았고 도착지가 아니면 넣어
      if (!visited[next] && next !== end) {
        stack.push(next);
        visitedSet.add(next);
      }
    }
  }

  return visitedSet;
}
