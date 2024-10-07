import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [userIdSocket, setUserIdSocket] = useState(null);

  const connectSocket = () => {
    const newSocket = io('http://localhost:3000', {
      autoConnect: true,
      reconnection: false,
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.io');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    setSocket(newSocket);
  };

  return (
    <SocketContext.Provider
      value={{ socket, connectSocket, userIdSocket, setUserIdSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
