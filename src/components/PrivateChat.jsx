import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (data && data.messages) {
      setMessages(data.messages);

      setActualContactPseudo(data.receiverPseudo.pseudo);
    }
  }, [data]);

  useEffect(() => {
    if (socket) {
      const handleIncomingPrivateMessage = (newMessage) => {
        if (newMessage.senderId === contactId) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };

      socket.on('privateMessageReceived', handleIncomingPrivateMessage);

      return () => {
        socket.off('privateMessageReceived', handleIncomingPrivateMessage);
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

  return (
    <>
      <div className="pt-11 min-w-[70%] flex flex-col items-center">
        <div className=" h-[75%] overflow-auto absolute top-12 md:h-[90%] w-[90%]">
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
          onChange={(e) => setInputMsg(e.target.value)}
          onSubmit={(event) => handlePostRequest(event)}
          receiverId={contactId}
          setMessages={setMessages}
          groupOrPm={'private-chat'}
        />
      </div>
    </>
  );
}

PrivateChat.propTypes = {
  contactId: PropTypes.string.isRequired,
};
