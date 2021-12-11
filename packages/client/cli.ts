const yourName = prompt("Your Name: ")

const logError = (msg: string) => {
  console.error(msg);
};

const handleConnected = (ws: WebSocket) => {
  console.log("Connected to server ...");
  handleMessage(ws, "Welcome!");
};

const handleMessage = (ws: WebSocket, data: string) => {
  console.log("SERVER >> " + data);
  const reply = prompt("Client >> ");
  ws.send(`[${yourName}] ${reply ?? "No reply"}`);
};

const handleError = (e: Event | ErrorEvent) =>
  console.log(e instanceof ErrorEvent ? e.message : e.type);
console.log("Connecting to server ...");

try {
  const ws = new WebSocket("ws://localhost:5000");
  ws.onopen = () => handleConnected(ws);
  ws.onmessage = (message) => handleMessage(ws, message.data);
  ws.onclose = () => logError("Disconnected from server ...");
  ws.onerror = (e) => handleError(e);
} catch (err) {
  logError("Failed to connect to server ... exiting");
}
