import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';

import { Link } from 'react-router-dom';

export default function AuthenticationTitle() {
  return (
    <div className="flex justify-center items-center min-w-[100%]">
      <div className=" p-8 min-h-[33%] flex items-center justify-center flex-col gap-2 custom-glassmorphism-bg rounded-2xl ">
        <span className=" text-2xl">LiveChat</span>
        <span>Log in</span>
        <EmailInput />
        <PasswordInput />
        <button className="btn btn-outline btn-primary">Log in</button>
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
