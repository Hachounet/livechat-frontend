import { useState, useEffect } from 'react';
import NavBar from './Navbar';
import SwitchNavBar from './SwitchNavBar'; // Assurez-vous que ce composant est importé
import { useChatContext } from '../ChatContext';
import { useSocketContext } from '../SocketContext';

export default function Home() {
  const { actualPage, screenWidth, navBarVisible, token } = useChatContext();
  const { socket, connectSocket } = useSocketContext();

  // Socket connexion when first mount of component. <Home> is protected so it cannot be mounted if user is not logged in.
  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', token); // Send token to be decrypted and retrieve userId
    }
  }, [socket, token]); // Déclenche ce useEffect lorsque socket ou token change

  return (
    <>
      <NavBar />
      <div className="flex-1 relative w-full overflow-y-auto flex justify-center">
        {screenWidth < 768 && !navBarVisible && <SwitchNavBar />} {actualPage}
      </div>
    </>
  );
}
