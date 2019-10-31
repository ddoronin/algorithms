import React from 'react';
import './App.css';
import { Graph } from 'graph/lib/types'
import { bfs, dfs } from 'graph/lib/traversal'

const g: Graph = [
  [1, 2, 3],
  [],
  [],
  []
]

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <pre>{JSON.stringify(g, null, '\t')}</pre>
        BFS:
        <pre>{JSON.stringify(bfs(g), null, '\t')}</pre>
        DFS:
        <pre>{JSON.stringify(dfs(g), null, '\t')}</pre>
      </header>
    </div>
  );
}

export default App;
