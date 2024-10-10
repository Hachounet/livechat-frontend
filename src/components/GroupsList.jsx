import Group from './Group';
import { getAllGroupsUrl } from '../DevHub';
import { useChatContext } from '../ChatContext';
import { useEffect, useState } from 'react';
import PrivateGroupSvg from './PrivateGroupSvg';
export default function GroupsList() {
  const { groupsRefresh, setGroupsRefresh, token, setLogged } =
    useChatContext();

  const [groups, setGroups] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const getGroups = async () => {
      const response = await fetch(getAllGroupsUrl, {
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

        setGroups(data);

        setLoading(false);
      } else {
        const data = await response.json();
        setLoading(false);
        setErrors(data.message);
      }
    };

    getGroups();
  }, []);

  useEffect(() => {
    const getGroups = async () => {
      const response = await fetch(getAllGroupsUrl, {
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

        setGroups(data);
        setLoading(false);
      }
    };

    if (groupsRefresh) {
      setGroupsRefresh(false);
    }

    getGroups();
  }, [groupsRefresh]);

  if (loading) return <div>Loading...</div>;
  if (errors)
    return (
      <div className="text-xl flex justify-center items-center h-full">
        Error: An error occured. {errors.message}
      </div>
    );

  return (
    <ul className="flex flex-col gap-2 max-h-64 overflow-auto w-[250px]">
      <span className="self-center font-bold text-purple-300 text-xl">
        Groups
      </span>
      {groups.groupMemberships.map((group) => (
        <li
          key={group.group.id}
          className="flex justify-between items-center"
        >
          <div className="flex items-center w-full overflow-hidden justify-between">
            <Group
              name={group.group.name}
              groupId={group.group.id}
              className="truncate max-w-[200px]" // Limite la largeur du texte et applique l'overflow
            />
            <div className="flex">
              {!group.group.isPublic ? <PrivateGroupSvg /> : null}
              {groups.userId === group.group.ownerId ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.6872 14.0931L19.8706 12.3884C19.9684 11.4789 20.033 10.8783 19.9823 10.4999L20 10.5C20.8284 10.5 21.5 9.82843 21.5 9C21.5 8.17157 20.8284 7.5 20 7.5C19.1716 7.5 18.5 8.17157 18.5 9C18.5 9.37466 18.6374 9.71724 18.8645 9.98013C18.5384 10.1814 18.1122 10.606 17.4705 11.2451L17.4705 11.2451C16.9762 11.7375 16.729 11.9837 16.4533 12.0219C16.3005 12.043 16.1449 12.0213 16.0038 11.9592C15.7492 11.847 15.5794 11.5427 15.2399 10.934L13.4505 7.7254C13.241 7.34987 13.0657 7.03557 12.9077 6.78265C13.556 6.45187 14 5.77778 14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5C10 5.77778 10.444 6.45187 11.0923 6.78265C10.9343 7.03559 10.759 7.34984 10.5495 7.7254L8.76006 10.934C8.42056 11.5427 8.25081 11.847 7.99621 11.9592C7.85514 12.0213 7.69947 12.043 7.5467 12.0219C7.27097 11.9837 7.02381 11.7375 6.5295 11.2451C5.88787 10.606 5.46156 10.1814 5.13553 9.98012C5.36264 9.71724 5.5 9.37466 5.5 9C5.5 8.17157 4.82843 7.5 4 7.5C3.17157 7.5 2.5 8.17157 2.5 9C2.5 9.82843 3.17157 10.5 4 10.5L4.01771 10.4999C3.96702 10.8783 4.03162 11.4789 4.12945 12.3884L4.3128 14.0931C4.41458 15.0393 4.49921 15.9396 4.60287 16.75H19.3971C19.5008 15.9396 19.5854 15.0393 19.6872 14.0931Z"
                    fill="#FFC0CB"
                  />
                  <path
                    d="M10.9121 21H13.0879C15.9239 21 17.3418 21 18.2879 20.1532C18.7009 19.7835 18.9623 19.1172 19.151 18.25H4.84896C5.03765 19.1172 5.29913 19.7835 5.71208 20.1532C6.65817 21 8.07613 21 10.9121 21Z"
                    fill="#FFC0CB"
                  />
                </svg>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
