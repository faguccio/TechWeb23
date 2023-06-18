import { useState, useEffect } from "react";
import { useQuery } from "react-query";

function NewPostPage() {
  const [avatarPath, setAvatarPath] = useState("https://placekitten.com/100/100");
  const [postContent, setPostContent] = useState("");
  const [letterCount, setLetterCount] = useState(0);
  const [imagePath, setImagePath] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [notification, setNotification] = useState(null);

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
    const newPost = {
      sender: localStorage.getItem("userID"),
      recipients: [],
      text: postContent,
      timestamp: new Date(),
      image_path: imagePath,
      geolocation: { lat: 0, lon: 0 },
      reactions: { positive: 0, negative: 0 },
    };

    fetch(`http://localhost:3000/post`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then((response) => {
        if (response.ok) {
          setPostContent("");
          setImagePath("");
          setImageLoaded(false);
          setNotification("Post inviato con successo");
        } else {
          throw new Error("Errore nell'invio del post");
        }
      })
      .catch((error) => {
        console.error(error);
        setNotification("Errore nell'invio del post");
      });
  }

  useEffect(() => {
    let count = postContent.replace(/\s/g, "").length;
    if (imageLoaded) {
      count += 125;
    }
    setLetterCount(count);
  }, [postContent, imageLoaded]);

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePath(reader.result);
        setImageLoaded(true);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-xl w-full bg-white shadow-md rounded-md p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Scrivi un nuovo Squeal!</h1>
        <div className="flex items-center mb-4">
          <img className="w-10 h-10 rounded-full mr-3" src={avatarPath} alt="User Avatar" />
          <div className="flex-1 relative">
            {imageLoaded && (
              <img className="w-full rounded-md mb-2" src={imagePath} alt="Uploaded Image" />
            )}
            <textarea
              className="border border-gray-300 outline-none w-full p-2"
              placeholder="Scrivi un nuovo..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="text-right mb-2">
          <span>Conteggio lettere: {letterCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <label htmlFor="image-upload" className="cursor-pointer">
              <span className="text-blue-500">+</span> Carica immagine
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          {imageLoaded && (
            <div className="text-green-500">Immagine caricata (125 caratteri)</div>
          )}
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary" onClick={handlePublishClick}>
            Pubblica
          </button>
        </div>
        {notification && (
          <div className="text-center mt-4">
            {notification.includes("success") ? (
              <p className="text-green-500">{notification}</p>
            ) : (
              <p className="text-red-500">{notification}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewPostPage;
