import React from 'react';
import { Graph, bfs, dfs } from 'graph';

export default function Graphs() {
  const g: Graph = [
    [1, 2, 3],
    [],
    [],
    []
  ]

  return (
    <div className="App-header">
      Adjacency List:
      <pre>{JSON.stringify(g, null, '\t')}</pre>
      BFS:
      <pre>{JSON.stringify(bfs(g), null, '\t')}</pre>
      DFS:
      <pre>{JSON.stringify(dfs(g), null, '\t')}</pre>
    </div>
  );
}
