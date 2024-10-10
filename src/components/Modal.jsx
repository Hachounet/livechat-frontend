import { useEffect, useState } from 'react';
import {
  createNewGroupUrl,
  updateGroupUrl,
  deleteGroupUrl,
  leaveGroupUrl,
  friendsListURL,
  inviteGroupUrl,
  postCancelInvitationsUrl,
  excludeGroupMemberUrl,
} from '../DevHub';
import { useChatContext } from '../ChatContext';
import PropTypes from 'prop-types';

export default function Modal({
  modalVisibility = 'hidden',
  setModalVisibility = () => {},
  modalContent = null,
  groupData = {},
  setGroupData = () => {},
  groupId = '',
}) {
  const [friends, setFriends] = useState([]); // Only for inviteContent
  const [loading, setLoading] = useState(true); // Only for inviteContent
  const [errorsMessages, setErrorsMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const { token, setLogged, setGroupsRefresh } = useChatContext();

  useEffect(() => {
    setErrorsMessages([]);
    const getFriends = async () => {
      setLoading(true);
      const response = await fetch(`${friendsListURL}/${groupId}`, {
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
        setLoading(false);
      } else {
        setErrorsMessages(['Failed to fetch friends list.']);
      }
    };

    if (modalContent === 'inviteContent') {
      getFriends();
    }
  }, [modalContent, groupId, setLogged, token]);

  const createGroupContent = (
    <>
      <h1 className="text-2xl text-pink-300 self-center">Create group</h1>
      <form
        onSubmit={(e) => handleCreateGroupSubmit(e)}
        action=""
        className="flex gap-2 flex-col items-center pt-2"
      >
        <input
          name="groupname"
          type="text"
          placeholder="Group name"
          className="input input-bordered input-primary w-[90%] max-w-xs"
        />
        <select
          name="choice"
          className="select select-primary w-[90%] max-w-xs"
        >
          <option value={true}>Public group</option>
          <option value={false}>Private group</option>
        </select>
        <button
          type="submit"
          className="btn btn-success btn-outline"
        >
          Create group
        </button>
      </form>
    </>
  );

  const inviteContent = (
    <>
      <h1 className="text-2xl text-pink-300 self-center">Invite user</h1>

      <form className="flex gap-2 flex-col items-center pt-2">
        <input
          name="groupname"
          type="text"
          placeholder="Group name"
          className="input input-bordered input-primary w-[90%] max-w-xs"
          value={groupData}
          disabled
        />

        {loading ? (
          <div>Loading friends...</div>
        ) : (
          <ul className="overflow-auto max-h-32 w-[100%] flex flex-col gap-2">
            {friends.friends.length > 0 ? (
              friends.friends.map((friend) => (
                <li
                  className="flex justify-between items-center"
                  key={friend.id}
                >
                  <span>{friend.pseudo}</span>

                  {friend.groupRequests.length > 0 ? (
                    friend.groupRequests[0].status === 'PENDING' ? (
                      <button
                        className="btn btn-outline btn-warning"
                        onClick={(e) => handleCancelInvite(e, friend.id)}
                      >
                        Cancel Invite
                      </button>
                    ) : (
                      friend.groupRequests[0].status === 'ACCEPTED' && (
                        <button
                          className="btn btn-outline btn-error"
                          onClick={(e) => handleExcludeUser(e, friend.id)}
                        >
                          Exclude
                        </button>
                      )
                    )
                  ) : (
                    <button
                      className="btn btn-outline btn-success"
                      onClick={(e) => handleInviteSubmit(e, friend.id)}
                      value={friend.id}
                    >
                      Invite
                    </button>
                  )}
                </li>
              ))
            ) : (
              <li>No friends found.</li>
            )}
          </ul>
        )}
      </form>
    </>
  );

  const settingsContent = (
    <>
      <h1 className="text-2xl text-pink-300 self-center">Update group</h1>
      <form
        onSubmit={(e) => handleUpdateGroupSubmit(e)}
        action=""
        className="flex gap-2 flex-col items-center pt-2"
      >
        <input
          name="groupname"
          type="text"
          placeholder="Group name"
          className="input input-bordered input-primary w-[90%] max-w-xs"
          value={groupData}
          onChange={(e) => setGroupData(e.target.value)}
        />
        <select
          name="choice"
          className="select select-primary w-[90%] max-w-xs"
        >
          <option value={true}>Public group</option>
          <option value={false}>Private group</option>
        </select>
        <button
          type="submit"
          className="btn btn-success btn-outline"
        >
          Update group
        </button>
      </form>
    </>
  );

  const deleteContent = (
    <>
      <h1 className="text-2xl text-pink-300 self-center">Delete group</h1>
      <div className="flex gap-2 flex-col items-center pt-8 min-h-[100%] justify-center">
        <button
          type="button"
          onClick={(e) => handleDeleteGroupSubmit(e)}
          className="btn btn-error btn-outline"
        >
          Yes, delete this group
        </button>
      </div>
    </>
  );

  const othersGroupsSettingsContent = (
    <>
      <h1 className="text-2xl text-pink-300 self-center">Leave group</h1>
      <div className="flex gap-2 flex-col items-center pt-8 min-h-[100%] justify-center">
        <button
          type="button"
          onClick={(e) => handleLeaveGroupSubmit(e)}
          className="btn btn-error btn-outline"
        >
          Yes, leave this group
        </button>
      </div>
    </>
  );

  const handleInviteSubmit = async (e, friendId) => {
    e.preventDefault();
    setErrorsMessages([]);
    setSuccessMessage('');

    const response = await fetch(`${inviteGroupUrl}/${groupId}/${friendId}`, {
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
    if (response.status === 400 || response.status === 403) {
      const data = await response.json();
      const err = [data.message];

      setErrorsMessages((prev) => [...prev, err]);
    }
    if (response.ok) {
      const data = await response.json();
      setSuccessMessage(data.message);
      setFriends((prevState) => ({
        ...prevState,
        friends: prevState.friends.map((friend) =>
          friend.id === friendId
            ? {
                ...friend,
                groupRequests: [{ status: 'PENDING' }],
              }
            : friend
        ),
      }));
    }
  };

  const handleExcludeUser = async (e, friendId) => {
    e.preventDefault();
    setErrorsMessages([]);
    setSuccessMessage('');

    const response = await fetch(
      `${excludeGroupMemberUrl}/${groupId}/${friendId}`,
      {
        method: 'POST',
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
    if (response.status === 400 || response.status === 403) {
      const data = await response.json();
      const err = [data.message];

      setErrorsMessages((prev) => [...prev, err]);
    }
    if (response.ok) {
      const data = await response.json();
      setSuccessMessage(data.message);

      setFriends((prevState) => ({
        ...prevState,
        friends: prevState.friends.map((friend) =>
          friend.id === friendId
            ? {
                ...friend,
                groupRequests: [],
              }
            : friend
        ),
      }));
    }
  };

  const handleLeaveGroupSubmit = async (e) => {
    e.preventDefault();
    setErrorsMessages([]);

    const response = await fetch(`${leaveGroupUrl}/${groupId}`, {
      method: 'DELETE',
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

    if (response.status === 400 && !response.ok) {
      const data = await response.json();
      const err = [data.message];

      setErrorsMessages((prev) => [...prev, err]);
    }

    if (response.ok) {
      const data = await response.json();
      setSuccessMessage(data.message);
      setGroupsRefresh(true);
    }
  };

  const handleCancelInvite = async (e, friendId) => {
    e.preventDefault();
    setErrorsMessages([]);
    setSuccessMessage('');

    const response = await fetch(
      `${postCancelInvitationsUrl}/${groupId}/${friendId}`,
      {
        method: 'POST',
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
    if (response.status === 404) {
      const data = await response.json();
      const err = [data.message];

      setErrorsMessages((prev) => [...prev, err]);
    }
    if (response.ok) {
      const data = await response.json();
      setSuccessMessage(data.message);
      setFriends((prevState) => ({
        ...prevState,
        friends: prevState.friends.map((friend) =>
          friend.id === friendId
            ? {
                ...friend,
                groupRequests: [],
              }
            : friend
        ),
      }));
    }
  };

  const handleDeleteGroupSubmit = async (e) => {
    e.preventDefault();
    setErrorsMessages([]);

    const response = await fetch(`${deleteGroupUrl}/${groupId}`, {
      method: 'DELETE',
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

    if (response.status === 400 && !response.ok) {
      const data = await response.json();
      const err = [data.message];

      setErrorsMessages((prev) => [...prev, err]);
    }

    if (response.ok) {
      const data = await response.json();
      setSuccessMessage(data.message);
      setGroupsRefresh(true);
    }
  };

  const handleUpdateGroupSubmit = async (e) => {
    e.preventDefault();
    const choice = JSON.parse(e.target.choice.value);
    const groupName = e.target.groupname.value;

    setErrorsMessages([]);

    if (groupName === '' || groupName.trim().length <= 3) {
      const errGroupName =
        'New group name cannot be empty or less than 3 characters.';
      setErrorsMessages((prev) => [...prev, errGroupName]);
      return;
    }

    const response = await fetch(`${updateGroupUrl}/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isPublic: choice, groupName }),
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      setLogged(false);
      window.location.href = '/';
      return;
    }

    if (response.status === 400 && !response.ok) {
      const data = await response.json();
      const err = [data.message];

      setErrorsMessages((prev) => [...prev, err]);
    }

    if (response.ok) {
      const data = await response.json();
      setSuccessMessage(data.message);
      setGroupsRefresh(true);
    }
  };

  const handleCreateGroupSubmit = async (e) => {
    e.preventDefault();
    const choice = JSON.parse(e.target.choice.value);
    const groupName = e.target.groupname.value;

    setErrorsMessages([]);

    if (groupName.trim().length < 3 || groupName.trim().length > 20) {
      const errGroupName = 'Group name must be between 3 and 20 characters.';
      setErrorsMessages((prev) => [...prev, errGroupName]);
      return;
    }

    const response = await fetch(`${createNewGroupUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isPublic: choice, groupName }),
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      setLogged(false);
      window.location.href = '/';
      return;
    }

    if (response.status === 400 && !response.ok) {
      const data = await response.json();
      const err = [data.message];

      setErrorsMessages((prev) => [...prev, err]);
    }

    if (response.ok) {
      const data = await response.json();
      setSuccessMessage(data.message);
      setGroupsRefresh(true);
    }
  };

  return (
    <div
      className={`${modalVisibility} custom-glassmorphism-bg min-w-[90vw] md:min-w-[30%] pl-4 pr-4 h-[300px] rounded-2xl absolute flex flex-col mt-2 md:mt-0`}
    >
      <div className="min-w-[100%] flex justify-end ">
        <button
          className="btn btn-square btn-xs md:btn-md btn-outline mt-2 md:mt-2 md:mr-0 "
          onClick={(e) => [
            setErrorsMessages([]),
            setSuccessMessage(''),
            setModalVisibility(e, null),
          ]}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col">
        {modalContent === 'settingsContent'
          ? settingsContent
          : modalContent === 'createGroupContent'
            ? createGroupContent
            : modalContent === 'othersGroups'
              ? othersGroupsSettingsContent
              : modalContent === 'deleteContent'
                ? deleteContent
                : modalContent === 'inviteContent'
                  ? inviteContent
                  : null}
        {successMessage !== '' ? (
          <span className=" text-green-400 self-center text-xs">
            {successMessage}
          </span>
        ) : null}
        {errorsMessages.map((error, index) => (
          <span
            key={index}
            className=" text-red-500 self-center"
          >
            {error}
          </span>
        ))}
      </div>
    </div>
  );
}

Modal.propTypes = {
  modalVisibility: PropTypes.string.isRequired,
  setModalVisibility: PropTypes.func.isRequired,
  groupId: PropTypes.string,
  modalContent: PropTypes.string,
  groupData: PropTypes.object,
  setGroupData: PropTypes.func,
};
