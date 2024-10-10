import { useChatContext } from '../ChatContext';
import { responsiveWidth } from '../DevHub';
import PropTypes from 'prop-types';
export default function Group({ name, groupId, className }) {
  const { setActualPage, screenWidth, setNavBarVisible } = useChatContext();

  return (
    <>
      <button
        className="flex gap-2"
        onClick={() => {
          setActualPage(['groupchat', groupId]);
          if (screenWidth <= responsiveWidth) {
            setNavBarVisible((prevState) => !prevState);
          }
        }}
      >
        <div className="flex items-center">
          <span className={`text-xl md:text-2xl ${className}`}>{name}</span>
        </div>
      </button>
    </>
  );
}

Group.propTypes = {
  name: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  className: PropTypes.string,
};
