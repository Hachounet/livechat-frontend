import PropTypes from 'prop-types';

export default function ChatAnswer({ content }) {
  return (
    <div className="chat chat-start">
      <div className="chat-bubble">{content}</div>
    </div>
  );
}

ChatAnswer.propTypes = {
  content: PropTypes.string.isRequired,
};
