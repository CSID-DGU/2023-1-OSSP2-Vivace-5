import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import styles from "./Network.module.css";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ListIcon from "@mui/icons-material/List";
import ReactDOMServer from "react-dom/server";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { Project, Task } from "../Data";
import { API_HOST } from "../../../config/constants";
import axios, { AxiosResponse } from "axios";

interface NodeData extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    x?: number;
    y?: number;
    childType: string;
    // rate?: number 진행도에 따라 back-ground 투명도 바꾸려고 넣어놨던 rate
}

interface LinkData {
    source: NodeData;
    target: NodeData;
}

interface NetworkProps {
    currentTask: Task;
}

const Network: React.FC<NetworkProps> = ({ currentTask }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteSubTasks, setDeleteSubTasks] = useState(false);

    const handleNodeButtonClick = (node: NodeData, buttonId: string) => {
        console.log(`Button ${buttonId} clicked for node: ${node.id}`);
        setSelectedNodeId(node.id);
    };

    const handleContextMenu = (event: React.MouseEvent<SVGGElement, MouseEvent>, node: NodeData) => {
        event.preventDefault();
        const contextMenu = document.getElementById("context-menu");
        if (contextMenu) {
            contextMenu.style.left = `${event.clientX}px`;
            contextMenu.style.top = `${event.clientY}px`;
            contextMenu.style.display = "block";
            setSelectedNodeId(node.id);
            setShowDeleteConfirmation(false);
            document.addEventListener("click", handleDocumentClick); //메뉴바 외의 영역 클릭시 메뉴바 닫기
        }
    };

    const handleDocumentClick = (event: MouseEvent) => {
        const contextMenu = document.getElementById("context-menu");
        if (contextMenu && !contextMenu.contains(event.target as Node)) {
            contextMenu.style.display = "none";
            setSelectedNodeId(null);
            document.removeEventListener("click", handleDocumentClick);
        }
    };

    const handleDeleteNode = () => {
        if (selectedNodeId) {
            setShowDeleteConfirmation(true);
        }
    };

    const handleDeleteConfirmation = async () => {
        if (selectedNodeId) {
            const payload = {
                taskId: selectedNodeId,
                cascading: deleteSubTasks,
            };
            try {
                let res: AxiosResponse = await axios.delete(`${API_HOST}/task/delete`, {
                    //res 다른 곳에서도 쓰이니까 let으로
                    headers: {
                        Authorization: localStorage.getItem("access-token"),
                    },
                    data: payload,
                });
                if (res.status === 200) {
                    console.log("Node and subtasks deleted successfully");
                } else {
                    console.error("Error deleting node and subtasks:", res.status);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Error deleting node and subtasks:", error.message);
                } else {
                    console.error("Error deleting node and subtasks:", error);
                }
            }
        }
        setShowDeleteConfirmation(false);
    };

    const handleDeleteSubTasksToggle = () => {
        setDeleteSubTasks(!deleteSubTasks);
    };

    const handleModifyNodeInfo = async () => {
        if (selectedNodeId) {
            console.log("Showing modal for node modification");

            const selectedNode = nodes.find((node) => node.id === selectedNodeId);

            if (selectedNode) {
                const newTitle = prompt("Enter the new title:", selectedNode.label);
                const newDescription = prompt("Enter the new description:", "");
                const newStart = prompt("Enter the new start date:", "");
                const newDeadline = prompt("Enter the new deadline:", "");

                if (newTitle || newDescription || newStart || newDeadline) {
                    const updatedFields: any = {};

                    if (newTitle) {
                        updatedFields.newTitle = newTitle;

                        try {
                            const res = await axios.patch(
                                `${API_HOST}/task/update/title/${selectedNodeId}`,
                                { newTitle: updatedFields.newTitle },
                                {
                                    headers: {
                                        Authorization: localStorage.getItem("access-token"),
                                    },
                                },
                            );

                            console.log("Node title updated successfully");
                        } catch (error) {
                            if (axios.isAxiosError(error)) {
                                console.error("Error updating node title:", error.message);
                            } else {
                                console.error("Error updating node title:", error);
                            }
                        }
                    }
                    if (newDescription) {
                        updatedFields.newDescription = newDescription;

                        try {
                            const res = await axios.patch(
                                `${API_HOST}/task/update/description/${selectedNodeId}`,
                                { newDescription: updatedFields.newDescription },
                                {
                                    headers: {
                                        Authorization: localStorage.getItem("access-token"),
                                    },
                                },
                            );

                            console.log("Node description updated successfully");
                        } catch (error) {
                            if (axios.isAxiosError(error)) {
                                console.error("Error updating node description:", error.message);
                            } else {
                                console.error("Error updating node description:", error);
                            }
                        }
                    }
                    if (newStart) {
                        updatedFields.newStart = newStart;

                        try {
                            const res = await axios.patch(
                                `${API_HOST}/task/update/start/${selectedNodeId}`,
                                { newStart: updatedFields.newStart },
                                {
                                    headers: {
                                        Authorization: localStorage.getItem("access-token"),
                                    },
                                },
                            );

                            console.log("Node start date updated successfully");
                        } catch (error) {
                            if (axios.isAxiosError(error)) {
                                console.error("Error updating node start date:", error.message);
                            } else {
                                console.error("Error updating node start date:", error);
                            }
                        }
                    }
                    if (newDeadline) {
                        updatedFields.newDeadline = newDeadline;

                        try {
                            const res = await axios.patch(
                                `${API_HOST}/task/update/deadline/${selectedNodeId}`,
                                { newDeadline: updatedFields.newDeadline },
                                {
                                    headers: {
                                        Authorization: localStorage.getItem("access-token"),
                                    },
                                },
                            );

                            console.log("Node deadline updated successfully");
                        } catch (error) {
                            if (axios.isAxiosError(error)) {
                                console.error("Error updating node deadline:", error.message);
                            } else {
                                console.error("Error updating node deadline:", error);
                            }
                        }
                    }
                }
            }
        }
    };

    const handleAddLink = async () => {
        if (selectedNodeId) {
            console.log("Showing UI to select target node for link creation");

            const handleTargetNodeClick = async (targetNode: NodeData) => {
                console.log(`Target node ${targetNode.id} selected for link creation`);

                const payload = {
                    source: selectedNodeId,
                    target: targetNode.id,
                };

                try {
                    const response = await axios.post(`${API_HOST}/link/create`, payload, {
                        headers: {
                            Authorization: localStorage.getItem("access-token"),
                        },
                    });
                    console.log("Link created successfully");
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error("Error creating link:", error.message);
                    } else {
                        console.error("Error creating link:", error);
                    }
                }

                document.removeEventListener("click", handleDocumentClick);
            };

            const handleDocumentClick = (event: MouseEvent) => {
                const targetNode = nodes.find((node) => node.id === (event.target as HTMLElement).dataset.nodeId);
                if (targetNode) {
                    handleTargetNodeClick(targetNode);
                }
            };

            document.addEventListener("click", handleDocumentClick);
        }
    };

    const handleDeleteLink = () => {
        if (selectedNodeId) {
            console.log("Deleting link");
        }
    };

    const handleBringUp = async () => {
        if (selectedNodeId) {
            try {
                const payload = {
                    taskId: selectedNodeId,
                };

                const response = await axios.post(`${API_HOST}/bringUp`, payload, {
                    headers: {
                        Authorization: localStorage.getItem("access-token"),
                    },
                });

                console.log("Bring up request successful");
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Error sending bring up request:", error.message);
                } else {
                    console.error("Error sending bring up request:", error);
                }
            }
        }
    };

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        const convertTaskToNodeData = (task: Task): NodeData => {
            //Node data is the data for each node
            const { id, title, type } = task;
            const childType = type;
            return { id, label: title, childType };
        };

        const convertTaskToLinkData = (task: Task): LinkData[] => {
            //Link data is the data for each link
            const { id, children } = task;
            if (children) {
                return children.flatMap((child) => {
                    //현재 task의 child에서 successor를 target으로 하는 link
                    if (child.successors) {
                        return child.successors.map((successor) => {
                            const source = convertTaskToNodeData(child);
                            const target = convertTaskToNodeData(successor);
                            return { source, target };
                        });
                    }
                    return [];
                });
            }
            return [];
        };

        const nodes: NodeData[] = currentTask.children ? currentTask.children.map(convertTaskToNodeData) : [];

        const links: LinkData[] = currentTask.children ? currentTask.children.flatMap(convertTaskToLinkData) : [];

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
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("orient", "auto")
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("xoverflow", "visible")
            .append("svg:path")
            .attr("d", "M 0,-5 L 10 ,0 L 0,5")
            .attr("fill", "#999");

        const link = svg
            .selectAll(`.${styles.link}`)
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("marker-end", "url(#arrowhead)");

        const node = svg
            .selectAll<SVGGElement, NodeData>(`.${styles.node}`)
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag<SVGGElement, NodeData>().on("start", dragStart).on("drag", drag).on("end", dragEnd))
            .on("contextmenu", (event, d) => {
                handleContextMenu(event, d);
            });

        // Node elements
        node.append("rect")
            .attr("class", "node-background")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 100)
            .attr("height", 60)
            .style("fill", (d) => `rgba(216, 228, 252)`);

        node.append("text")
            .attr("class", "label")
            .attr("x", 25)
            .attr("y", 15)
            .attr("width", 50)
            .attr("height", 15)
            .attr("text-anchor", "middle")
            .text((d) => d.label);

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

        // Simulation tick function
        simulation.on("tick", () => {
            link.attr("x1", (d) => d.source.x! + 100)
                .attr("y1", (d) => d.source.y! + 30)
                .attr("x2", (d) => d.target.x!)
                .attr("y2", (d) => d.target.y! + 30);

            node.attr("transform", (d) => `translate(${d.x},${d.y})`);
        });

        // Drag functions
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
            <svg ref={svgRef} width={1280} height={1024} onContextMenu={(e) => e.preventDefault()}></svg>

            <div id="context-menu" style={{ position: "absolute", display: "none" }}>
                <ul>
                    <li onClick={handleDeleteNode}>Delete Node</li>
                    <li onClick={handleModifyNodeInfo}>Modify Node Info</li>
                    <li onClick={handleAddLink}>Add Link</li>
                    <li onClick={handleDeleteLink}>Delete Link</li>
                    <li onClick={handleBringUp}>Bring Up</li>
                </ul>
            </div>

            {showDeleteConfirmation && (
                <div>
                    <p>Do you want to delete all subtasks as well?</p>
                    <input type="checkbox" checked={deleteSubTasks} onChange={handleDeleteSubTasksToggle} />
                    <label>Delete Subtasks</label>
                    <button onClick={handleDeleteConfirmation}>Delete</button>
                    <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Network;
