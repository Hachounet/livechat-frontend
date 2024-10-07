import PropTypes from 'prop-types';

export default function ChatAnswerImg({ imgUrl }) {
  return (
    <div className="chat chat-start min-w-[100%]">
      <div className="chat-bubble  text-gray-200 ">
        <img
          src={imgUrl}
          alt="User upload"
          className="w-32 h-32 md:w-48 md:h-48 object-cover"
        />
      </div>
    </div>
  );
}

ChatAnswerImg.propTypes = {
  imgUrl: PropTypes.string.isRequired,
};
