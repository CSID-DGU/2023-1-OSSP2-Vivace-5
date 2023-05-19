import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "./Network.css";

interface NodeData extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    hasButton: boolean;
    x?: number;
    y?: number;
}

interface LinkData {
    source: NodeData;
    target: NodeData;
}

const NetworkGraph = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // 이동된 위치로 상태 정의

    const handleNodeButtonClick = (node: NodeData, buttonId: string) => {
        console.log(`Button ${buttonId} clicked for node: ${node.id}`);
        setSelectedNodeId(node.id);
    };

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        const nodes: NodeData[] = [
            { id: "node1", label: "Node 1", hasButton: true },
            { id: "node2", label: "Node 2", hasButton: true },
            { id: "node3", label: "Node 3", hasButton: true },
            // ...
        ];

        const links: LinkData[] = [
            { source: nodes.find((node) => node.id === "node1")!, target: nodes.find((node) => node.id === "node2")! },
            { source: nodes.find((node) => node.id === "node1")!, target: nodes.find((node) => node.id === "node3")! },
            // Add more links here...
        ];

        const simulation = d3
            .forceSimulation<NodeData, LinkData>(nodes)
            .force(
                "link",
                d3
                    .forceLink<NodeData, LinkData>(links)
                    .id((d) => d.id)
                    .distance(200),
            )
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2));

        svg.append("defs")
            .append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "-0 -5 10 10")
            .attr("refX", 8) // 화살표 위치 조정
            .attr("refY", 0)
            .attr("orient", "auto")
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("xoverflow", "visible")
            .append("svg:path")
            .attr("d", "M 0,-5 L 10 ,0 L 0,5") // 화살표 모양 지정
            .attr("fill", "#999");

        const link = svg
            .selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("marker-end", "url(#arrowhead)"); // 화살표로 된 링크 표시

        const node = svg
            .selectAll<SVGGElement, NodeData>(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag<SVGGElement, NodeData>().on("start", dragStart).on("drag", drag).on("end", dragEnd));

        node.append("rect")
            .attr("class", "node-background")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 100)
            .attr("height", 60)
            .style("fill", "rgb(216, 228, 252)");

        node.append("text")
            .attr("class", "label")
            .attr("x", 25)
            .attr("y", 15)
            .attr("width", 50)
            .attr("height", 15)
            .attr("text-anchor", "middle")
            .text((d) => d.label);

        node.append("rect")
            .attr("class", "node-rect")
            .attr("x", 85)
            .attr("y", 6)
            .attr("width", 10)
            .attr("height", 10)
            .on("click", (event: any, d: NodeData) => handleNodeButtonClick(d, "1"));

        node.append("rect")
            .attr("class", "node-button")
            .attr("x", 70)
            .attr("y", 6)
            .attr("width", 10)
            .attr("height", 10)
            .on("click", (event: any, d: NodeData) => handleNodeButtonClick(d, "2"));

        simulation.on("tick", () => {
            link.attr("x1", (d) => d.source.x! + 100)
                .attr("y1", (d) => d.source.y! + 30)
                .attr("x2", (d) => d.target.x!)
                .attr("y2", (d) => d.target.y! + 30);

            node.attr("transform", (d) => `translate(${d.x},${d.y})`);
        });

        function drag(event: d3.D3DragEvent<SVGGElement, NodeData, NodeData | undefined>, d: NodeData) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragStart(event: d3.D3DragEvent<SVGGElement, NodeData, NodeData | undefined>, d: NodeData) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragEnd(event: d3.D3DragEvent<SVGGElement, NodeData, NodeData | undefined>, d: NodeData) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        return () => {
            simulation.stop();
        };
    }, []);

    return (
        <div>
            <svg ref={svgRef} width={1680} height={1050}></svg>
            <div>Selected Node ID: {selectedNodeId}</div>
        </div>
    );
};

export default NetworkGraph;
