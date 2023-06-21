function UserChars(props) {
  const { user } = props;
  //console.log(user);

  const nAum = user.popularPosts.length / 10;
  const nDim = user.unpopularPosts.length / 3;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        {["day", "week", "month"].map((field) => {
          return (
            <p className="text-black p-2 text-center rounded-lg bg-secondary" key={field}>
              {field} {user.leftovers_chars[field]}
            </p>
          );
        })}
      </div>
      <div>
        {nAum >= 1 ? (
          <p className="bg-success">
            You recieved {nAum} increase of chars due to having
            {user.popularPosts.length} popular posts.
          </p>
        ) : null}
        {nDim >= 1 ? (
          <p className="bg-warning text-black rounded-md p-2">
            You recieved {nDim} decrease of chars due to having{" "}
            {user.unpopularPosts.length} unpopular posts.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default UserChars;
