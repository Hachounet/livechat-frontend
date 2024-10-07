import SearchInput from './SearchInput';
import { useEffect, useState } from 'react';
import {
  postSearchUrl,
  friendsRequestURL,
  getFriendsRequestURL,
  joinGroupUrl,
} from '../DevHub';
import { useChatContext } from '../ChatContext';
import IndividualFriend from './IndividualFriend';
import { modifyUsersData } from '../helpers/modifyUsersData';
import { modifyGroupsData } from '../helpers/modifyGroupsData';

export default function Search() {
  const { token, setLogged, setGroupsRefresh } = useChatContext();
  const [selection, setSelection] = useState('/users');
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [requests, setRequests] = useState([]);

  const handleSelectChange = (event) => {
    setSelection(event.target.value);
  };

  const handlePostRequest = async (event, userId) => {
    event.preventDefault();
    const response = await fetch(`${friendsRequestURL}/${userId}`, {
      method: 'POST',
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
      const updatedData = data.users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            userAlreadySendRequest: true,
          };
        }
        return user;
      });
      setData({ ...data, users: updatedData });
    }
  };

  const handleAcceptFriend = async (event, userId) => {
    event.preventDefault();
    const choice = true;
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
      const updatedData = data.users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            userAlreadySendRequest: true,
          };
        }
        return user;
      });
      setData({ ...data, users: updatedData });
    }
  };

  const handleDenyFriend = async (event, userId) => {
    event.preventDefault();
    const choice = false;
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
      const updatedData = data.users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            userRequestPending: false,
          };
        }
        return user;
      });
      setData({ ...data, users: updatedData });
    } else {
      return;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let newRequests = null;

    if (selection === '/users') {
      const friendsRequestsResponse = await fetch(`${getFriendsRequestURL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (friendsRequestsResponse.status === 401) {
        localStorage.removeItem('accessToken');
        setLogged(false);
        window.location.href = '/';
        return;
      }

      if (friendsRequestsResponse.ok) {
        newRequests = await friendsRequestsResponse.json();
        setRequests(newRequests);
      }
    }

    const response = await fetch(
      `${postSearchUrl}${selection}?query=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      setLogged(false);
      window.location.href = '/';
      return;
    }

    if (response.ok) {
      const newData = await response.json();

      if (selection === '/users') {
        const modifiedUsers = modifyUsersData(
          newData.users,
          newRequests.friendsRequests,
          newData.userId
        );
        setData({ ...newData, users: modifiedUsers });
      } else if (selection === '/groups') {
        const modifiedGroups = modifyGroupsData(
          newData.groups,
          newData.userInfo.groupMemberships,
          newData.userId
        );

        setData({ ...newData, groups: modifiedGroups });
      }
    }
  };

  const handleJoinGroup = async (event, groupId) => {
    event.preventDefault();

    const response = await fetch(`${joinGroupUrl}/${groupId}`, {
      method: 'POST',
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
      const newData = await response.json();
      setGroupsRefresh(true);
      setData((prevData) => {
        const updatedGroups = prevData.groups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,

              memberships: [
                ...(group.memberships || []),
                newData.newMembership,
              ],
              canJoin: false,
              isMember: true,
            };
          }

          return group;
        });
        return { ...prevData, groups: updatedGroups };
      });
    }
  };

  return (
    <div className="self-center flex flex-col gap-4 absolute top-16">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-2 w-[80%] md:w-auto self-center"
      >
        <select
          onChange={handleSelectChange}
          className="select select-primary w-full"
        >
          <option value="/users">Users</option>
          <option value="/groups">Groups</option>
        </select>
        <SearchInput
          query={query}
          setQuery={setQuery}
        />
        <button
          type="submit"
          className="btn btn-ghost max-w-[50%] self-center"
        >
          Search
        </button>
      </form>

      <div className="flex justify-center">
        {data &&
        selection === '/users' &&
        data.users &&
        data.users.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {data.users.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-2 flex-col md:flex-row"
              >
                <IndividualFriend
                  avatarUrl={user.avatarUrl}
                  pseudo={user.pseudo}
                  contactId={user.id}
                />
                {user.userFriend ? (
                  <button
                    className="btn btn-disabled"
                    tabIndex="-1"
                    aria-disabled="true"
                  >
                    Already friend
                  </button>
                ) : user.userAlreadySendRequest ? (
                  <button
                    className="btn btn-disabled"
                    tabIndex="-1"
                    aria-disabled="true"
                  >
                    Already sent request
                  </button>
                ) : user.userRequestPending ? (
                  <>
                    <button
                      onClick={(event) => handleAcceptFriend(event, user.id)}
                      className="btn btn-outline btn-success"
                    >
                      Accept
                    </button>
                    <button
                      onClick={(event) => handleDenyFriend(event, user.id)}
                      className="btn btn-outline btn-warning"
                    >
                      Deny
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-outline btn-success"
                    onClick={(event) => handlePostRequest(event, user.id)}
                  >
                    Add friend
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : data &&
          selection === '/groups' &&
          data.groups &&
          data.groups.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {data.groups.map((group) =>
              group.isPublic ? (
                <li
                  key={group.id}
                  className="flex items-center gap-2 flex-col md:flex-row justify-between"
                >
                  <span className=" font-bold">{group.name}</span>
                  {group.canJoin ? (
                    <button
                      className="btn btn-outline btn-success"
                      onClick={(event) => handleJoinGroup(event, group.id)}
                    >
                      Join Group
                    </button>
                  ) : group.isOwnedByUser ? (
                    <button
                      className="btn btn-outline "
                      disabled
                    >
                      Admin
                    </button>
                  ) : group.isMember ? (
                    <button
                      className="btn btn-outline "
                      disabled
                    >
                      Already member
                    </button>
                  ) : null}
                </li>
              ) : null
            )}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}
