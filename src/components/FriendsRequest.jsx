import IndividualFriend from './IndividualFriend';

export default function FriendsRequest() {
  return (
    <div className="self-center min-h-[100%] max-h-[100vh] flex flex-col items-center pt-11 gap-10 ">
      <span className="text-2xl text-pink-300">Friends Requests</span>
      <ul>
        <li className="flex gap-4 items-center pt-2 pb-2">
          <IndividualFriend />
          <button className="btn btn-outline btn-success">Accept</button>
          <button className="btn btn-outline btn-error">Deny</button>
        </li>
      </ul>
    </div>
  );
}
