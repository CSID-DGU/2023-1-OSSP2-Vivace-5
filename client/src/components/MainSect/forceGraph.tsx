import React from "react";
import ForceGraph2D, { LinkObject, NodeObject } from "react-force-graph-2d";

interface CardNodeProps {
    node: NodeObject;
    ctx: CanvasRenderingContext2D;
    globalScale: number;
}

function CardNode({ node, ctx, globalScale }: CardNodeProps) {
    const ref = React.useRef<HTMLDivElement>(null);

    // set the fixed size of the node
    const width = 100 / globalScale;
    const height = 60 / globalScale;

    // draw the card background
    ctx.fillStyle = "#fff";
    ctx.fillRect(-width / 2, -height / 2, width, height);

    // draw the label and contents
    const { label, contents } = node;
    const fontSize = 12 / globalScale;
    const padding = 4 / globalScale;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    ctx.fillText(label, 0, -fontSize / 2 - padding);
    if (contents) {
        ctx.fillText(contents, 0, fontSize / 2 + padding);
    }

    return <div ref={ref} />;
}

interface MyGraphProps {
    data: { nodes: NodeObject[]; edges: { source: string; targets: string[] }[] };
}

function MyGraph({ data }: MyGraphProps) {
    const { nodes, edges } = data;

    // create a map of node IDs to nodes
    const nodeMap = new Map<string, NodeObject>();
    nodes.forEach((node) => nodeMap.set(node.id?.toString() ?? "", node));

    // create an array of links from the edges
    const links = edges.reduce<LinkObject[]>((acc, edge) => {
        const source = nodeMap.get(edge.source);
        if (!source) return acc;
        const targets = edge.targets.map((target) => nodeMap.get(target)).filter(Boolean);
        if (targets.length === 0) return acc;
        return [...acc, ...targets.map((target) => ({ source, target }))];
    }, []);

    return (
        <ForceGraph2D
            graphData={{ nodes, links }}
            nodeCanvasObject={(node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => (
                <CardNode node={node} ctx={ctx} globalScale={globalScale} />
            )}
        />
    );
}

export default MyGraph;
