import {
  getAllGroupsUrl,
  getGroupRequestsUrl,
  acceptInvitationGroupUrl,
  denyInvitationGroupUrl,
} from '../DevHub';
import { useChatContext } from '../ChatContext';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import PrivateGroupSvg from './PrivateGroupSvg';

export default function GroupHandler() {
  const [groups, setGroups] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const {
    token,
    setLogged,
    groupsRefresh,
    setGroupsRefresh,
    setActualContactPseudo,
  } = useChatContext();

  const [modalVisibility, setModalVisibility] = useState('hidden');
  const [modalContent, setModalContent] = useState(null);
  const [groupData, setGroupData] = useState({});
  const [groupRequests, setGroupRequests] = useState([]);

  const [groupId, setGroupId] = useState('');

  const handleVisibility = (event, content, groupName, groupId) => {
    event.preventDefault();
    setModalContent(content);
    setModalVisibility((prev) => (prev === 'hidden' ? '' : 'hidden'));
    setGroupData(groupName);
    setGroupId(groupId);
  };

  useEffect(() => {
    setErrors(null);
    const getGroupsAndGroupRequests = async () => {
      try {
        const groupsResponse = await fetch(getAllGroupsUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (groupsResponse.status === 401) {
          localStorage.removeItem('accessToken');
          setLogged(false);
          window.location.href = '/';
          return;
        }

        if (groupsResponse.ok) {
          const groupsData = await groupsResponse.json();
          setGroups(groupsData);
        }

        const requestsResponse = await fetch(getGroupRequestsUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (requestsResponse.status === 401) {
          localStorage.removeItem('accessToken');
          setLogged(false);
          window.location.href = '/';
          return;
        }

        if (requestsResponse.ok) {
          const friendsData = await requestsResponse.json();
          setGroupRequests(friendsData);
        }
      } catch (error) {
        setErrors(`An error occurred while fetching data:  ${error.message}`);
      } finally {
        setLoading(false);
        setActualContactPseudo('Groups settings');
      }
    };

    getGroupsAndGroupRequests();
  }, []);

  useEffect(() => {
    setErrors(null);
    setLoading(true);

    const getGroupsAndGroupRequests = async () => {
      try {
        const groupsResponse = await fetch(getAllGroupsUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (groupsResponse.status === 401) {
          localStorage.removeItem('accessToken');
          setLogged(false);
          window.location.href = '/';
          return;
        }

        if (groupsResponse.ok) {
          const groupsData = await groupsResponse.json();
          setGroups(groupsData);
        }

        const requestsResponse = await fetch(getGroupRequestsUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (requestsResponse.status === 401) {
          localStorage.removeItem('accessToken');
          setLogged(false);
          window.location.href = '/';
          return;
        }

        if (requestsResponse.ok) {
          const friendsData = await requestsResponse.json();
          setGroupRequests(friendsData);
        }
      } catch (error) {
        setErrors(`An error occurred while fetching data:  ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (groupsRefresh) {
      setGroupsRefresh(false);
    }

    getGroupsAndGroupRequests();
  }, [groupsRefresh]);

  const handleJoinGroup = async (e, groupId) => {
    e.preventDefault();

    const response = await fetch(`${acceptInvitationGroupUrl}/${groupId}`, {
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
      setGroupsRefresh(true);
    }
  };

  const handleDenyGroup = async (e, groupId) => {
    e.preventDefault();

    const response = await fetch(`${denyInvitationGroupUrl}/${groupId}`, {
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
      setGroupRequests((prevRequests) => ({
        ...prevRequests,
        groupRequests: prevRequests.groupRequests.filter(
          (request) => request.group.id !== groupId
        ),
      }));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (errors)
    return (
      <div className="text-xl flex justify-center items-center h-full">
        Error: An error occured. {errors.message}
      </div>
    );

  return (
    <>
      <div className="flex flex-col items-center pt-11 gap-10 min-w-[90%]">
        <Modal
          modalVisibility={modalVisibility}
          setModalVisibility={handleVisibility}
          modalContent={modalContent}
          groupData={groupData}
          setGroupData={setGroupData}
          groupId={groupId}
        />
        <h1 className="text-4xl text-pink-300">Groups</h1>

        <div className="flex flex-col  justify-center">
          <div className="flex flex-col items-center ">
            <span className="text-2xl text-pink-200">Your groups</span>
            <ul className="flex flex-col gap-1 items-center min-w-[90%]">
              {groups.groupMemberships.map((group) =>
                group.group.ownerId === groups.userId ? (
                  <li
                    className="flex gap-2 min-w-[100%] justify-between flex-col md:flex-row "
                    key={group.group.id}
                  >
                    <span className="font-bold flex items-center gap-1 justify-center">
                      {group.group.name}{' '}
                      {!group.group.isPublic ? <PrivateGroupSvg /> : null}
                    </span>
                    <div className="flex gap-1 items-center justify-center">
                      {!group.group.isPublic ? (
                        <button
                          onClick={(e) =>
                            handleVisibility(
                              e,
                              'inviteContent',
                              group.group.name,
                              group.group.id
                            )
                          }
                          className="btn btn-outline btn-accent btn-xs md:btn-md"
                        >
                          Invite
                        </button>
                      ) : null}

                      <button
                        className="btn btn-outline btn-xs md:btn-md"
                        onClick={(e) =>
                          handleVisibility(
                            e,
                            'settingsContent',
                            group.group.name,
                            group.group.id
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline btn-xs md:btn-md btn-error"
                        onClick={(e) =>
                          handleVisibility(
                            e,
                            'deleteContent',
                            group.group.name,
                            group.group.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ) : null
              )}
            </ul>
            <button
              className="btn btn-outline btn-success btn-xs m-2 md:btn-md"
              onClick={(e) => handleVisibility(e, 'createGroupContent')}
            >
              Create group
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl text-pink-200 ">Other groups</span>
            <ul className="flex flex-col gap-1 items-center min-w-[90%]">
              {groups.groupMemberships.map((group) =>
                group.group.ownerId !== groups.userId ? (
                  <li
                    className="flex gap-2 min-w-[100%] justify-between flex-col md:flex-row "
                    key={group.group.id}
                  >
                    <span className="font-bold flex items-center gap-1 justify-center">
                      {group.group.name}
                    </span>
                    <button
                      className="btn-error btn btn-outline btn-xs md:btn-md"
                      onClick={(e) =>
                        handleVisibility(
                          e,
                          'othersGroups',
                          group.group.name,
                          group.group.id
                        )
                      }
                      type="button"
                    >
                      Leave
                    </button>{' '}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl text-pink-200 ">
              Invitations received
            </span>
            <ul className="flex flex-col gap-1">
              {groupRequests.groupRequests.map((groupRequest) =>
                groupRequest.status === 'PENDING' ? (
                  <li
                    className="list-none flex items-center flex-col gap-2 md:flex-row"
                    key={groupRequest.group.id}
                  >
                    <span className="font-bold">{groupRequest.group.name}</span>
                    <button
                      className="btn btn-outline btn-xs md:btn-md"
                      onClick={(e) => handleJoinGroup(e, groupRequest.group.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-outline btn-xs md:btn-md"
                      onClick={(e) => handleDenyGroup(e, groupRequest.group.id)}
                    >
                      Deny
                    </button>{' '}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
