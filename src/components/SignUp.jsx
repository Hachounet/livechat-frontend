import EmailInput from './EmailInput';
import UserInput from './UserInput';
import PasswordInput from './PasswordInput';
import { Link } from 'react-router-dom';
import FullNameInput from './FullNameInput';

export default function SignUp() {
  return (
    <div className="flex justify-center items-center min-w-[100%]">
      <div className=" p-8 min-h-[33%] flex items-center justify-center flex-col gap-2 custom-glassmorphism-bg rounded-2xl ">
        <span className=" text-2xl">LiveChat</span>
        <span>Sign Up</span>
        <UserInput />
        <FullNameInput />
        <EmailInput />
        <PasswordInput />
        <PasswordInput />
        <button className="btn btn-outline btn-primary">Log in</button>
        <span>
          Already have an account ?{' '}
          <Link
            className="link link-primary"
            to="/"
          >
            Click here
          </Link>
        </span>
      </div>
    </div>
  );
}
