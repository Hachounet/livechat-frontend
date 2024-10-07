import IndividualFriend from './IndividualFriend';
import useAuth from '../hooks/authFetch';
import { useChatContext } from '../ChatContext';
import { getFriendsRequestURL } from '../DevHub';
import {
  filterPendingFriendRequests,
  filterNowAcceptedFriendRequest,
  filterNowDenyedFriendRequest,
} from '../helpers/modifyUsersData';
import { friendsRequestURL } from '../DevHub';
import { useEffect, useState } from 'react';
export default function FriendsRequest() {
  const { token, setLogged, setFriendsRefresh } = useChatContext();
  const { data, loading, error } = useAuth(getFriendsRequestURL);
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    if (data) {
      const filtered = filterPendingFriendRequests(data);
      setFilteredData(filtered);
      console.log(data);
      console.log(filteredData);
    }
  }, [data]);

  console.log(filteredData);
  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-xl flex justify-center items-center h-full">
        Error: An error occured. {error.message}
      </div>
    );

  if (!filteredData || filteredData.friendsRequests.length === 0) {
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
      setFriendsRefresh(true);
    } else {
      console.error('Error accepting friend request');
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
      console.error('Error denying friend request');
    }
  };

  return (
    <div className="self-center min-h-[100%] max-h-[100vh] flex flex-col items-center pt-11 gap-10">
      <span className="text-2xl text-pink-300">Friends Requests</span>
      <ul>
        {filteredData.friendsRequests.map((friend) => (
          <li
            key={friend.id}
            className="flex gap-4 items-center pt-2 pb-2"
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
  );
}
