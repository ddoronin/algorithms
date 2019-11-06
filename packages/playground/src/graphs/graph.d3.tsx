import React, { useMemo } from 'react';
import { Graph, analyse } from 'graph';

interface GraphD3Props {
    g: Graph;
    className?: string;
    width?: number;
    height?: number;
}

function GraphD3({ g, width = 640, height = 640 }: GraphD3Props) {
    const { levelNodes, levelCount, links, token } = useMemo(() => {
        // Each level has a list of nodes.
        const levelNodes = analyse(g);

        // Number of nodes on each level.
        const levelCount = levelNodes.map(nodes => nodes.length);

        // Collection of pairs of nodes ("from" and "to").
        const links: Array<[number, number]> = [];
        for (let i = 0; i < g.length; i++) {
            for (const v of g[i]) {
                links.push([i, v]);
            }
        }

        const token = JSON.stringify(g);
        return { token, levelNodes, levelCount, links };
    }, [g]);

    const r = 6;
    const h = height - 2 * r;
    const w = width - 2 * r;

    const dy = levelCount.length <= 1? h: h / (levelCount.length - 1);
    const dx = (n: number) => n <= 1? w: w / (n - 1);

    function getX(list: number[], v: number) { 
        for (let level = 0; level < levelNodes.length; level++) {
            const idx = levelNodes[level].indexOf(v);
            if (idx !== -1) {
                const ddx = dx(levelCount[level]);
                return r + idx * ddx;
            }
        }
        return r;
    }

    function getY(list: number[], v: number) { 
        for (let level = 0; level < levelNodes.length; level++) {
            const idx = levelNodes[level].indexOf(v);
            if (idx !== -1) {
                return r + level * dy;
            }
        }
        return r;
    }

    return (
        <svg width={width} height={height}>
            <defs>
                <marker 
                    id="arrow" 
                    viewBox="0 -5 10 10" 
                    refX={15} 
                    refY={0}
                    markerWidth={6}
                    markerHeight={6}
                    orient="auto">
                    <path d="M0,-5L10,0L0,5" fill="#666"/>
                </marker>
            </defs>
            <g>
                {links.map(([from, to]) => 
                    <line 
                        key={`${from}-${to}-${token}`} 
                        stroke="#666"
                        stroke-width="1.5px"
                        marker-end="url(#arrow)"
                        x1={getX(g[from], from)}
                        y1={getY(g[from], from)}
                        x2={getX(g[to], to)}
                        y2={getY(g[to], to)}
                    />
                )}
            </g>
            <g>
                {g.map((list, v) => 
                    <circle key={`${v}-${token}`} r={6} fill="#69b3a2" cx={getX(list,v)} cy={getY(list, v)}/>
                )}
            </g>
            <g>
                {g.map((list, v) => 
                    <text 
                        key={`${v}-${token}`} 
                        x={getX(list, v) + 10}
                        y={getY(list, v) + 5}
                        fill="rgb(105, 179, 162)"
                    >{v}</text>
                )}
            </g>
        </svg>
    )
}

export default GraphD3;