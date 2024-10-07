import GroupChat from './GroupChat';
import { useChatContext } from '../ChatContext';
import { responsiveWidth } from '../DevHub';
import PropTypes from 'prop-types';
export default function Group({ name, groupId }) {
  const { setActualPage, screenWidth, setNavBarVisible } = useChatContext();

  return (
    <>
      <button
        className="flex gap-2"
        onClick={() => {
          setActualPage(<GroupChat groupId={groupId} />);
          if (screenWidth <= responsiveWidth) {
            setNavBarVisible((prevState) => !prevState);
          }
        }}
      >
        <div className="flex items-center">
          <span className=" text-xl md:text-2xl">{name}</span>
        </div>
      </button>
    </>
  );
}

Group.propTypes = {
  name: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
};
