import IndividualFriend from './IndividualFriend';
import useAuth from '../hooks/authFetch';
import { useChatContext } from '../ChatContext';
import { getFriendsRequestURL, friendsListURL } from '../DevHub';
import {
  filterPendingFriendRequests,
  filterNowAcceptedFriendRequest,
  filterNowDenyedFriendRequest,
} from '../helpers/modifyUsersData';
import { friendsRequestURL, deleteFriendUrl } from '../DevHub';
import { useEffect, useState } from 'react';
import { useSocketContext } from '../SocketContext';
export default function FriendsRequest() {
  const {
    token,
    setLogged,
    setFriendsRefresh,
    friendsRefresh,
    setActualContactPseudo,
  } = useChatContext();
  const { socket } = useSocketContext();
  const { data, loading, error } = useAuth(getFriendsRequestURL);
  const [filteredData, setFilteredData] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendsErrors, setFriendsErrors] = useState(null);

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
          setActualContactPseudo('Friends');
        } else {
          const data = await response.json();

          setFriendsErrors(data.message || 'An unexpected error occurred.');
        }
      } catch (error) {
        setFriendsErrors(`Failed to fetch friends list. ${error.message}`);
      }
    };

    getFriends();
  }, [friendsRefresh, setLogged, token, setActualContactPseudo]);

  useEffect(() => {
    if (data) {
      const filtered = filterPendingFriendRequests(data);
      setFilteredData(filtered);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-xl flex justify-center items-center h-full">
        Error: An error occured. {error.message}
      </div>
    );

  if (!filteredData) {
    return (
      <div className="text-xl flex justify-center items-center h-full">
        No pending friend requests.
      </div>
    );
  }
  const handleAcceptFriend = async (event, userId) => {
    const choice = JSON.parse(event.target.value);
    const response = await fetch(`${friendsRequestURL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ choice }),
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      setLogged(false);
      window.location.href = '/';
      return;
    }

    if (response.ok) {
      const updatedData = filterNowAcceptedFriendRequest(data, userId);
      const filteredPendingRequests = filterPendingFriendRequests(updatedData);
      setFilteredData(filteredPendingRequests);
      setFriendsRefresh((prevState) => !prevState);
      socket.emit('addFriend', { addedFriendId: userId });
    } else {
      return; // WIP error
    }
  };

  const handleDenyFriend = async (event, userId) => {
    const choice = JSON.parse(event.target.value);

    const response = await fetch(`${friendsRequestURL}/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ choice }),
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      setLogged(false);
      window.location.href = '/';
      return;
    }

    if (response.ok) {
      const updatedData = filterNowDenyedFriendRequest(data, userId);
      const filteredPendingRequests = filterPendingFriendRequests(updatedData);
      setFilteredData(filteredPendingRequests);
    } else {
      return; // WIP ERROR
    }
  };

  const handleDeleteFriend = async (event, friendId) => {
    event.preventDefault();
    setFriendsErrors(null);

    const response = await fetch(`${deleteFriendUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendId }),
    });
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      setLogged(false);
      window.location.href = '/';
      return;
    }

    if (response.ok) {
      setFriends((prevFriends) => {
        return {
          ...prevFriends,
          friends: prevFriends.friends.filter(
            (friend) => friend.id !== friendId
          ),
        };
      });
      socket.emit('deleteFriend', { deletedFriendId: friendId });
      setFriendsRefresh((prevState) => !prevState);
    } else {
      setFriendsErrors('Error occured.');
      setFriendsRefresh((prevState) => !prevState);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-around w-[100%]  ">
      <div className=" min-h-fit lg:min-h-[50%] max-h-[88%] overflow-auto lg:pt-11 flex flex-col items-center gap-10">
        <span className="text-2xl text-pink-300">Friends Requests</span>
        <ul>
          {filteredData.friendsRequests.map((friend) => (
            <li
              key={friend.id}
              className="flex gap-4 items-center pt-2 pb-2 "
            >
              <IndividualFriend
                avatarUrl={friend.sender.avatarUrl}
                pseudo={friend.sender.pseudo}
                contactId={friend.id}
              />
              <button
                onClick={(e) => handleAcceptFriend(e, friend.senderId)}
                className="btn btn-outline btn-success"
                value={true}
              >
                Accept
              </button>
              <button
                onClick={(e) => handleDenyFriend(e, friend.senderId)}
                className="btn btn-outline btn-error"
                value={false}
              >
                Deny
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className=" min-h-[50%] max-h-[88%] overflow-auto flex flex-col items-center pt-11 gap-10">
        <span className="text-2xl text-pink-300">Friends List</span>
        <ul>
          {friends && friends.friends ? (
            friends.friends.map((friend) => (
              <li
                key={friend.id}
                className="flex gap-4 items-center pt-2 pb-2 justify-between"
              >
                <IndividualFriend
                  pseudo={friend.pseudo}
                  avatarUrl={friend.avatarUrl}
                  contactId={friend.id}
                />
                <button
                  onClick={(e) => handleDeleteFriend(e, friend.id)}
                  className="btn btn-outline btn-error"
                >
                  Delete friend
                </button>
              </li>
            ))
          ) : (
            <div>No friends available.</div> // Gestion de l'absence d'amis
          )}
          {friendsErrors && <div>{friendsErrors}</div>}
        </ul>
      </div>
    </div>
  );
}
