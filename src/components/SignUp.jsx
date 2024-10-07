import EmailInput from './EmailInput';
import UserInput from './UserInput';
import PasswordInput from './PasswordInput';
import { Link } from 'react-router-dom';
import { signUpUrl } from '../DevHub';
import { useState } from 'react';

export default function SignUp() {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorsMessages, setErrorsMessages] = useState([]);

  const handleSignUp = async (event) => {
    setErrorsMessages([]);
    setSuccessMessage(null);
    event.preventDefault();

    const response = await fetch(`${signUpUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pseudo: event.target.pseudo.value,
        email: event.target.email.value,
        pw: event.target.pw.value,
        confpw: event.target.confpw.value,
      }),
    });

    if (response.status === 400) {
      const newData = await response.json();
      setErrorsMessages(newData.errors);
    }

    if (response.ok) {
      const newData = await response.json();
      setSuccessMessage(newData.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-w-[100%]">
      <div className=" p-8 min-h-[33%] flex items-center justify-center flex-col gap-2 custom-glassmorphism-bg rounded-2xl ">
        <span className=" text-2xl">LiveChat</span>
        <span>Join us !</span>
        <form
          className=" flex flex-col gap-2"
          onSubmit={(e) => handleSignUp(e)}
        >
          <UserInput />

          <EmailInput />
          <PasswordInput name={'pw'} />
          <PasswordInput name={'confpw'} />

          <button
            type="submit"
            className="btn btn-outline btn-primary"
          >
            Sign up
          </button>
        </form>

        <span>
          Already have an account ?{' '}
          <Link
            className="link link-primary"
            to="/"
          >
            Click here
          </Link>
        </span>
        {successMessage !== null ? (
          <span className="text-green-300">{successMessage}</span>
        ) : null}
        {errorsMessages.length > 0
          ? errorsMessages.map((error, index) => (
              <span
                className=" text-red-400"
                key={index}
              >
                {error.msg}
              </span>
            ))
          : null}
      </div>
    </div>
  );
}
