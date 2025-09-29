import { io } from "socket.io-client";

// 👇 Conexión al servidor, NO al endpoint KeepAlive
const socket = io("http://172.16.43.22:4002", {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
