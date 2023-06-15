import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Node,
  XYPosition,
  MarkerType,
  Panel,
  Position,
  ConnectionMode,
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";
import { BriefTaskInfoType } from "../types/BriefTaskInfo.typs";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dagre from "dagre";
import GraphNode from "./GraphNode";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import "reactflow/dist/style.css";
import "../styles/buttonedge.css";
import { tokens } from "../theme";
import { SubTask } from "../Enum/SubTask.enum";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import axios, { AxiosResponse } from "axios";
import { API_HOST, CREATED_RESPONCE, OK_RESPONCE } from "../constants";
import { Right } from "../Enum/Right.enum";
import { BookmarkListItemType } from "../types/BookmarkListItem.type";

dayjs.extend(utc);

const NODE_WIDTH = 300;
const NODE_HEIGHT = 100;

enum Direction {
  LR = "LR",
  TD = "TB",
}

type GraphProps = {
  projectId: string;
  parentId?: string;
  tasks: BriefTaskInfoType[];
  right: Right;
  bookmarkList: BookmarkListItemType[];
  forceRerenderingProject: () => void;
};

const Graph: React.FC<GraphProps> = (props) => {
  /* CUSTOM EDGE */
  const onEdgeClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    event.stopPropagation();

    const sourceId = id.substring(0, 36);
    const targetId = id.substring(37, 73);

    try {
      const res: AxiosResponse = await axios.patch(
        `${API_HOST}/task/disconnect`,
        {
          taskId: targetId,
          taskIdsToAppend: [sourceId],
        },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status === OK_RESPONCE) {
        props.forceRerenderingProject();
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to append tasks in the project ${props.projectId}..`);
        props.forceRerenderingProject();
      }
    }
  };

  const ButtonEdge: React.FC<EdgeProps> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
  }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <button className="edgebutton" onClick={(event) => onEdgeClick(event, id)}>
              ×
            </button>
          </div>
        </EdgeLabelRenderer>
      </>
    );
  };

  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* STATES */
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSend, setIsSend] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<SubTask>(SubTask.GRAPH);
  const [start, setStart] = useState<Dayjs | null>(dayjs("2023-06-01"));
  const [deadline, setDeadline] = useState<Dayjs | null>(dayjs("2023-06-01"));
  const [isVertical, setIsVertical] = useState<boolean>(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const nodeTypes = useMemo(() => ({ graphNode: GraphNode }), []);
  const edgeTypes = useMemo(
    () => ({
      buttonEdge: ButtonEdge,
    }),
    [],
  );

  /* USE EFFECT */
  useEffect(() => {
    onLayout(isVertical ? Direction.TD : Direction.LR);
  }, [edges]);

  useEffect(() => {
    const nodeInfos: Node[] = [];
    const edgeInfos: Edge[] = [];

    for (const task of props.tasks) {
      const nodeInfo: Node = {
        id: task.id,
        type: "graphNode",
        position: { x: 0, y: 0 } as XYPosition,
        data: {
          task,
          isVertical: false,
          forceRerenderingProject: props.forceRerenderingProject,
          right: props.right,
          bookmarkList: props.bookmarkList,
          projectId: props.projectId,
        },
        draggable: false,
      };

      nodeInfos.push(nodeInfo);

      for (const predecessor of task.predecessors) {
        const newEdge: Edge = {
          id: predecessor.id.concat("-", task.id),
          source: predecessor.id,
          target: task.id,
          type: "buttonEdge",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
          },
          style: {
            strokeWidth: 2,
          },
        };

        edgeInfos.push(newEdge);
      }
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodeInfos, edgeInfos);

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [props]);

  /* FUNCTIONS */
  const getLayoutedElements = (nodes: Node[], edges: Edge[], direction: Direction = Direction.LR) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node: Node) => {
      dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    edges.forEach((edge: Edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node: Node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const isVertical = direction === Direction.TD;
      node.data.isVertical = isVertical;
      node.targetPosition = isVertical ? Position.Top : Position.Left;
      node.sourcePosition = isVertical ? Position.Bottom : Position.Right;

      node.position = {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      };

      return node;
    });

    return { nodes, edges };
  };

  const onConnect = useCallback(
    async (params: Edge | Connection) => {
      try {
        const res: AxiosResponse = await axios.patch(
          `${API_HOST}/task/append/before`,
          {
            taskId: params.target as string,
            taskIdsToAppend: [params.source as string],
          },
          {
            headers: {
              withCredentials: true,
              crossDomain: true,
              credentials: "include",
            },
          },
        );

        if (res.status === OK_RESPONCE) {
          setEdges((eds) =>
            addEdge(
              {
                ...params,
                id: (params.source as string).concat("-", params.target as string),
                type: "buttonEdge",
                animated: true,
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 15,
                },
                style: {
                  strokeWidth: 2,
                },
              },
              eds,
            ),
          );

          props.forceRerenderingProject();
          return;
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(`Failed to append tasks in the project ${props.projectId}..`);
        }
      }
    },
    [setEdges],
  );

  const onLayout = useCallback(
    (direction: Direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
  );

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value as SubTask);
  };

  const handleAddTask = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsSend(true);

    let payload = {};

    if (props.parentId) {
      payload = {
        projectId: props.projectId,
        parentId: props.parentId,
        isKanban: false,
        title,
        description,
        type,
        start: (start as Dayjs).utc().format(),
        deadline: (deadline as Dayjs).utc().format(),
      };
    } else {
      payload = {
        projectId: props.projectId,
        isKanban: false,
        title,
        description,
        type,
        start: (start as Dayjs).utc().format(),
        deadline: (deadline as Dayjs).utc().format(),
      };
    }

    try {
      const res: AxiosResponse = await axios.post(`${API_HOST}/task/create`, payload, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === CREATED_RESPONCE) {
        setTitle("");
        setDescription("");
        setIsSend(false);
        setIsOpen(false);
        props.forceRerenderingProject();
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to create task in the project ${props.projectId}..`);
        setTitle("");
        setDescription("");
        setIsSend(false);
        setIsOpen(false);
      }
    }
  };

  return (
    <Box sx={{ width: "100%", height: "calc(100vh - 240px)" }}>
      <Tooltip title="Create Task">
        <IconButton sx={{ position: "absolute", zIndex: 1, m: "10px" }} onClick={() => setIsOpen(true)}>
          <AddOutlinedIcon sx={{ fontSize: "30px" }} />
        </IconButton>
      </Tooltip>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Strict}
        connectOnClick={true}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-right">
          <Button
            variant="contained"
            onClick={() => {
              onLayout(Direction.TD);
              setIsVertical(true);
            }}
            color="info"
            sx={{ mr: "10px" }}
          >
            Vertical Layout
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onLayout(Direction.LR);
              setIsVertical(false);
            }}
            color="success"
          >
            Horizontal Layout
          </Button>
        </Panel>
      </ReactFlow>

      {/* CREATE TASK DIALOG */}
      <Dialog open={isOpen}>
        <DialogTitle variant="h4">Create a task</DialogTitle>
        <DialogContent>
          {/* TITLE */}
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            error={title === "" && isSend}
            helperText="Title is empty."
            fullWidth
            variant="standard"
            color="secondary"
          />

          {/* DESCRIPTION */}
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            error={description === "" && isSend}
            helperText="Description is empty."
            fullWidth
            variant="standard"
            color="secondary"
          />

          {/* TYPE */}
          <FormControl sx={{ m: "30px", width: "85%" }}>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              color="secondary"
              value={type}
              label="Sub-Task Type"
              onChange={handleTypeChange}
            >
              <MenuItem value={SubTask.GRAPH}>Graph</MenuItem>
              <MenuItem value={SubTask.LIST}>List</MenuItem>
              <MenuItem value={SubTask.KANBAN}>Kanban Board</MenuItem>
              <MenuItem value={SubTask.TERMINAL}>Terminal</MenuItem>
            </Select>
          </FormControl>

          {/* START, DEADLINE */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <DatePicker label="Start Date" value={start} onChange={(newStart) => setStart(newStart)} />
              <DatePicker label="deadline Date" value={deadline} onChange={(newDeadline) => setDeadline(newDeadline)} />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsOpen(false);
              setIsSend(false);
              setTitle("");
              setDescription("");
            }}
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleAddTask} color="success">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Graph;
