export default function ChatInput() {
  return (
    <form className="self-center flex absolute bottom-4 gap-2">
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered input-primary w-full max-w-xs  self-center min-w-[33%] pt-4 pb-4"
      />
      <button className="btn btn-outline btn-info ">Send</button>
    </form>
  );
}
