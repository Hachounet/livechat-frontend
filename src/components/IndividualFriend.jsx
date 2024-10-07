import Avatar from './Avatar';
import PrivateChat from './PrivateChat';
import { useChatContext } from '../ChatContext';
import { responsiveWidth } from '../DevHub';
import PropTypes from 'prop-types';
export default function IndividualFriend({
  pseudo,
  avatarUrl,
  contactId,
  status,
}) {
  const { setActualPage, screenWidth, setNavBarVisible } = useChatContext();

  return (
    <>
      <button
        className="flex gap-2"
        onClick={() => {
          setActualPage(<PrivateChat contactId={contactId} />);
          if (screenWidth <= responsiveWidth) {
            setNavBarVisible((prevState) => !prevState);
          }
        }}
      >
        <Avatar
          avatarUrl={avatarUrl}
          status={status}
        />
        <div className="flex items-center">
          <span className=" text-xl md:text-2xl">{pseudo}</span>
        </div>
      </button>
    </>
  );
}

IndividualFriend.propTypes = {
  pseudo: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  contactId: PropTypes.string.isRequired,
  status: PropTypes.string,
};
