import { Graph } from './types';

function dfs(g: Graph, i: number, visited: boolean[]) {
    visited[i] = true;
    for(const v of g[i]) {
        if (!visited[v]) {
            dfs(g, v, visited);
        }
    }
}

/**
 * Returns a list of mother vertices.
 * @param g 
 */
export function motherVertices(g: Graph): number[] {
    let moms: number[] = [];
    let visited: boolean[] = [];
    for (let i = 0; i < g.length; i++) {
        if (!visited[i]) {
            moms.push(i);
            dfs(g, i, visited);
        }
    }

    const noMom = new Set<number>();
    for (let i = moms.length - 1; i >= 0; i--) {
        if (noMom.has(moms[i])) continue;

        visited = [];
        dfs(g, moms[i], visited);
        for (let j = 0; j < i; j++) {
            if (visited[moms[j]]) noMom.add(moms[j]);
        }
    }

    return moms;
}

/**
 *       a
 *      / \
 *     b   c
 *    / \   \
 *   d   e   f
 * @param g 
 * @param vertex 
 * @param visited 
 * @param level 
 * @param nodesCount 
 */

function dfs2(g: Graph, vertex: number, visited: boolean[], level: number, levelNodes: Array<number[]>) {
    visited[vertex] = true;
    for (const v of g[vertex]) {
        if (!visited[v]) {
            dfs2(g, v, visited, level + 1, levelNodes);
            if (!levelNodes[level]) levelNodes[level] = [];
            levelNodes[level].push(v);
        }
    }
}

function size(g: Graph, rootNode: number): Array<number[]> {
    const levelNodes: Array<number[]> = [[rootNode]];
    dfs2(g, rootNode, [], 1, levelNodes);
    return levelNodes;
}

/**
 * Returns an array of vertices grouped by levels.
 * @param g 
 */
export function analyse(g: Graph): Array<number[]> {
    const moms = motherVertices(g);
    let levelNodes: Array<number[]> = [];
    for (const mom of moms) {
        size(g, mom).forEach((nodes, level) => {
            if (!levelNodes[level]) levelNodes[level] = [];
            levelNodes[level] = [...levelNodes[level], ...nodes];
        })
    }
    return levelNodes;
}
