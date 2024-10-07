import { userInfosUrl } from '../DevHub';
import useAuth from '../hooks/authFetch';
import UserStatus from './UserStatus';
export default function UserHub() {
  const { data, loading, error } = useAuth(userInfosUrl);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-xl flex justify-center items-center h-full">
        Error: An error occured. {error.message}
      </div>
    );

  console.log(data);
  return (
    <UserStatus
      pseudo={data.user.pseudo}
      avatarUrl={data.user.avatarUrl}
    />
  );
}
