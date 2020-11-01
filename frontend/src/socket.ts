import io from 'socket.io-client';

const socket = io.connect("https://3.34.127.50:443");

export default socket;