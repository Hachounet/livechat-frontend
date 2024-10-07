import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Avatar({ avatarUrl, status }) {
  status = status.toLowerCase();

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

  const randomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
    return defaultAvatars[randomIndex];
  };

  const [selectedAvatar, setSelectedAvatar] = useState('');

  useEffect(() => {
    if (!avatarUrl) {
      setSelectedAvatar(randomAvatar());
    }
  }, [avatarUrl]);

  return (
    <div className={`avatar ${status}`}>
      {' '}
      {/* Use status for styling */}
      <div className={`w-16 rounded-full ${status}`}>
        <img
          src={avatarUrl || selectedAvatar}
          alt="User Avatar"
        />
      </div>
    </div>
  );
}

Avatar.propTypes = {
  avatarUrl: PropTypes.string,
  status: PropTypes.string,
};
