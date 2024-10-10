import PropTypes from 'prop-types';

export default function Avatar({ avatarUrl, status = '' }) {
  if (status !== '') {
    status = status.toLowerCase();
  }

  return (
    <div className={`avatar ${status}`}>
      {' '}
      {/* Use status for styling */}
      <div className={`w-16 rounded-full ${status}`}>
        <img
          src={
            avatarUrl
              ? avatarUrl
              : 'https://www.svgrepo.com/show/420345/fighter-luchador-man.svg'
          }
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
