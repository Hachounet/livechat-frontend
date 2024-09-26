import IndividualFriend from './IndividualFriend';
import PrivateChat from './PrivateChat';
import { useChatContext } from '../ChatContext';
export default function FriendsList() {
  const { setActualPage } = useChatContext();

  return (
    <ul>
      <li>
        <button
          className=""
          onClick={() => {
            setActualPage(<PrivateChat />);
          }}
        >
          <IndividualFriend />
        </button>
      </li>
    </ul>
  );
}
