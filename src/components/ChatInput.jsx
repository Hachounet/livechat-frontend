import { useState } from 'react';
import FileInput from './FileInput';
import { useChatContext } from '../ChatContext';
import { getPrivateMessagesURL } from '../DevHub';
import { useSocketContext } from '../SocketContext';
import PropTypes from 'prop-types';

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  receiverId,
  receiverPseudo = 'User',
  setMessages,
  groupOrPm,
}) {
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [file, setFile] = useState(null);
  const { token, setLogged } = useChatContext();
  const { socket } = useSocketContext();

  const handleFileChange = (fileSelected, selectedFile) => {
    setIsFileSelected(fileSelected);
    if (fileSelected) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isFileSelected && file) {
      const formData = new FormData();
      formData.append('img', file);

      let url;
      if (groupOrPm === 'group-private') {
        url = `http://localhost:3000/groups/files/${receiverId}`;
      } else if (groupOrPm === 'private-chat') {
        url = `${getPrivateMessagesURL}/${receiverId}/image`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        setLogged(false);
        window.location.href = '/';
        return;
      }

      if (response.ok) {
        const newData = await response.json();
        socket.emit('privateMessageSent', {
          recipientId: receiverId,
          message: newData.newMessage,
        });

        setMessages((prevMessages) => [...prevMessages, newData.newMessage]);
      }

      setIsFileSelected(false);
      setFile(null);
    } else {
      await onSubmit(event);
    }
  };

  return (
    <form
      className="self-center flex absolute bottom-4 gap-2 flex-col md:flex-row max-w-[90%] justify-center md:w-[70%]"
      onSubmit={handleSubmit}
    >
      <input
        value={value}
        onChange={onChange}
        type="text"
        placeholder={`To @${receiverPseudo}...`}
        className="input input-bordered input-primary w-full max-w-xs self-center min-w-[33%] pt-4 pb-4"
        disabled={isFileSelected}
      />
      <button
        className="btn btn-outline btn-info  self-center min-w-[33%] max-w-xs w-full md:max-w-8 md:min-w-48"
        type="submit"
      >
        Send
      </button>
      {groupOrPm === 'group-private' ? (
        <FileInput
          onFileChange={handleFileChange}
          file={file}
        />
      ) : groupOrPm === 'private-chat' ? (
        <FileInput
          onFileChange={handleFileChange}
          file={file}
        />
      ) : null}
    </form>
  );
}

ChatInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  receiverId: PropTypes.string,
  receiverPseudo: PropTypes.string,
  setMessages: PropTypes.func,
  groupOrPm: PropTypes.string,
};
