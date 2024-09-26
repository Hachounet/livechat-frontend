import Avatar from './Avatar';

export default function IndividualFriend() {
  return (
    <>
      <div className="flex gap-2">
        <Avatar />
        <div className="flex flex-col">
          <span className=" text-xl md:text-2xl">@Pseudo</span>
          <span className="text-sm italic md:text-base">Michelle Obama</span>
        </div>
      </div>
    </>
  );
}
