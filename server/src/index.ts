import * as express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { createProxyMiddleware } from "http-proxy-middleware";

import { lists } from "./assets/mock-data";
import { Database } from "./data/database";
import { CardHandler, ListHandler } from "./handlers/handlers";
import { ReorderService } from "./services/reorder.service";

const PORT = process.env.PORT || 3000;
const CLIENT_PORT = process.env.CLIENT_PORT || 5172;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  "/socket.io",
  createProxyMiddleware({
    target: `http://localhost:${CLIENT_PORT}`,
    changeOrigin: true,
    ws: true,
  })
);

const db = Database.Instance;
const reorderService = new ReorderService();

if (process.env.NODE_ENV !== "production") {
  db.setData(lists);
}

io.on("connection", (socket: Socket) => {
  new ListHandler(io, db, reorderService).handleConnection(socket);
  new CardHandler(io, db, reorderService).handleConnection(socket);
});

httpServer.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

export { httpServer };
