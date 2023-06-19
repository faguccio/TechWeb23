import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Const } from "../utils";

function NewPostPage() {
  const [avatarPath, setAvatarPath] = useState(
    "https://placekitten.com/100/100"
  );
  const [postContent, setPostContent] = useState("");
  const [letterCount, setLetterCount] = useState(0);
  const [imagePath, setImagePath] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [notification, setNotification] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const userID = localStorage.getItem("userID")?.toString();

  const fetchUser = async () => {
    const res = await fetch(`${Const.apiurl}/user/${userID}`);
    return await res.json();
  };

  const { data: user } = useQuery(["user", userID], fetchUser);

  useEffect(() => {
    // Resetta i leftovers_chars.day a 500 all'inizio di ogni giorno
    const resetDailyChars = () => {
      const now = new Date();
      const nextDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      const timeToReset = nextDay.getTime() - now.getTime();
      setTimeout(() => {
        // Effettua la chiamata PATCH per reimpostare i leftovers_chars.day a 500
        const updatedChars = { ...user.leftovers_chars, day: 500 };
        fetch(`${Const.apiurl}/user/${localStorage.getItem("userID")}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: localStorage.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ leftovers_chars: updatedChars }),
        })
          .then((response) => {
            if (response.ok) {
              console.log("Reset giornaliero completato");
            } else {
              throw new Error("Errore nel reset giornaliero");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }, timeToReset);
    };

    resetDailyChars();
  }, [user]);

  useEffect(() => {
    if (user) {
      if (user.propic_path !== "") {
        setAvatarPath(user.propic_path);
      }
    }
  }, [user]);

  function handlePublishClick() {
    // Verifica se il numero di caratteri nel post supera i caratteri rimanenti
    if (letterCount > user.leftovers_chars.day) {
      setNotification("Non hai caratteri sufficienti per pubblicare");
      return;
    }

    const regexRecipients = /§(\w+)/g; // Regex per identificare i canali (§nomeutente)
    const regexHashtags = /#(\w+)/g; // Regex per identificare gli hashtags (#esempio)
    const regexMentions = /@(\w+)/g; // Regex per identificare le menzioni (@nomeutente)

    const recipients = [];
    const hashtags = [];
    const mentions = [];

    let match;
    while ((match = regexRecipients.exec(postContent))) {
      recipients.push(match[1]);
    }

    while ((match = regexHashtags.exec(postContent))) {
      hashtags.push(match[1]);
    }

    while ((match = regexMentions.exec(postContent))) {
      mentions.push(match[1]);
    }

    recipients.push(...hashtags, ...mentions); // Aggiungi gli hashtags e le menzioni ai destinatari
    console.log({ recipients });

    const newPost = {
      sender: localStorage.getItem("userID"),
      recipients: recipients,
      text: postContent,
      timestamp: new Date(),
      image_path: imagePath,
      geolocation: { lat: latitude, lon: longitude },
      reactions: { positive: 0, negative: 0 },
    };

    fetch(`${Const.apiurl}/post`, {
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
          setLatitude(0);
          setLongitude(0);
          setNotification("Post inviato con successo");
          // Decrementa il numero di caratteri giornalieri utilizzati
          const updatedChars = { ...user.leftovers_chars };
          updatedChars.day -= letterCount;
          updatedChars.week -= letterCount;
          updatedChars.month -= letterCount;
          // Effettua la chiamata PATCH per aggiornare i leftovers_chars dell'utente
          fetch(`${Const.apiurl}/user/${localStorage.getItem("userID")}`, {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              Authorization: localStorage.token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ leftovers_chars: updatedChars }),
          })
            .then((response) => {
              if (response.ok) {
                console.log(
                  "Numero di caratteri giornalieri aggiornato con successo"
                );
              } else {
                throw new Error(
                  "Errore nell'aggiornamento del numero di caratteri giornalieri"
                );
              }
            })
            .catch((error) => {
              console.error(error);
            });
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
        <h1 className="text-2xl font-bold mb-4 text-center">
          Scrivi un nuovo Squeal!
        </h1>
        <div className="flex items-center mb-4">
          <img
            className="w-10 h-10 rounded-full mr-3"
            src={avatarPath}
            alt="User Avatar"
          />
          <div className="flex-1 relative">
            {imageLoaded && (
              <img
                className="w-full rounded-md mb-2"
                src={imagePath}
                alt="Uploaded Image"
              />
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
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="latitude-input">Latitudine:</label>
          <input
            id="latitude-input"
            type="number"
            step="0.000001"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="longitude-input">Longitudine:</label>
          <input
            id="longitude-input"
            type="number"
            step="0.000001"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
          />
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
            <div className="text-green-500">
              Immagine caricata (125 caratteri)
            </div>
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
