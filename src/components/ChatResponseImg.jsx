import PropTypes from 'prop-types';

export default function ChatResponseImg({ imgUrl }) {
  return (
    <div className="chat chat-end min-w-[100%]">
      <div className="chat-bubble bg-green-700 text-gray-200 ">
        <img
          src={imgUrl}
          alt="User upload"
          className="w-32 h-32 md:w-48 md:h-48 object-cover"
        />
      </div>
    </div>
  );
}

ChatResponseImg.propTypes = {
  imgUrl: PropTypes.string.isRequired,
};
