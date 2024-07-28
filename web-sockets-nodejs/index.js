const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log("listening on port 8080");
});

const clients = new Map();

wss.on("connection", (ws) => {
  // generate unique id
  console.log("new client connected");
  const id =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const color = Math.floor(Math.random() * 16777215).toString(16);
  const metadata = { id, color };

  clients.set(ws, metadata);

  ws.on("message", (messageAsString) => {
    const message = JSON.parse(messageAsString);
    const { id, color } = clients.get(ws);
    message.id = id;
    message.color = color;    
    
    // console.log("received: %s", message);


    [...clients.keys()].forEach((client) => {
      client.send(JSON.stringify(message));
    });
  });

  ws.on("close", () => {
    console.log("client disconnected");
    clients.delete(ws);
  });
});
