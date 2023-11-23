import {useEffect, useMemo, useState} from 'react';
import ReactFlow, {
    Background,
    ConnectionLineType,
    Edge,
    Node,
    Panel,
    Position,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';

import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

type Direction = 'TB' | 'LR';
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction: Direction) => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({rankdir: direction});

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {width: nodeWidth, height: nodeHeight});
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const nextNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        console.log(node.id, nodeWithPosition.x, nodeWithPosition.y);

        return {
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            }
        };
    });

    console.log(nextNodes.map(n => ({id: n.id, x: n.position.x, y: n.position.y})));

    return {nodes: nextNodes, edges};
};

interface Props {
    nodes: { id: string, label: string }[];
    edges: { source: string, target: string }[];
    addNode: () => void;
    removeNode: () => void;
    mayAddNode: boolean;
    mayRemoveNode: boolean;
}

const Graph = (props: Props) => {
    const {fitView} = useReactFlow();
    const [direction, setDirection] = useState<Direction>('TB');

    const {nodes: initialNodes, edges: initialEdges} = useMemo(() => getLayoutedElements(
        props.nodes.map(({id, label}) => ({id, data: {label}, position: {x: 0, y: 0}})),
        props.edges.map(({source, target}) => ({
                id: `${source}-${target}`,
                source,
                target,
                type: ConnectionLineType.SmoothStep
            })
        ), direction), [props.nodes, props.edges, direction]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        console.log('initial nodes/edges changed, rerendering');
        setNodes(initialNodes);
        setEdges(initialEdges);
        fitView();
    }, [initialNodes, initialEdges]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            connectionLineType={ConnectionLineType.SmoothStep}
            nodesConnectable={false}
            fitView
        >
            <Panel position="top-right">
                <button onClick={props.addNode} disabled={!props.mayAddNode}>add node</button>
                <button onClick={props.removeNode} disabled={!props.mayRemoveNode}>rm node</button>
                <button onClick={() => setDirection('TB')}>vertical layout</button>
                <button onClick={() => setDirection('LR')}>horizontal layout</button>
            </Panel>
            <Background color="#aaa" gap={16}/>
        </ReactFlow>
    );
};

export default Graph;
