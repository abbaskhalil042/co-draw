import { WebSocketServer, WebSocket } from "ws";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { prisma } from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

interface WebSocketMessage {
  type: "join_room" | "leave_room" | "chat" | "rejoin_room" | "ping";
  room?: string;
  message?: string;
}

interface ChatMessage {
  type: "chat";
  room: string;
  message: string;
  userId: string;
  user?: {
    id: string;
    username?: string;
  };
  timestamp: string;
}

const users: User[] = [];

function checkUserToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null;
    if (!decoded?.userId) return null;
    return decoded.userId;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

function broadcastToRoom(room: string, message: string, excludeWs?: WebSocket) {
  users.forEach(user => {
    if (user.rooms.includes(room) && user.ws !== excludeWs && user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(message);
    }
  });
}

wss.on("connection", (ws, request) => {
  // Authentication
  const url = request.url;
  if (!url?.includes("?")) {
    ws.send(JSON.stringify({ error: "Invalid URL" }));
    return ws.close();
  }

  const token = new URLSearchParams(url.split("?")[1]).get("token");
  if (!token) {
    ws.send(JSON.stringify({ error: "No token provided" }));
    return ws.close();
  }

  const userId = checkUserToken(token);
  if (!userId) {
    ws.send(JSON.stringify({ error: "Invalid token" }));
    return ws.close();
  }

  // Add user to connections
  const user: User = { ws, rooms: [], userId };
  users.push(user);

  // Heartbeat
  let pingInterval: NodeJS.Timeout;
  const setupHeartbeat = () => {
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    }, 30000);
  };
  setupHeartbeat();

  // Message handling
  ws.on("message", async (data) => {
    try {
      const parsedData = JSON.parse(data.toString()) as WebSocketMessage;
      console.log("Received:", parsedData);

      switch (parsedData.type) {
        case "join_room":
          if (parsedData.room && !user.rooms.includes(parsedData.room)) {
            user.rooms.push(parsedData.room);
            ws.send(JSON.stringify({
              type: "system",
              message: `Joined room ${parsedData.room}`,
              room: parsedData.room
            }));
          }
          break;

        case "leave_room":
          if (parsedData.room) {
            user.rooms = user.rooms.filter(r => r !== parsedData.room);
            ws.send(JSON.stringify({
              type: "system",
              message: `Left room ${parsedData.room}`,
              room: parsedData.room
            }));
          }
          break;

        case "rejoin_room":
          if (parsedData.room && !user.rooms.includes(parsedData.room)) {
            user.rooms.push(parsedData.room);
            ws.send(JSON.stringify({
              type: "system",
              message: `Rejoined room ${parsedData.room}`,
              room: parsedData.room
            }));
          }
          break;

        case "chat":
          if (!parsedData.room || !parsedData.message) {
            return ws.send(JSON.stringify({ error: "Missing room or message" }));
          }

          const roomId = Number(parsedData.room);
          if (isNaN(roomId)) {
            return ws.send(JSON.stringify({
              error: "Invalid room ID",
              details: `Expected number, got '${parsedData.room}'`
            }));
          }

          try {
            const room = await prisma.room.findUnique({ where: { id: roomId } });
            if (!room) {
              return ws.send(JSON.stringify({
                error: "Room not found",
                roomId: roomId
              }));
            }

            const chat = await prisma.chat.create({
              data: {
                message: parsedData.message,
                userId,
                roomId
              },
              include: { user: { select: { id: true } } }
            });

            const chatMessage: ChatMessage = {
              type: "chat",
              room: parsedData.room,
              message: chat.message,
              userId: chat.userId,
              user: chat.user,
              timestamp: new Date().toISOString()
            };

            // Broadcast to all in room including sender
            broadcastToRoom(parsedData.room, JSON.stringify(chatMessage));
          } catch (error) {
            console.error("Database error:", error);
            ws.send(JSON.stringify({ error: "Failed to save message" }));
          }
          break;

        case "ping":
          ws.send(JSON.stringify({ type: "pong" }));
          break;

        default:
          ws.send(JSON.stringify({ error: "Unknown message type" }));
      }
    } catch (error) {
      console.error("Message processing error:", error);
      ws.send(JSON.stringify({ error: "Invalid message format" }));
    }
  });

  // Cleanup on close
  ws.on("close", () => {
    clearInterval(pingInterval);
    const index = users.findIndex(u => u.ws === ws);
    if (index !== -1) users.splice(index, 1);
    console.log(`User ${userId} disconnected`);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clearInterval(pingInterval);
    const index = users.findIndex(u => u.ws === ws);
    if (index !== -1) users.splice(index, 1);
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: "system",
    message: "Connected successfully",
    userId,
    timestamp: new Date().toISOString()
  }));

  console.log(`User ${userId} connected`);
});

console.log("WebSocket server running on ws://localhost:8080");

process.on("SIGTERM", () => {
  wss.close();
  console.log("WebSocket server closed");
});