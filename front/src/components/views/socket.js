import io from "socket.io-client";
const socket = io.connect("http://localhost:3383");
export default socket;
