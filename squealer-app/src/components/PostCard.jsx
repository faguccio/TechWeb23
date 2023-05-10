import ReactionBar from "./ReactionBar";

function PostCard({ user, content }) {
  return (
    <div className="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto my-56 max-w-md md:max-w-2xl ">
      <div className="flex items-start px-4 py-6">
        <img
          className="w-12 h-12 rounded-full object-cover mr-4 shadow"
          src={user.image}
          alt="avatar"
        />
        <div className="">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 -mt-1">
              {user.username}
            </h2>
            <small className="text-sm text-gray-700">{content.timestamp}</small>
          </div>
          <div>
            <p>Destinatari</p>
          </div>
          <p className="mt-3 text-gray-700 text-sm">{content.text}</p>
          {content.image ? (
            <img className="my-5 rounded-lg" src={content.image} alt="A tree" />
          ) : null}
          <div className="flex justify-end">
            <ReactionBar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
