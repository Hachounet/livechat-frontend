import Avatar from './Avatar';
import useAuth from '../hooks/authFetch';
import { userInfosUrl, userPasswordUrl } from '../DevHub';
import { useChatContext } from '../ChatContext';
import { useState, useEffect } from 'react';
import { useSocketContext } from '../SocketContext';

export default function Settings() {
  const { data, loading, error } = useAuth(userInfosUrl);
  const { token, setLogged, setActualContactPseudo } = useChatContext();
  const { socket } = useSocketContext();
  const [pseudoValue, setPseudoValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorsMessage, setErrorsMessage] = useState([]);

  useEffect(() => {
    if (data && data.user) {
      setAvatarUrl(data.user.avatarUrl);
    }
  }, [data]);

  useEffect(() => {
    setActualContactPseudo('Settings');
  }, [setActualContactPseudo]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-xl flex justify-center items-center h-full">
        Error: An error occured. {error.message}
      </div>
    );

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const handleAvatarChange = (event) => {
    setAvatarFile(event.target.files[0]);
  };

  const handleAvatarSubmit = async (event) => {
    event.preventDefault();

    setErrorsMessage([]);

    if (!avatarFile) {
      setErrorsMessage((prev) => [
        ...prev,
        { msg: 'Please select an avatar image.' },
      ]);
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await fetch(`${userInfosUrl}avatar`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      setLogged(false);
      window.location.href = '/';
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      setErrorsMessage((prev) => [...prev, { msg: errorData.message }]);
    } else {
      const data = await response.json();
      setSuccessMessage(data.message);
      setAvatarUrl(data.avatarUrl);
      socket.emit('updateAvatar', { avatarUrl: data.avatarUrl });
    }
  };

  const handleLogOutUser = async (event) => {
    event.preventDefault();
    localStorage.removeItem('accessToken');
    if (socket) {
      socket.disconnect();
    }
    setLogged(false);
    window.location.href = '/';
    return;
  };

  const handleUserInfosSubmit = async (event) => {
    event.preventDefault();
    let pseudo = pseudoValue || data.user.pseudo;
    let email = emailValue || data.user.email;

    setErrorsMessage([]);
    let hasError = false;

    if (pseudo !== '' && !(pseudo.length >= 3 && pseudo.length < 20)) {
      const pseudoError = {
        msg: 'Your pseudo must be between 3 and 20 characters.',
      };
      setErrorsMessage((prev) => [...prev, pseudoError]);
      hasError = true;
    }

    if (email !== '' && !isValidEmail(email)) {
      const emailError = {
        msg: 'Your email must be in a valid format.',
      };
      setErrorsMessage((prev) => [...prev, emailError]);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const response = await fetch(`${userInfosUrl}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pseudo, email }),
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      setLogged(false);
      window.location.href = '/';
      return;
    }

    // If pseudo is already taken
    if (!response.ok && response.status === 400) {
      const data = await response.json();
      const pseudoErr = { msg: data.message };

      setErrorsMessage((prev) => [...prev, pseudoErr]);
    }

    if (response.ok) {
      const data = await response.json();
      setSuccessMessage(data.message);
      socket.emit('changePseudo', { pseudo });
    }
  };

  const handleUserPasswordSubmit = async (event) => {
    event.preventDefault();

    setErrorsMessage([]);
    setSuccessMessage('');

    const oldPassword = event.target.oldPassword.value;
    const newPassword = event.target.newPassword.value;

    if (!oldPassword || !newPassword) {
      setErrorsMessage((prev) => [
        ...prev,
        { msg: 'Please provide both old and new passwords.' },
      ]);
      return;
    }

    if (newPassword.length < 6) {
      setErrorsMessage((prev) => [
        ...prev,
        { msg: 'New password must be at least 6 characters long.' },
      ]);
      return;
    }

    try {
      const response = await fetch(`${userPasswordUrl}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        setLogged(false);
        window.location.href = '/';
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setErrorsMessage((prev) => [
          ...prev,
          { msg: data.message || 'Failed to update password.' },
        ]);
      } else {
        setSuccessMessage(data.message || 'Password updated successfully.');
        localStorage.removeItem('accessToken');
        setLogged(false);
        window.location.href = '/';
        return;
      }
    } catch (error) {
      setErrorsMessage((prev) => [
        ...prev,
        {
          msg: `An error occurred while updating the password. ${error.message}`,
        },
      ]);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center pt-11 gap-10 min-w-[90%]">
        <h1 className="text-4xl text-pink-300">Settings</h1>
        {errorsMessage.length > 0 ? (
          <ul>
            {errorsMessage.map((error, index) => (
              <li
                key={index}
                className="flex justify-center"
              >
                <span className=" text-red-400">{error.msg}</span>
              </li>
            ))}
          </ul>
        ) : (
          ''
        )}
        {successMessage !== '' ? (
          <span className=" text-green-500 self-center">{successMessage}</span>
        ) : (
          ''
        )}
        <form
          onSubmit={handleAvatarSubmit}
          className="flex flex-col justify-center"
        >
          <div className="flex flex-col items-center ">
            <span className="text-2xl text-pink-200">Avatar</span>
            <div className="flex flex-col items-center gap-4">
              <Avatar
                avatarUrl={avatarUrl}
                status={'offline'}
              />
              <input
                type="file"
                className="file-input file-input-bordered file-input-xs w-full max-w-xs"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
          <button className="btn btn-ghost">Update</button>
        </form>
        <form className="flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl text-pink-200 ">Personal infos</span>

            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  onChange={(e) => {
                    setPseudoValue(e.target.value);
                  }}
                  value={pseudoValue}
                  placeholder={data.user.pseudo}
                  className="input input-bordered input-primary w-full max-w-xs"
                />
              </div>
              <div className="flex gap-4 items-center">
                <input
                  type="email"
                  placeholder={data.user.email}
                  onChange={(e) => {
                    setEmailValue(e.target.value);
                  }}
                  value={emailValue}
                  className="input input-bordered input-primary w-full max-w-xs"
                />
              </div>
            </div>
          </div>

          <button
            onClick={(e) => handleUserInfosSubmit(e)}
            className="btn btn-ghost"
          >
            Update
          </button>
        </form>

        <form
          className="flex flex-col justify-center"
          onSubmit={(e) => handleUserPasswordSubmit(e)}
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl text-pink-200 ">Password</span>

            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-4 items-center">
                <input
                  name="oldPassword"
                  type="password"
                  placeholder="Old password"
                  className="input input-bordered input-primary w-full max-w-xs"
                />
              </div>
              <div className="flex gap-4 items-center">
                <input
                  name="newPassword"
                  type="password"
                  placeholder="New password"
                  className="input input-bordered input-primary w-full max-w-xs"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-ghost"
          >
            Update
          </button>
        </form>
        <form
          className="flex flex-col justify-center"
          onSubmit={(e) => handleLogOutUser(e)}
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl text-pink-200 ">Log out</span>
          </div>

          <button
            type="submit"
            className="btn btn-ghost"
          >
            Log out
          </button>
        </form>
      </div>
    </>
  );
}
