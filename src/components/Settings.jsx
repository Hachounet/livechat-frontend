import Avatar from './Avatar';

export default function Settings() {
  return (
    <>
      <div className="flex flex-col items-center pt-11 gap-10 min-w-[90%]">
        <h1 className="text-4xl text-pink-300">Settings</h1>
        <div className="flex flex-col items-center ">
          <span className="text-2xl text-pink-200">Avatar</span>
          <div className="flex items-center gap-4">
            <Avatar />
            <button className="btn btn-ghost">Update</button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-2xl text-pink-200 ">Personal infos</span>
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4 items-center">
              <span>Pseudo</span>
              <button className="btn btn-ghost">Update</button>
            </div>
            <div className="flex gap-4 items-center">
              <span>Full Name</span>
              <button className="btn btn-ghost">Update</button>
            </div>
            <div className="flex gap-4 items-center">
              <span>Birthdate</span>
              <button className="btn btn-ghost">Update</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
