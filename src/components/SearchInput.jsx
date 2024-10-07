import PropTypes from 'prop-types';

export default function SearchInput({ query, setQuery }) {
  return (
    <label
      htmlFor="query"
      className="max-w-[100%] input input-bordered input-primary flex items-center gap-2 "
    >
      <input
        type="text"
        className="grow"
        placeholder="User or group name..."
        name="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-4 w-4 opacity-70"
      >
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>
    </label>
  );
}

SearchInput.propTypes = {
  query: PropTypes.string,
  setQuery: PropTypes.func,
};
