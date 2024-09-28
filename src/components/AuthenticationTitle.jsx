import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import { siteURL } from '../DevHub';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useChatContext } from '../ChatContext';

export default function AuthenticationTitle() {
  const { setLogged } = useChatContext();

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Empêcher la soumission par défaut du formulaire

    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());

    fetch(`${siteURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    })
      .then((response) => {
        return response
          .json()
          .then((data) => ({ data, status: response.status }));
      })
      .then(({ data, status }) => {
        if (status === 400) {
          setErrors(data.errors);
          setSuccessMessage('');
        } else {
          setSuccessMessage(data.message);
          setErrors([]);
          localStorage.setItem('accessToken', data.accessToken);
          setLogged(true);

          setTimeout(() => {
            window.location.href = '/home';
          }, 1000);
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch((err) => {
        setErrors([{ msg: 'Something went wrong. Please try again later.' }]);
      });
  };

  return (
    <div className="flex justify-center items-center min-w-[100%]">
      <div className=" p-8 min-h-[33%] flex items-center justify-center flex-col gap-2 custom-glassmorphism-bg rounded-2xl ">
        <span className=" text-2xl">LiveChat</span>
        <span>Log in</span>
        {successMessage && <span>{successMessage}</span>}
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="flex flex-col gap-2"
        >
          <EmailInput />
          <PasswordInput />
          <button
            type="submit"
            className="btn btn-outline btn-primary"
          >
            Log in
          </button>
        </form>

        {errors.length > 0 && (
          <ul>
            {errors.map((error, index) => (
              <li
                key={index}
                className="text-red-500"
              >
                {error.msg}
              </li>
            ))}
          </ul>
        )}

        <span>
          New here ? Click here to{' '}
          <Link
            className="link link-primary"
            to="/signup"
          >
            sign up
          </Link>
          <Link to="/home">HOME(WIP)</Link>
        </span>
      </div>
    </div>
  );
}
