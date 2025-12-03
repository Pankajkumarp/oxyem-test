import { createContext } from 'react';
import socketio from "socket.io-client";

export const socket = socketio.connect(process.env.NEXT_PUBLIC_HOST);
export const SocketContext = createContext();