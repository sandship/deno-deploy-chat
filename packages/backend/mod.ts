import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const sockets = new Set<WebSocket>();

const handleConnected = () => {
  console.log("Connected to client ...");
};

const broadCast = (sockets: Set<WebSocket>, data: string) =>{
  console.log(data)
  sockets.forEach((ws) => ws.send(data));}

const handleError = (e: Event | ErrorEvent) =>
  console.log(e instanceof ErrorEvent ? e.message : e.type);

serve(async (req: Request): Promise<Response> => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket: ws, response } = Deno.upgradeWebSocket(req);
  ws.onopen = () => handleConnected();
  ws.onmessage = (message) => broadCast(sockets, message.data); // 
  ws.onclose = () => console.log("Disconnected from client: ");
  ws.onerror = (e) => handleError(e);

  sockets.add(ws);

  return response;
}, { addr: ":5000" });
