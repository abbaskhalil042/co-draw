import { WebSocketServer } from "ws";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const decoded = jwt.verify(queryParams.get("token")!, JWT_SECRET);

  if (!decoded || !(decoded as jwt.JwtPayload).userId) {
    ws.close();
    return;
  }
  ws.on("message", (data) => {
    //*receive message
    ws.send("Hello");  
  });
});
