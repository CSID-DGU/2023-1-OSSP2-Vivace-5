import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data";
import { Network, Options } from "vis-network";

interface NodeData {
    id: string;
    label: string;
    description: string;
    image: string;
    button1: () => void;
    button2: () => void;
}

interface EdgeData {
    id: string;
    from: string;
    to: string;
}

interface NetworkData {
    nodes: NodeData[];
    edges: EdgeData[];
}

interface NetworkProps {
    data: NetworkData;
}

function NetworkComponent(props: NetworkProps) {
    const { data } = props;

    const [nodeDataSet, setNodeDataSet] = useState(new DataSet<NodeData>([]));
    const [edgeDataSet, setEdgeDataSet] = useState(new DataSet<EdgeData>([]));
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load node data from database and update nodeDataSet
        const nodes = data.nodes;
        setNodeDataSet(new DataSet<NodeData>(nodes));

        // Load edge data from database and update edgeDataSet
        const edges = data.edges;
        setEdgeDataSet(new DataSet<EdgeData>(edges));
    }, [data]);

    useEffect(() => {
        if (containerRef.current) {
            const network = new Network(containerRef.current, { nodes: nodeDataSet, edges: edgeDataSet }, options);
        }
    }, [nodeDataSet, edgeDataSet]);

    const options: Options = {
        nodes: {
            shape: "box",
            color: "#ffffff",
            font: {
                size: 14,
            },
        },
        edges: {
            color: "#cccccc",
        },
    };

    return <div ref={containerRef} style={{ height: "600px" }} />;
}

export default NetworkComponent;
