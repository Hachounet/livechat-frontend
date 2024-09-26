import SearchInput from './searchInput';

export default function Search() {
  return (
    <div className=" self-center ">
      <form
        action=""
        className="flex"
      >
        <SearchInput />
        <button className="btn btn-ghost max-w-[50%]">Search</button>
      </form>
    </div>
  );
}
