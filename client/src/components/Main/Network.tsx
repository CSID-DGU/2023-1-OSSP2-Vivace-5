import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "./Network.css";
<<<<<<< HEAD
import ViewKanbanIcon from "@mui/icons-material/ViewKanban"; //for childType=kanban
import DescriptionIcon from "@mui/icons-material/Description"; //for childType=MarkDown
import AccountTreeIcon from "@mui/icons-material/AccountTree"; //for childtype=Network
import ListIcon from "@mui/icons-material/List"; //for childType=List
import ReactDOMServer from "react-dom/server";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
=======
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4

interface NodeData extends d3.SimulationNodeDatum {
    id: string;
    label: string;
<<<<<<< HEAD
    x?: number;
    y?: number;
    childType: string;
    rate: number;
=======
    hasButton: boolean;
    x?: number;
    y?: number;
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
}

interface LinkData {
    source: NodeData;
    target: NodeData;
}

const NetworkGraph = () => {
    const svgRef = useRef<SVGSVGElement>(null);
<<<<<<< HEAD
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const handleNodeButtonClick = (node: NodeData, buttonId: string) => {
        //버튼 클릭 시 노드 id랑 button id 전송 -> 북마크, 마일스톤, 노드 ID
=======
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // 이동된 위치로 상태 정의

    const handleNodeButtonClick = (node: NodeData, buttonId: string) => {
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
        console.log(`Button ${buttonId} clicked for node: ${node.id}`);
        setSelectedNodeId(node.id);
    };

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        const nodes: NodeData[] = [
<<<<<<< HEAD
            { id: "node1", label: "Node 1", childType: "Network", rate: 15 / 15 },
            { id: "node2", label: "Node 2", childType: "Kanban", rate: 5 / 10 },
            { id: "node3", label: "Node 3", childType: "List", rate: 2 / 4 },
=======
            { id: "node1", label: "Node 1", hasButton: true },
            { id: "node2", label: "Node 2", hasButton: true },
            { id: "node3", label: "Node 3", hasButton: true },
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
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
<<<<<<< HEAD
            .style("fill", (d) => `rgba(216, 228, 252, ${d.rate * 0.7 + 0.3})`); // 투명도 조절
=======
            .style("fill", "rgb(216, 228, 252)");
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4

        node.append("text")
            .attr("class", "label")
            .attr("x", 25)
            .attr("y", 15)
            .attr("width", 50)
            .attr("height", 15)
            .attr("text-anchor", "middle")
            .text((d) => d.label);

<<<<<<< HEAD
        node.append("foreignObject")
            .attr("class", "node-button")
            .attr("x", 85)
            .attr("y", 0)
            .attr("width", 15)
            .attr("height", 20)
            .html(() => ReactDOMServer.renderToString(<BookmarkIcon sx={{ fontSize: 5 }} />))
            .on("click", (event: any, d: NodeData) => handleNodeButtonClick(d, "1"));

        node.append("foreignObject")
            .attr("class", "node-button")
            .attr("x", 70)
            .attr("y", 0)
            .attr("width", 15)
            .attr("height", 15)
            .html(() => ReactDOMServer.renderToString(<StarRoundedIcon sx={{ fontSize: 10 }} />))
            .on("click", (event: any, d: NodeData) => handleNodeButtonClick(d, "2"));

        node.append("line").attr("class", "boundary-line").attr("x1", 0).attr("y1", 10).attr("x2", 100).attr("y2", 10);

        node.append("foreignObject")
            .attr("class", "node-rect")
            .attr("x", 82)
            .attr("y", 40)
            .attr("width", 15)
            .attr("height", 15)
            .html((d) => {
                let icon: React.ReactElement | null = null;

                if (d.childType === "Kanban") {
                    icon = <ViewKanbanIcon sx={{ fontSize: 10 }} />;
                } else if (d.childType === "MarkDown") {
                    icon = <DescriptionIcon sx={{ fontSize: 10 }} />;
                } else if (d.childType === "Network") {
                    icon = <AccountTreeIcon sx={{ fontSize: 10 }} />;
                } else if (d.childType === "List") {
                    icon = <ListIcon sx={{ fontSize: 10 }} />;
                }

                return icon ? ReactDOMServer.renderToString(icon) : null;
            });

=======
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

>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
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
<<<<<<< HEAD
            <svg ref={svgRef} width={1280} height={1024}></svg>
=======
            <svg ref={svgRef} width={1680} height={1050}></svg>
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
            <div>Selected Node ID: {selectedNodeId}</div>
        </div>
    );
};

export default NetworkGraph;
