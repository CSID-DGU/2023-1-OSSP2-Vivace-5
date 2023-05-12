// import NetworkComponent from "./Graph";

// function MainSection() {
//     const networkData = {
//         nodes: [
//             {
//                 id: "node1",
//                 label: "Node 1",
//                 description: "Description of Node 1",
//                 image: "image1.jpg",
//                 button1: () => console.log("Button 1 clicked"),
//                 button2: () => console.log("Button 2 clicked"),
//             },
//             {
//                 id: "node2",
//                 label: "Node 2",
//                 description: "Description of Node 2",
//                 image: "image2.jpg",
//                 button1: () => console.log("Button 1 clicked"),
//                 button2: () => console.log("Button 2 clicked"),
//             },
//             {
//                 id: "node3",
//                 label: "Node 3",
//                 description: "Description of Node 3",
//                 image: "image3.jpg",
//                 button1: () => console.log("Button 1 clicked"),
//                 button2: () => console.log("Button 2 clicked"),
//             },
//         ],
//         edges: [
//             { id: "edge1", from: "node1", to: "node2" },
//             { id: "edge2", from: "node2", to: "node3" },
//             { id: "edge3", from: "node3", to: "node1" },
//         ],
//     };

//     return (
//         <div>
//             <h2>Main Section</h2>
//             <NetworkComponent data={networkData} />
//         </div>
//     );
// }

// export default MainSection;

// import React from "react";
// import ForceGraph2D, { NodeObject } from "react-force-graph-2d";

// interface MainSectionProps {
//     data: { nodes: NodeObject[]; edges: { source: string; targets: string[] }[] };
// }

// function MainSection({ data }: MainSectionProps) {
//     return (
//         <div className="main-section">
//             <ForceGraph2D graphData={data} />
//         </div>
//     );
// }

// export default MainSection;
import React from "react";
import KanbanBoard from "./Kanban";

const MainSection: React.FC = () => {
    return (
        <div>
            <h2>Main Section</h2>
            <KanbanBoard />
        </div>
    );
};

export default MainSection;
