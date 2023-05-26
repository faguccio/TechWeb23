import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";

function NewPostPage() {
  const [avatarPath, setAvatarPath] = useState("https://placekitten.com/100/100");
  const [postContent, setPostContent] = useState("");

  const userID = localStorage.getItem("userID")?.toString();

  const fetchUser = async () => {
    const res = await fetch(`http://localhost:3000/user/${userID}`);
    return await res.json();
  };

  const { data: user } = useQuery(["user", userID], fetchUser);

  useEffect(() => {
    if (user) {
      if (user.propic_path !== "") {
        setAvatarPath(user.propic_path);
      }
    }
  }, [user]);

  function handlePublishClick() {
    const postData = {
      sender: userID, // Sostituisci userID con l'ID corretto del mittente del post
      recipients: [],
      text: postContent,
      timestamp: new Date(),
      image_path: "",
      geolocation: { lat: 0, lon: 0 },
      reactions: { positive: 0, negative: 0 },
    };

    axios.post("/api/posts", postData) // Sostituisci "/api/posts" con l'URL corretto per la tua API dei post
      .then(response => {
        console.log(response.data); // Puoi gestire la risposta del server qui
      })
      .catch(error => {
        console.error(error); // Puoi gestire l'errore qui
      });
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-md p-4">
        <div className="flex items-center mb-4">
          <img
            className="w-10 h-10 rounded-full mr-3"
            src={avatarPath}
            alt="User Avatar"
          />
          <div className="flex-1">
            <input
              className="border-b border-gray-300 outline-none w-full"
              type="text"
              placeholder="Scrivi un nuovo..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary" onClick={handlePublishClick}>
            Pubblica
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
