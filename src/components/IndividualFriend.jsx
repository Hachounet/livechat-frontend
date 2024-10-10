import Avatar from './Avatar';

import { useChatContext } from '../ChatContext';
import { responsiveWidth } from '../DevHub';
import PropTypes from 'prop-types';
export default function IndividualFriend({
  pseudo,
  avatarUrl,
  contactId,
  status,
  isBold,
  onClickSwitchSelectedFriend,
}) {
  const { setActualPage, screenWidth, setNavBarVisible } = useChatContext();

  return (
    <>
      <button
        className="flex gap-2"
        onClick={() => {
          setActualPage(['privatechat', contactId]);
          onClickSwitchSelectedFriend();
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
          <span
            className={`text-xl md:text-2xl ${isBold ? 'font-bold text-pink-300' : ''}`}
          >
            {pseudo}
          </span>
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
  isBold: PropTypes.bool,
  onClickSwitchSelectedFriend: PropTypes.func,
};
