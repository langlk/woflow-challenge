const axios = require("axios");

const nodeCounts = {};
const startingNode = "089ef556-dfff-4ff2-9733-654645be56fe";
let mostSharedId = startingNode;
let mostSharedCount = 1;

async function countNodeAndChildren(nodeId) {
  // Count node
  if (nodeCounts[nodeId] !== undefined) {
    nodeCounts[nodeId] += 1;
  } else {
    nodeCounts[nodeId] = 1;
  }

  // Check if we have a new max count
  if (mostSharedCount < nodeCounts[nodeId]) {
    mostSharedId = nodeId;
    mostSharedCount = nodeCounts[nodeId];
  }

  // Get child nodes
  const response = await axios.get(`https://nodes-on-nodes-challenge.herokuapp.com/nodes/${nodeId}`);
  // Recurse through child nodes
  await Promise.all(response.data[0].child_node_ids.map(child => countNodeAndChildren(child)));
}

async function countNodes(startNode) {
  try {
    await countNodeAndChildren(startNode);
    console.log("Total nodes:", Object.keys(nodeCounts).length);
    console.log("Most shared:", mostSharedId);
  } catch (err) {
    console.error("Something went wrong, api status:", err.response.status);
  }
}

countNodes(startingNode);