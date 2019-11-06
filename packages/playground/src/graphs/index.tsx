import React, { useState, useRef } from 'react';
import { Graph, bfs, dfs } from 'graph';
import GraphD3 from './graph.d3';

export default function Graphs() {
  const [g, setG] = useState<{g: Graph, id: number}>({g: [
    [1, 2, 3],
    [],
    [],
    []
  ], id: 0});
  const inputRef = useRef(null);

  const updateG = () => {
    try {
      const newG = JSON.parse((inputRef.current as any).value);
      console.log(newG);
      setG({g: newG as any, id: g.id + 1});
    } catch(e) {
      console.log(e);
      setG({id: g.id + 1, g: []});
    }
  }

  return (
    <div className="App-header">
      <div style={{border: 'dotted black 1px'}}>
        <GraphD3 g={g.g}/>
      </div>
      <textarea ref={inputRef} name="graph" defaultValue={JSON.stringify(g.g)}/>
      <button onClick={updateG}>APPLY</button>
    </div>
  );
}
