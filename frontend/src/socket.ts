import io from 'socket.io-client';

const socket = io('localhost:5000');

export default socket;