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

      socket.on('statusChanged', handleStatusChanged);

      return () => {
        socket.off('statusChanged', handleStatusChanged);
      };
    }
  }, [socket]);

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

  useEffect(() => {
    getFriends();
  }, [friendsRefresh]);

  if (loading) return <div>Loading...</div>;
  if (errors)
    return (
      <div className="text-xl flex justify-center items-center h-full">
        Error: An error occured. {errors.message}
      </div>
    );

  return (
    <ul className="flex flex-col gap-2 overflow-auto max-h-64">
      <span className="self-center font-bold text-purple-300 text-xl">
        Friends
      </span>
      {friends.friends.map((friend) => (
        <li key={friend.id}>
          <IndividualFriend
            pseudo={friend.pseudo}
            avatarUrl={friend.avatarUrl}
            contactId={friend.id}
            status={friend.status}
          />
        </li>
      ))}
    </ul>
  );
}
