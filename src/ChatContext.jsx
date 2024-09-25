import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
 
  return (
    <ChatContext.Provider
      value={{
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