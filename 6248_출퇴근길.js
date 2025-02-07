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
 */
function solution1() {
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
}

/**
 * 두 번째 시도 - 실패
 *
 * 결국 유튜브 강의롤 봄.
 * 그래서 따라했는데도 안됨.
 * 알고보니 graph를 Map 객체로 관리하면서, 다음 노드가 없는 경우(next === undefined)에 대한 처리를 안함
 */
function solution2() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let input = [];

  rl.on("line", line => {
    input.push(line.split(" ").map(Number));
  });

  rl.on("close", () => {
    const [n, m] = input.shift(); // 정점 개수, 노드 개수
    const [S, T] = input.pop(); // 집, 회사

    const graph = Array.from({ length: n + 1 }, () => []);
    const graphR = Array.from({ length: n + 1 }, () => []);

    for (const i of input) {
      const [from, to] = i;
      graph[from].push(to);
      graphR[to].push(from);
    }

    const visitFromS = Array(n + 1).fill(false);
    visitFromS[T] = true;
    dfs(S, graph, visitFromS);

    const visitFromSR = Array(n + 1).fill(false);
    dfs(S, graphR, visitFromSR);

    const visitFromT = Array(n + 1).fill(false);
    visitFromT[S] = true;
    dfs(T, graph, visitFromT);

    const visitFromTR = Array(n + 1).fill(false);
    dfs(T, graphR, visitFromTR);

    let answer = 0;
    for (let i = 1; i <= n; i++) {
      if (visitFromS[i] && visitFromSR[i] && visitFromT[i] && visitFromTR[i]) answer++;
    }
    console.log(answer - 2);

    process.exit(); // 프로세스 종료
  });

  function dfs(now, graph, visit) {
    const stack = [now];

    while (stack.length) {
      const now = stack.pop();

      visit[now] = true;
      // 여기 부분이 undefined가 될 수도 있는데 해당 부분을 처리하지 못함
      const nexts = graph[now];
      for (const next of nexts) {
        if (!visit[next]) stack.push(next);
      }
    }
  }
}

/**
 * 드디어 성공쓰
 *
 * 참고로 2차원 배열을 만들 땐, Array(n).fill([]) 하면 안됨
 * - fill안의 값을 복사하는거라, 배열은 참조값을 복사하게 됨
 * Array(n).fill().map(() => []) 으로 하자
 */
function solution3() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let input = [];

  rl.on("line", line => {
    input.push(line.split(" ").map(Number));
  });

  rl.on("close", () => {
    const [n, m] = input.shift(); // 정점 개수, 노드 개수
    const [S, T] = input.pop(); // 집, 회사

    const graph = Array.from({ length: n + 1 }, () => []);
    const graphR = Array.from({ length: n + 1 }, () => []);

    for (const i of input) {
      const [from, to] = i;
      graph[from].push(to);
      graphR[to].push(from);
    }

    const visitFromS = Array(n + 1).fill(false);
    visitFromS[T] = true;
    dfs(S, graph, visitFromS);

    const visitFromSR = Array(n + 1).fill(false);
    dfs(S, graphR, visitFromSR);

    const visitFromT = Array(n + 1).fill(false);
    visitFromT[S] = true;
    dfs(T, graph, visitFromT);

    const visitFromTR = Array(n + 1).fill(false);
    dfs(T, graphR, visitFromTR);

    let answer = 0;
    for (let i = 1; i <= n; i++) {
      if (visitFromS[i] && visitFromSR[i] && visitFromT[i] && visitFromTR[i]) answer++;
    }
    console.log(answer - 2);

    process.exit(); // 프로세스 종료
  });

  function dfs(now, graph, visit) {
    const stack = [now];

    while (stack.length) {
      const now = stack.pop();

      visit[now] = true;
      const nexts = graph[now];
      for (const next of nexts) {
        if (!visit[next]) stack.push(next);
      }
    }
  }
}
