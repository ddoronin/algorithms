import { Graph } from './types';

function xfs(v: number, g: Graph, visited: boolean[], processEdgeNode: (edgeNode: number) => void) {
    visited[v] = true;
    for(const node of g[v]) {
        if (!visited[node]) {
            xfs(node, g, visited, processEdgeNode);
        }
    }
    processEdgeNode(v);
}

function traverse(g: Graph, processEdgeNode: (edgeNode: number) => void) {
    const visited: boolean[] = new Array(g.length).fill(false);
    for(let i = 0; i < g.length; i++) {
        if (!visited[i]) {
            xfs(i, g, visited, processEdgeNode)
        }
    }
}

export function bfs(g: Graph): number[] {
    const vertices: number[] = [];
    traverse(g, v => vertices.unshift(v));
    return vertices;
}

export function dfs(g: Graph): number[] {
    const vertices: number[] = [];
    traverse(g, v => vertices.push(v));
    return vertices;
}
