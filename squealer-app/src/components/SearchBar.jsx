import { useState } from "react";

function SearchBar({ callback }) {
  const [searchVal, setSearchVal] = useState("");

  return (
    <div className="flex">
      <input
        type="text"
        className="bg-base-100 py-2 rounded-lg rounded-r-none outline-none md:w-96 px-6"
        aria-labelledby="searchbutton"
        value={searchVal}
        onChange={(e) => {
          setSearchVal(e.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key == "Enter") {
            callback(searchVal);
          }
        }}
      />
      <button
        className="bg-indigo-600 px-2  rounded-r-md hover:bg-primary"
        id="searchbutton"
        aria-label="search"
        onClick={() => {
          callback(searchVal);
        }}
      >
        <svg
          width="30px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Interface / Search_Magnifying_Glass">
            <path
              id="Vector"
              d="M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}

export default SearchBar;
