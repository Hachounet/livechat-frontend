import ChatInput from './ChatInput';
import { getGroupMessagesUrl } from '../DevHub';
import { useChatContext } from '../ChatContext';
import { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/authFetch';
import ChatResponseImg from './ChatResponseImg';
import ChatResponse from './ChatResponse';
import ChatAnswer from './ChatAnswer';
import ChatAnswerImg from './ChatAnswerImg';
import Avatar from './Avatar';
import PropTypes from 'prop-types';
import { useSocketContext } from '../SocketContext';

export default function GroupChat({ groupId = 1 }) {
  const groupMessagesUrl = `${getGroupMessagesUrl}/${groupId}`;
  const { data, loading, error } = useAuth(groupMessagesUrl);
  const { token, setLogged, setActualContactPseudo } = useChatContext();
  const { socket } = useSocketContext();
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [avatars, setAvatars] = useState({});
  const [members, setMembers] = useState([]);
  const [isTyping, setIsTyping] = useState(true);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTyping = () => {
    if (!isTyping) {
      socket.emit('startTyping', groupId);
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', groupId);
      setIsTyping(false);
    }, 1000);
  };

  const getAvatarUrl = (senderId) => {
    const member = data.users.members.find((m) => m.user.id === senderId);
    if (!member) return null;

    if (avatars[senderId]) {
      return avatars[senderId];
    }

    const avatarUrl = member.user.avatarUrl;

    if (avatarUrl) {
      setAvatars((prevAvatars) => ({
        ...prevAvatars,
        [senderId]: avatarUrl,
      }));
      return avatarUrl;
    }

    const defaultAvatars = [
      'https://www.svgrepo.com/show/420334/avatar-bad-breaking.svg',
      'https://www.svgrepo.com/show/420331/avatar-lazybones-sloth.svg',
      'https://www.svgrepo.com/show/420323/avatar-avocado-food.svg',
      'https://www.svgrepo.com/show/420343/avatar-joker-squad.svg',
      'https://www.svgrepo.com/show/420342/avatar-male-president.svg',
      'https://www.svgrepo.com/show/420345/fighter-luchador-man.svg',
      'https://www.svgrepo.com/show/420344/avatar-man-person.svg',
      'https://www.svgrepo.com/show/420315/avatar-cloud-crying.svg',
      'https://www.svgrepo.com/show/420358/friday-halloween-jason.svg',
      'https://www.svgrepo.com/show/420362/avatar-cacti-cactus.svg',
      'https://www.svgrepo.com/show/420353/avatar-male-ozzy.svg',
    ];

    const randomAvatar =
      defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    setAvatars((prevAvatars) => ({
      ...prevAvatars,
      [senderId]: randomAvatar,
    }));

    return randomAvatar;
  };

  const getPseudo = (senderId) => {
    const member = members.find((m) => m.user.id === senderId);
    return member ? member.user.pseudo : 'Unknown User';
  };

  const changePseudo = (userId, newPseudo) => {
    setMembers((prevMembers) => {
      return prevMembers.map((member) => {
        if (member.user.id === userId) {
          return {
            ...member,
            user: {
              ...member.user,
              pseudo: newPseudo,
            },
          };
        }
        return member;
      });
    });
  };

  useEffect(() => {
    if (data) {
      setMessages(data.messages);
      setActualContactPseudo(data.group.name);
      setMembers(data.users.members);
    }
  }, [data, setActualContactPseudo]);

  useEffect(() => {
    if (socket) {
      socket.emit('joinGroup', groupId);

      const handleIncomingGroupMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };
      const handleAvatarUpdated = (data) => {
        setAvatars((prevAvatars) => ({
          ...prevAvatars,
          [data.userId]: data.avatarUrl,
        }));
      };

      const handlePseudoChanged = (data) => {
        const { userId, pseudo } = data;
        changePseudo(userId, pseudo);
      };

      socket.on('avatarUpdated', handleAvatarUpdated);

      socket.on('pseudoChanged', handlePseudoChanged);

      socket.on('groupMessageReceived', handleIncomingGroupMessage);

      socket.on('startTyping', (typingUserId) => {
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          updated.add(typingUserId);
          return updated;
        });
      });

      socket.on('stopTyping', (typingUserId) => {
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(typingUserId);
          return updated;
        });
      });

      return () => {
        socket.emit('leaveGroup', groupId);
        socket.off('groupMessageReceived', handleIncomingGroupMessage);
        socket.off('startTyping');
        socket.off('stopTyping');
        socket.off('pseudoChanged', handlePseudoChanged);
      };
    }
  }, [socket, groupId]);

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
      socket.emit('sendGroupMessage', { groupId, message: newData.newMessage });
      setMessages((prevMessages) => [...prevMessages, newData.newMessage]);

      setInputMsg('');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occured...</div>;
  return (
    <>
      <div className="pt-11 min-w-[70%] flex flex-col items-center">
        <div
          ref={messagesEndRef}
          className=" h-[75%] overflow-auto absolute top-14 md:h-[80%] w-[90%] flex flex-col gap-2"
        >
          {messages.map((message) =>
            message.senderId === data.userId ? (
              message.file ? (
                <ChatResponseImg
                  key={message.id}
                  imgUrl={message.file.url}
                />
              ) : (
                <div key={message.id}>
                  <ChatResponse content={message.content} />
                </div>
              )
            ) : message.file ? (
              <div key={message.id}>
                <Avatar
                  avatarUrl={getAvatarUrl(message.senderId)}
                  status={'online'}
                />
                <ChatAnswerImg imgUrl={message.file.url} />
              </div>
            ) : (
              <div
                className="flex"
                key={message.id}
              >
                <Avatar
                  avatarUrl={getAvatarUrl(message.senderId)}
                  status={'online'}
                />
                <ChatAnswer
                  content={`${getPseudo(message.senderId)}: ${message.content}`}
                />
              </div>
            )
          )}
        </div>

        <ChatInput
          value={inputMsg}
          onChange={(e) => {
            setInputMsg(e.target.value);
            handleTyping();
          }}
          onSubmit={(e) => handlePostRequest(e)}
          receiverId={groupId}
          receiverPseudo={data.group.name}
          setMessages={setMessages}
          groupOrPm={data.group.isPublic ? 'group-public' : 'group-private'}
        />
        {typingUsers.size > 0 && (
          <div className="absolute bottom-20 self-center text-white">
            {typingUsers.size === 1
              ? `${getPseudo(Array.from(typingUsers)[0])} is typing...`
              : 'Some people are typing...'}
          </div>
        )}
      </div>
    </>
  );
}

GroupChat.propTypes = {
  groupId: PropTypes.string,
};
