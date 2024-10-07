import PropTypes from 'prop-types';

export default function ChatResponse({ content }) {
  return (
    <div className="chat chat-end">
      <div className="chat-bubble bg-green-700 text-gray-200">{content}</div>
    </div>
  );
}

ChatResponse.propTypes = {
  content: PropTypes.string.isRequired,
};
