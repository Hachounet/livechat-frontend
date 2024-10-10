import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [actualPage, setActualPage] = useState([]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [navBarVisible, setNavBarVisible] = useState(true);

  const [logged, setLogged] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [actualContactPseudo, setActualContactPseudo] = useState('');
  const [groupsRefresh, setGroupsRefresh] = useState(false);
  const [friendsRefresh, setFriendsRefresh] = useState(false);

  useEffect(() => {
    if (token) {
      setLogged(true); // Logged if token is found in localStorage.
    }
  }, [token]);

  useEffect(() => {
    // Check width to display or not NavBar
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        actualPage,
        setActualPage,
        screenWidth,
        navBarVisible,
        setNavBarVisible,
        logged,
        setLogged,
        token,
        setToken,
        actualContactPseudo,
        setActualContactPseudo,
        groupsRefresh,
        setGroupsRefresh,
        friendsRefresh,
        setFriendsRefresh,
      }}
    >
      {' '}
      {children}{' '}
    </ChatContext.Provider>
  );
};

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired, // Child are react elements
};

export const useChatContext = () => useContext(ChatContext);
