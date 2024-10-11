import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import { siteURL } from '../DevHub';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useChatContext } from '../ChatContext';
import Logo from './Logo';

export default function AuthenticationTitle() {
  const { setLogged, logged, setToken } = useChatContext();

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

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

          setToken(localStorage.getItem('accessToken'));
          setLogged(true);
          setTimeout(() => {
            navigate('/home');
          }, 1000);
        }
      })

      .catch((err) => {
        setErrors([
          {
            msg: `Something went wrong. Please try again later. ${err.message}`,
          },
        ]);
      });
  };

  return (
    <div className="flex justify-center items-center min-w-[100%]">
      <div className=" p-4 min-h-[33%] flex items-center justify-center flex-col gap-2 custom-glassmorphism-bg rounded-2xl ">
        <Logo />
        <span>Log in</span>
        {successMessage && <span>{successMessage}</span>}
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="flex flex-col gap-2"
        >
          <EmailInput />
          <PasswordInput name={'pw'} />
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

        <span className="flex items-center flex-col">
          New here ? Click here to{' '}
          <Link
            className="link link-primary"
            to="/signup"
          >
            sign up
          </Link>
        </span>
      </div>
    </div>
  );
}
