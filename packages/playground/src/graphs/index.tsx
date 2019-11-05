import React from 'react';
import { Graph, bfs, dfs } from 'graph';
import GraphD3 from './graph.d3';

export default function Graphs() {
  const g: Graph = [
    [1],         // 0
    [2, 3, 4],     // 1
    [5],        // 2
    [6],         // 3
    [],         // 4
    [],          // 5
    [],
    [6]
  ];

  return (
    <div className="App-header">
      Adjacency List:
      <pre>{JSON.stringify(g, null, '\t')}</pre>
      BFS:
      <pre>{JSON.stringify(bfs(g), null, '\t')}</pre>
      DFS:
      <pre>{JSON.stringify(dfs(g), null, '\t')}</pre>
      <GraphD3 g={g}/>
    </div>
  );
}
