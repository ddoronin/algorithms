import React, { useRef, useMemo, useEffect } from 'react';
import * as d3 from 'd3';
import { Graph, analyse } from 'graph';

interface GraphD3Props {
    g: Graph
}

let gid: number = 0;

function GraphD3({ g }: GraphD3Props) {
    const elid = 'canvas' + useMemo(() => gid++, []);
    const levelNodes = useMemo(() => analyse(g), [g]);
    const levelCount = useMemo(() => levelNodes.map(nodes => nodes.length), levelNodes)
    const links = useMemo(() => {
        const pairs: Array<[number, number]> = [];
        for (let i = 0; i < g.length; i++) {
            for (const v of g[i]) {
                pairs.push([i, v]);
            }
        }
        return pairs;
    }, [g]);
    function init() {
        const width = 640;
        const height = 480;
        const dy = height / levelCount.length;

        const svg = d3
            .select('#' + elid)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

            // Per-type markers, as they don't inherit styles.
            const marker = svg.append("defs")
                .selectAll("marker")
                .data(["suit", "licensing", "resolved"])
                .enter()
                .append("marker")
                .attr("id", 'arrow')
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .style("fill", "#666");

        var path = svg.append("g")
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .style("stroke", "#666")
            .style("stroke-width", "1.5px")
            .attr("x1", link => {
                const [from, to] = link;
                return getX(g[from], from);
            })
            .attr("y1", link => {
                const [from, to] = link;
                return getY(g[from], from);
            })
            .attr("x2", link => {
                const [from, to] = link;
                return getX(g[to], to);
            })
            .attr("y2", link => {
                const [from, to] = link;
                return getY(g[to], to);
            })
            .attr("marker-end", "url(#arrow)");

        var text = svg.append("g").selectAll("text")
            .data(g)
            .enter()
            .append("text")
            .attr("x", (list, v) => getX(list, v) + 10)
            .attr("y", (list, v) => getY(list, v) + 5)
            .style("fill", 'rgb(105, 179, 162)')
            .text(function(list, v) { return v; });

        function getX(list: number[], v: number) { 
            for (let level = 0; level < levelNodes.length; level++) {
                const idx = levelNodes[level].indexOf(v);
                if (idx !== -1) {
                    const w = (width - 2 * 6);
                    return 6 + w / (levelCount[level] + 1) + idx * w / (levelCount[level]);
                }
            }
            return 0;
        }

        function getY(list: number[], v: number) { 
            for (let level = 0; level < levelNodes.length; level++) {
                const idx = levelNodes[level].indexOf(v);
                if (idx !== -1) {
                    return 6 + level * dy;
                }
            }
            return 0; 
        }

        var circle = svg
            .append("g")
            .selectAll("circle")
            .data(g)
            .enter()
            .append("circle")
            .attr("r", 6)
            .style("fill", "#69b3a2")
            .attr("cx", getX)
            .attr("cy", getY);
    
    }
    useEffect(init, [g]);
    return <div id={elid} >Render</div>
}

export default GraphD3;