import { useEffect } from 'react';
import NavBar from './Navbar';
import SwitchNavBar from './SwitchNavBar'; // Assurez-vous que ce composant est importé
import { useChatContext } from '../ChatContext';
import { useSocketContext } from '../SocketContext';
import Search from './Search';
import FriendsRequest from './FriendsRequest';
import Settings from './Settings';
import GroupChat from './GroupChat';
import PrivateChat from './PrivateChat';
import GroupHandler from './GroupHandler';

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
  }, [socket, token]); //UseEffect is launched if socket or token change to always be up-to-date

  return (
    <>
      <NavBar />
      <div className="flex-1 relative w-full overflow-y-auto flex justify-center">
        {screenWidth < 768 && !navBarVisible && <SwitchNavBar />}
        {actualPage[0] === 'privatechat' ? (
          <PrivateChat contactId={actualPage[1]} />
        ) : actualPage[0] === 'search' ? (
          <Search />
        ) : actualPage[0] === 'friendsrequests' ? (
          <FriendsRequest />
        ) : actualPage[0] === 'grouphandler' ? (
          <GroupHandler />
        ) : actualPage[0] === 'settings' ? (
          <Settings />
        ) : actualPage[0] === 'groupchat' ? (
          <GroupChat groupId={actualPage[1]} />
        ) : null}
      </div>
    </>
  );
}
