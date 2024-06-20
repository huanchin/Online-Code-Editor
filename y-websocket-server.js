const WebSocket = require("ws");
const Y = require("yjs");
const { setupWSConnection } = require("y-websocket/bin/utils");

const wss = new WebSocket.Server({ port: 1234 });

wss.on("connection", (ws, req) => {
  const docName = req.url.slice(1); // Extract room name from URL
  const doc = new Y.Doc(); // Create a new Yjs document

  // Setup WebSocket connection to synchronize the Yjs document
  setupWSConnection(ws, doc, { docName });
});

console.log("Y-Websocket server running on port 1234");
