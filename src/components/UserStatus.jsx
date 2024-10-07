import Avatar from './Avatar';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSocketContext } from '../SocketContext';
import { useChatContext } from '../ChatContext';
import { updateUserStatusUrl } from '../DevHub';

export default function UserStatus({ pseudo, avatarUrl }) {
  const { userId, token, setLogged } = useChatContext();
  const [displaySelect, setDisplaySelect] = useState(false);
  const [selection, setSelection] = useState('online'); // Default to 'online'
  const { socket } = useSocketContext();

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'online' || newStatus === 'offline') {
      setSelection(newStatus);
      newStatus = newStatus.toUpperCase();

      const response = await fetch(`${updateUserStatusUrl}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, status: newStatus }),
      });

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        setLogged(false);
        window.location.href = '/';
        return;
      }

      if (response.ok) {
        if (socket) {
          socket.emit('statusChanged', { token: token, status: newStatus });
        }
        return;
      }
    }
  };
  const selectContent = (
    <select
      className="select select-ghost w-full max-w-xs"
      value={selection}
      onChange={(e) => {
        handleStatusChange(e.target.value);
        setDisplaySelect(false);
      }}
    >
      <option disabled>Actual status</option>
      <option value="online">Online</option>
      <option value="offline">Offline</option>
    </select>
  );

  return (
    <div className="flex flex-col">
      <button
        className="flex gap-2"
        onClick={() => setDisplaySelect((prev) => !prev)} // Afficher/Masquer le select
      >
        <Avatar
          avatarUrl={avatarUrl}
          status={selection} // Indicateur visuel du statut
        />
        <div className="flex items-center">
          <span className="text-xl md:text-2xl">{pseudo}</span>
        </div>
      </button>
      {displaySelect && selectContent}
    </div>
  );
}

UserStatus.propTypes = {
  pseudo: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
};
