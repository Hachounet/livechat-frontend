import ChatResponse from './ChatResponse';
import ChatAnswer from './ChatAnswer';
import ChatInput from './ChatInput';

export default function PrivateChat() {
  return (
    <>
      <div className="pt-11 min-w-[70%] flex flex-col">
        <ChatAnswer />
        <ChatResponse />
        <ChatInput />
      </div>
    </>
  );
}
