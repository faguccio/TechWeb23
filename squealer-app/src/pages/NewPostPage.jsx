function NewPostPage() {
  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-md p-4">
        <div className="flex items-center mb-4">
          <img
            className="w-10 h-10 rounded-full mr-3"
            src="https://placekitten.com/100/100"
            alt="User Avatar"
          />
          <div className="flex-1">
            <input
              className="border-b border-gray-300 outline-none w-full"
              type="text"
              placeholder="Scrivi un nuovo squeal..."
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary">
            Pubblica
          </button>
        </div>
      </div>
    </div>
    
    
  );
}

export default NewPostPage;
