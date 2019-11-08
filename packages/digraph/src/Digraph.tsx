import React, { useMemo } from 'react';
import { Graph, analyse } from 'graph';

interface DigraphProps {
    g: Graph;
    className?: string;
    minWidth?: number;
    minHeight?: number;
    radius?: number;
    dxMin?: number;
    dyMin?: number;
    renderDefs?: () => React.ReactNode;
    renderCircle?: (v: number, x: number, y: number) => React.ReactNode;
    renderLinks?: (from: number, to: number, x1: number, x2: number, y1: number, y2: number) => React.ReactNode;
    renderText?: (v: number, x: number, y: number) => React.ReactNode;
    children?: React.ReactNode;
}

const renderDefsDefault = (): React.ReactNode => {
    return (
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
    );
}

const renderLinksDefault = (from: number, to: number, x1: number, y1: number, x2: number, y2: number): React.ReactNode => {
    return (
        <line 
            key={`${from}-${to}`} 
            stroke="#666"
            strokeWidth="1.5px"
            markerEnd="url(#arrow)"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
        />
    )
}

const renderCircleDefault = (v: number, x: number, y: number): React.ReactNode => {
    return (
        <circle 
            key={v} 
            r={6} 
            fill="#69b3a2" 
            cx={x} 
            cy={y}
        />
    );
}

const renderTextDefault = (v: number, x: number, y: number): React.ReactNode => {
    return (
        <text 
            key={v}
            x={x + 10}
            y={y + 5}
            fill="rgb(105, 179, 162)"
        >{v}</text>
    )
}

export function Digraph({ g, 
    renderDefs = renderDefsDefault,
    renderLinks = renderLinksDefault,
    renderCircle = renderCircleDefault,
    renderText = renderTextDefault,
    children = null,
    className = 'digraph', 
    dxMin = 120, 
    dyMin = 120, 
    radius = 6, 
    minWidth = 300, 
    minHeight = 300 
}: DigraphProps) {
    const { levelCount, nodeCountLevelMax, links, vertexXY } = useMemo(() => {
        // Each level has a list of nodes.
        const levelNodes = analyse(g);
        const vertexXY: Array<[number, number]> = [];
        for (let y = 0; y < levelNodes.length; y++) {
            for(let x = 0; x < levelNodes[y].length; x++) {
                vertexXY[levelNodes[y][x]] = [x, y];
            }
        }

        // Number of nodes on each level.
        const levelCount = levelNodes.map(nodes => nodes.length);

        const nodeCountLevelMax = Math.max(...levelCount);

        // Collection of pairs of nodes ("from" and "to").
        const links: Array<[number, number]> = [];
        for (let i = 0; i < g.length; i++) {
            for (const v of g[i]) {
                links.push([i, v]);
            }
        }

        return { levelCount, nodeCountLevelMax, links, vertexXY };
    }, [g]);

    const effectiveWidth = nodeCountLevelMax * dxMin;
    const width = minWidth < effectiveWidth? effectiveWidth: minWidth;

    const effectiveHeight = nodeCountLevelMax * dyMin;
    const height = minHeight < effectiveHeight? effectiveHeight: minHeight;

    const h = height - 2 * radius;
    const w = width - 2 * radius;

    const dy = levelCount.length <= 1? h: h / (levelCount.length - 1);
    const dx = (n: number) => n <= 1? w: w / (n - 1);

    function getX(list: number[], v: number) { 
        const [x, y] = vertexXY[v];
        if (levelCount[y] === 1) return radius + w / 2;
        return radius + x * dx(levelCount[y]);
    }

    function getY(list: number[], v: number) { 
        const [, y] = vertexXY[v];
        return radius + y * dy;
    }

    return (
        <svg className={className} width={width} height={height}>
            <defs>
                {renderDefs()}
            </defs>
            <g>
                {links.map(([from, to]) => renderLinks(from, to, getX(g[from], from), getY(g[from], from), getX(g[to], to), getY(g[to], to)))}
            </g>
            <g>
                {g.map((list, v) => renderCircle(v, getX(list, v), getY(list, v)))}
            </g>
            <g>
                {g.map((list, v) => renderText(v, getX(list, v), getY(list, v)))}
            </g>
            {children}
        </svg>
    )
}
