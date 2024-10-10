import IndividualFriend from './IndividualFriend';

import { friendsListURL } from '../DevHub';
import { useChatContext } from '../ChatContext';
import { useEffect, useState } from 'react';
import { useSocketContext } from '../SocketContext';
export default function FriendsList() {
  const { friendsRefresh, token, setLogged } = useChatContext();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [selectedFriendId, setSelectedFriendId] = useState(null); // To check where user is focus
  const [newMessages, setNewMessages] = useState(new Set()); // To display new messages unfocused
  const { socket } = useSocketContext();

  useEffect(() => {
    if (socket) {
      const handleStatusChanged = (data) => {
        // Update friend status
        setFriends((prevFriends) => {
          if (prevFriends && prevFriends.friends) {
            return {
              ...prevFriends,
              friends: prevFriends.friends.map((friend) =>
                friend.id === data.userId
                  ? { ...friend, status: data.status }
                  : friend
              ),
            };
          }
          return prevFriends;
        });
      };

      const handleIncomingMessage = (newMessage) => {
        // Check if new msg come from friend who is not currently selected
        if (newMessage.senderId !== selectedFriendId) {
          setNewMessages((prev) => new Set(prev).add(newMessage.senderId));
        } else {
          setNewMessages((prev) => {
            const updatedSet = new Set(prev);
            updatedSet.delete(newMessage.senderId);
            return updatedSet;
          });
        }
      };

      const handleAvatarUpdated = (data) => {
        setFriends((prevFriends) => {
          if (prevFriends && prevFriends.friends) {
            return {
              ...prevFriends,
              friends: prevFriends.friends.map((friend) =>
                friend.id === data.userId
                  ? { ...friend, avatarUrl: data.avatarUrl }
                  : friend
              ),
            };
          }
          return prevFriends;
        });
      };

      const handlePseudoChanged = (data) => {
        setFriends((prevFriends) => {
          if (prevFriends && prevFriends.friends) {
            return {
              ...prevFriends,
              friends: prevFriends.friends.map((friend) =>
                friend.id === data.userId
                  ? { ...friend, pseudo: data.pseudo }
                  : friend
              ),
            };
          }
        });
      };

      const handleDeleteFriend = (data) => {
        setFriends((prevFriends) => {
          if (prevFriends && prevFriends.friends) {
            return {
              ...prevFriends,
              friends: prevFriends.friends.filter(
                (friend) => friend.id !== data.userId
              ),
            };
          }
          return prevFriends;
        });
      };

      const handleAddFriend = (data) => {
        setFriends((prevFriends) => {
          if (prevFriends && prevFriends.friends) {
            return {
              ...prevFriends,
              friends: [...prevFriends.friends, data.newFriend],
            };
          }

          return { ...prevFriends, friends: [data.newFriend] };
        });
      };

      socket.on('friendAdded', handleAddFriend);

      socket.on('friendDeleted', handleDeleteFriend);

      socket.on('privateMessageReceived', handleIncomingMessage);

      socket.on('statusChanged', handleStatusChanged);

      socket.on('avatarUpdated', handleAvatarUpdated);

      socket.on('pseudoChanged', handlePseudoChanged);

      return () => {
        socket.off('statusChanged', handleStatusChanged);
        socket.off('avatarUpdated', handleAvatarUpdated);
        socket.off('privateMessageReceived', handleIncomingMessage);
        socket.off('friendDeleted', handleDeleteFriend);
        socket.off('friendAdded', handleAddFriend);
      };
    }
  }, [socket, selectedFriendId]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await fetch(`${friendsListURL}/${null}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          setLogged(false);
          window.location.href = '/';
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setFriends(data);
        } else {
          const data = await response.json();
          setErrors(data.message || 'An unexpected error occurred.');
        }
      } catch (error) {
        setErrors(`Failed to fetch friends list. ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    getFriends();
  }, [friendsRefresh, setLogged, token]);

  if (loading) return <div>Loading...</div>;
  if (errors)
    return (
      <div className="text-xl flex justify-center items-center h-full">
        Error: An error occured. {errors.message}
      </div>
    );

  return (
    <ul className="flex flex-col gap-2 overflow-auto max-h-60">
      <span
        className={`self-center font-bold  text-xl ${newMessages.size > 0 ? 'text-pink-300 underline' : 'text-purple-300'}`}
      >
        Friends {newMessages.size > 0 ? `(New msg)` : ''}
      </span>
      {friends.friends.map((friend) => (
        <li key={friend.id}>
          <IndividualFriend
            pseudo={friend.pseudo}
            avatarUrl={friend.avatarUrl}
            contactId={friend.id}
            status={friend.status}
            isBold={newMessages.has(friend.id)}
            onClickSwitchSelectedFriend={() => {
              setSelectedFriendId(friend.id);
              setNewMessages((prevNewMessages) => {
                const updatedSet = new Set(prevNewMessages);
                updatedSet.delete(friend.id);
                return updatedSet;
              });
            }}
          />
        </li>
      ))}
    </ul>
  );
}
