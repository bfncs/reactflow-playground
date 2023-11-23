import Graph from "./Graph.tsx";
import './App.css';
import {useState} from "react";
import {ReactFlowProvider} from "reactflow";

const ANTICIPATE_EDGES = false;

const allNodes = [
    {
        id: '1',
        label: 'input'
    },
    {
        id: '2',
        label: 'node 2',
    },
    {
        id: '2a',
        label: 'node 2a',
    },
    {
        id: '2b',
        label: 'node 2b',
    },
    {
        id: '2c',
        label: 'node 2c',
    },
    {
        id: '2d',
        label: 'node 2d',
    },
    {
        id: '3',
        label: 'node 3'
    }
];

export const allEdges = [
    {source: '1', target: '2'},
    {source: '1', target: '3'},
    {source: '2', target: '2a'},
    {source: '2', target: '2b'},
    {source: '2', target: '2c'},
    {source: '2c', target: '2d'}
];

const App = () => {
    const [numVisibleNodes, setNumVisibleNodes] = useState(2);

    const nodes = allNodes.slice(0, numVisibleNodes);
    const edges = ANTICIPATE_EDGES ? allEdges.filter(
        edge => nodes.some(node => node.id === edge.source || node.id === edge.target)
    ) : allEdges.filter(edge => nodes.some(node => node.id === edge.source) && nodes.some(node => node.id === edge.target));

    console.table( edges);

    return (
        <ReactFlowProvider>
            <Graph nodes={nodes} edges={edges}
                   addNode={() => setNumVisibleNodes(prevState => prevState + 1)}
                   removeNode={() => setNumVisibleNodes(prevState => prevState - 1)}
                   mayAddNode={numVisibleNodes < allNodes.length} mayRemoveNode={numVisibleNodes > 1}/>
        </ReactFlowProvider>
    );
}

export default App;
