import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "./Network.css";

interface NodeData extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    imageSrc?: string;
    hasButton: boolean; // 버튼 필요 여부
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
            { id: "node1", label: "Node 1", imageSrc: "path/to/image1.png", hasButton: true },
            { id: "node2", label: "Node 2", imageSrc: "path/to/image2.png", hasButton: true },
            { id: "node3", label: "Node 3", imageSrc: "path/to/image3.png", hasButton: true },

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
                    .distance(100), // Example distance setting
            )
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.selectAll(".link").data(links).enter().append("line").attr("class", "link");

        const node = svg
            .selectAll<SVGGElement, NodeData>(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag<SVGGElement, NodeData>().on("start", dragStart).on("drag", drag).on("end", dragEnd));

        node.append("text")
            .attr("class", "label")
            .attr("dx", 0)
            .attr("dy", 4)
            .attr("text-anchor", "middle")
            .text((d) => d.label);

        node.append("rect")
            .attr("class", "node-rect")
            .attr("x", -20)
            .attr("y", -20)
            .attr("width", 20)
            .attr("height", 8)
            .on("click", (event: any, d: NodeData) => handleNodeButtonClick(d, "1"));

        node.append("rect")
            .attr("class", "node-button")
            .attr("x", -10)
            .attr("y", 16)
            .attr("width", 20)
            .attr("height", 8)
            .on("click", (event: any, d: NodeData) => handleNodeButtonClick(d, "2"));

        simulation.on("tick", () => {
            link.attr("x1", (d) => d.source.x!)
                .attr("y1", (d) => d.source.y!)
                .attr("x2", (d) => d.target.x!)
                .attr("y2", (d) => d.target.y!);

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
            <svg ref={svgRef} width={800} height={600}></svg>
            <div>Selected Node ID: {selectedNodeId}</div>
        </div>
    );
};

export default NetworkGraph;
