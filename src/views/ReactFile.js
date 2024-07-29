import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import axios from 'axios';

const { TreeNode } = Tree;

// Recursive function to render the tree nodes
const renderTreeNodes = (data) => {
    return data.map((item) =>
        item.isDirectory ? (
            <TreeNode title={item.name} key={item.name} isLeaf={false}>
                {item.children && renderTreeNodes(item.children)}
            </TreeNode>
        ) : (
            <TreeNode title={item.name} key={item.name} isLeaf={true} />
        )
    );
};

const FileManager = ({ data }) => (
    <Tree>
        {renderTreeNodes([data])}
    </Tree>
);
// Example usage

const data = {
    name: "Scan Data",
    isDirectory: true,
    children: [
        {
            name: "Sample Data",
            isDirectory: true,
            children: [
                { name: "Back.jpg", isDirectory: false, children: null },
                { name: "Front.jpg", isDirectory: false, children: null }
            ]
        },
        {
            name: "Tanzania",
            isDirectory: true,
            children: [
                {
                    name: "d",
                    isDirectory: true,
                    children: [
                        { name: "200009B copy 1.jpg", isDirectory: false, children: null },
                        { name: "200009B copy 10.jpg", isDirectory: false, children: null }
                    ]
                }
            ]
        }
    ]
};

function ReactFile() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("https://28mdpn6d-5289.inc1.devtunnels.ms/GetDirectory");
                console.log(res)
                setData(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, [])
    return <FileManager data={data} />;
}

export default ReactFile;