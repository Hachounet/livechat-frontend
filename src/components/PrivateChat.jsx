import { useState, useEffect, useRef } from 'react';
import ChatResponse from './ChatResponse';
import ChatAnswer from './ChatAnswer';
import ChatInput from './ChatInput';
import ChatResponseImg from './ChatResponseImg';
import ChatAnswerImg from './ChatAnswerImg';
import { getPrivateMessagesURL } from '../DevHub';
import useAuth from '../hooks/authFetch';
import { useChatContext } from '../ChatContext';
import PropTypes from 'prop-types';
import { useSocketContext } from '../SocketContext';

export default function PrivateChat({ contactId }) {
  const freshURL = `${getPrivateMessagesURL}/${contactId}`;
  const { data, loading, error } = useAuth(freshURL);
  const { socket } = useSocketContext();
  const { token, setLogged, setActualContactPseudo } = useChatContext();
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null); // To force-focus on last msg

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (data && data.messages) {
      setMessages(data.messages);
      setActualContactPseudo(data.receiverPseudo.pseudo);
    }
  }, [data, setActualContactPseudo]);

  useEffect(() => {
    if (socket) {
      const handleIncomingPrivateMessage = (newMessage) => {
        if (newMessage.senderId === contactId) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };

      const handleStartTyping = (userId) => {
        if (userId === contactId) {
          setTypingUsers((prev) => new Set(prev).add(userId));
        }
      };

      const handleStopTyping = (userId) => {
        if (userId === contactId) {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        }
      };

      socket.on('privateMessageReceived', handleIncomingPrivateMessage);
      socket.on('startTypingPrivate', handleStartTyping);
      socket.on('stopTypingPrivate', handleStopTyping);

      return () => {
        socket.off('privateMessageReceived', handleIncomingPrivateMessage);
        socket.off('startTypingPrivate', handleStartTyping);
        socket.off('stopTypingPrivate', handleStopTyping);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }
  }, [socket, contactId]);

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error occurred.</div>;

  const handlePostRequest = async (event) => {
    event.preventDefault();

    if (inputMsg === '' || inputMsg.trim().length < 2) {
      return;
    }

    const response = await fetch(`${getPrivateMessagesURL}/${contactId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ msg: inputMsg }),
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      setLogged(false);
      window.location.href = '/';
      return;
    }

    if (response.ok) {
      const newData = await response.json();

      setMessages((prevMessages) => [...prevMessages, newData.newMessage]);

      socket.emit('privateMessageSent', {
        recipientId: contactId,
        message: newData.newMessage,
      });

      setInputMsg('');
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      socket.emit('startTypingPrivate', contactId);
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTypingPrivate', contactId);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      <div className="pt-11 min-w-[70%] flex flex-col items-center">
        <div
          ref={messagesEndRef}
          className=" h-[75%] overflow-auto absolute top-12 md:h-[80%] w-[90%] md:w-[50%]"
        >
          {messages.map((message) =>
            message.senderId === data.userId ? (
              message.file ? (
                <ChatResponseImg
                  key={message.id}
                  imgUrl={message.file.url}
                />
              ) : (
                <ChatResponse
                  key={message.id}
                  content={message.content}
                />
              )
            ) : message.file ? (
              <ChatAnswerImg
                key={message.id}
                imgUrl={message.file.url}
              />
            ) : (
              <ChatAnswer
                key={message.id}
                content={message.content}
              />
            )
          )}
        </div>

        <ChatInput
          value={inputMsg}
          onChange={(e) => {
            setInputMsg(e.target.value);
            handleTyping();
          }}
          onSubmit={(event) => handlePostRequest(event)}
          receiverId={contactId}
          receiverPseudo={data.receiverPseudo.pseudo}
          setMessages={setMessages}
          groupOrPm={'private-chat'}
        />
        {typingUsers.size > 0 && (
          <div className="absolute bottom-48 md:bottom-20 self-center text-white">
            {typingUsers.size > 0
              ? `${data.receiverPseudo.pseudo} is typing...`
              : null}
          </div>
        )}
      </div>
    </>
  );
}

PrivateChat.propTypes = {
  contactId: PropTypes.string.isRequired,
};
