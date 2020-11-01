import io from 'socket.io-client';

const socket = io.connect("http://3.34.127.50:8080");

export default socket;