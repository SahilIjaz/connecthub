import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import { setupSocket } from "../connecthub/app/api/socket/route";

const httpServer = createServer();
const io = new IOServer(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

setupSocket(io);

const PORT = 3001;
httpServer.listen(PORT, () =>
  console.log(`Socket.IO server running on port ${PORT}`)
);
