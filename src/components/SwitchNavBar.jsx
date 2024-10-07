import { useChatContext } from '../ChatContext';

export default function SwitchNavBar() {
  const { setNavBarVisible, actualContactPseudo } = useChatContext();

  return (
    <div className=" z-10 flex justify-between pl-4 pr-4 custom-glassmorphism-bg w-full min-h-[2.75rem] fixed top-0 items-center">
      <button
        className="btn btn-square btn-outline  "
        onClick={() => {
          setNavBarVisible((prevState) => !prevState);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M14.59 7.41L13.17 6l-6 6 6 6 1.41-1.41L10.83 12z"
          />
        </svg>
      </button>
      <span className=" font-bold text-green-100">{actualContactPseudo}</span>
    </div>
  );
}
