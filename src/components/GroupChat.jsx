import ChatInput from './ChatInput';
import { getGroupMessagesUrl } from '../DevHub';
import { useChatContext } from '../ChatContext';
import { useState, useEffect } from 'react';
import useAuth from '../hooks/authFetch';
import ChatResponseImg from './ChatResponseImg';
import ChatResponse from './ChatResponse';
import ChatAnswer from './ChatAnswer';
import ChatAnswerImg from './ChatAnswerImg';
import Avatar from './Avatar';
import PropTypes from 'prop-types';

export default function GroupChat({ groupId = 1 }) {
  console.log(groupId);
  const groupMessagesUrl = `${getGroupMessagesUrl}/${groupId}`;
  const { data, loading, error } = useAuth(groupMessagesUrl);
  const { token, setLogged, setActualContactPseudo } = useChatContext();
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');

  const getAvatarUrl = (senderId) => {
    const member = data.users.members.find((m) => m.user.id === senderId);
    return member ? member.user.avatarUrl : null;
  };

  const getPseudo = (senderId) => {
    const member = data.users.members.find((m) => m.user.id === senderId);
    return member ? member.user.pseudo : 'Unknown User';
  };

  useEffect(() => {
    if (data) {
      setMessages(data.messages);
      console.log('hoihoi', data);
      setActualContactPseudo(data.group.name);
    }
  }, [data]);

  const handlePostRequest = async (event) => {
    event.preventDefault();

    if (inputMsg === '' || inputMsg.trim().length < 2) {
      return;
    }

    const response = await fetch(`${getGroupMessagesUrl}/${groupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: inputMsg }),
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
      setInputMsg('');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occured...</div>;
  return (
    <>
      <div className="pt-11 min-w-[70%] flex flex-col items-center">
        <div className=" h-[75%] overflow-auto absolute top-14 md:h-[90%] w-[90%] flex flex-col gap-2">
          {messages.map((message) =>
            message.senderId === data.userId ? (
              message.file ? (
                <>
                  <ChatResponseImg
                    key={message.id}
                    imgUrl={message.file.url}
                  />
                </>
              ) : (
                <>
                  <ChatResponse
                    key={message.id}
                    content={message.content}
                  />
                </>
              )
            ) : message.file ? (
              <>
                <Avatar avatarUrl={getAvatarUrl(message.senderId)} />
                <ChatAnswerImg
                  key={message.id}
                  imgUrl={message.file.url}
                />
              </>
            ) : (
              <>
                <div className="flex">
                  <Avatar avatarUrl={getAvatarUrl(message.senderId)} />

                  <ChatAnswer
                    key={message.id}
                    content={`${getPseudo(message.senderId)}: ${message.content}`}
                  />
                </div>
              </>
            )
          )}
        </div>

        <ChatInput
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onSubmit={(e) => handlePostRequest(e)}
          receiverId={groupId}
          setMessages={setMessages}
          groupOrPm={data.group.isPublic ? 'group-public' : 'group-private'}
        />
      </div>
    </>
  );
}

GroupChat.propTypes = {
  groupId: PropTypes.string,
};
