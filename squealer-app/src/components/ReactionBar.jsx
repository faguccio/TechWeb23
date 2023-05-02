function ReactionBar() {
  const smileEmoji = "🙂";

  return (
    <div className="mt-4 flex items-center">
      <div className="flex mx-2 items-center text-gray-700 text-sm mr-3">
        <button className="btn btn-sm text-lg">{smileEmoji}</button>
        <span>12</span>
      </div>
      <div className="flex mx-2 items-center text-gray-700 text-sm">
        <button className="text-lg">{smileEmoji}</button>
        <span>8</span>
      </div>
      <div className="flex mx-2 items-center text-gray-700 text-sm">
        <button className="text-lg">{smileEmoji}</button>
        <span>8</span>
      </div>
      <div className="flex mx-2 items-center text-gray-700 text-sm">
        <button className="text-lg">{smileEmoji}</button>
        <span>8</span>
      </div>
      <div className="flex mr-2 text-gray-700 text-sm mr-4">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          className="w-4 h-4 mr-1"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        <span>share</span>
      </div>
    </div>
  );
}

export default ReactionBar;
