import { createContext, useContext, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const connectSocket = () => {
    const newSocket = io('https://livechat-backend-hachounet.adaptable.app', {
      autoConnect: true,
      reconnection: false,
    });

    newSocket.on('connect_error', (err) => {
      // eslint-disable-next-line no-console
      console.error('Socket connection error:', err.message);
    });

    setSocket(newSocket);
  };

  return (
    <SocketContext.Provider value={{ socket, connectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
