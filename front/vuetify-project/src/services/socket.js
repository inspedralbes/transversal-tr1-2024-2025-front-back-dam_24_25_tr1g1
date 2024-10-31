// src/services/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:26968'); // Cambia la URL según sea necesario

export default socket;
