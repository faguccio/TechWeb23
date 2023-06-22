import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Const } from '../utils';


import { isSameDay, isSameWeek, isSameMonth } from 'date-fns';

function isDateResetTriggered(dateToCheck) {
  const currentDate = new Date();
  
  if (isSameDay(dateToCheck, currentDate)) {
    return 'day';
  }

  if (isSameWeek(dateToCheck, currentDate)) {
    return 'week';
  }

  if (isSameMonth(dateToCheck, currentDate)) {
    return 'month';
  }

  return null;
}

function NewPostPage() {
  const token = localStorage.token;
  const [isPersonalMessage, setIsPersonalMessage] = useState(false);
  const [avatarPath, setAvatarPath] = useState('https://placekitten.com/100/100');
  const [postContent, setPostContent] = useState('');
  const [letterCount, setLetterCount] = useState(0);
  const [imageURL, setImageURL] = useState('');
  const [recipients, setRecipients] = useState('');
  const [notification, setNotification] = useState(null);
  const [geoCheck, setGeoCheck] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [leftoverChars, setLeftoverChars] = useState({ day: 0, week: 0, month: 0 });

  const fetchUser = async () => {
  const res = await fetch(`${Const.apiurl}/user/${user._id}`, {
      headers: { Authorization: token },
    });
    const userData = await res.json();
    setLeftoverChars(userData.leftovers_chars);
    return userData;
  };
  const { data: user } = useQuery('user', fetchUser);
  
    const handlePostContentChange = (e) => {
    const content = e.target.value;
    const previousContent = postContent;
    const newLength = content.replace(/\s/g, '').length;
    const previousLength = previousContent.replace(/\s/g, '').length;

    setPostContent(content);

    let count = newLength;
    if (imageURL !== '') {
      count += 125;
    }
    if (geoCheck) {
      count += 125;
    }

    const remainingChars = {
      day: leftoverChars.day,
      week: leftoverChars.week,
      month: leftoverChars.month,
    };

    if (newLength > previousLength) {
      const charDifference = newLength - previousLength;
      remainingChars.day -= charDifference;
      remainingChars.week -= charDifference;
      remainingChars.month -= charDifference;
    } else if (newLength < previousLength) {
      const charDifference = previousLength - newLength;
      remainingChars.day += charDifference;
      remainingChars.week += charDifference;
      remainingChars.month += charDifference;
    }

    setLetterCount(count);
    setLeftoverChars(remainingChars);
  };



  useEffect(() => {
    if (user) {
      if (user.propic_path !== '') {
        setAvatarPath(user.propic_path);
      }
    }
  }, [user]);

  function getGeolocation() {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  }

  async function getLongAndLat() {
    const { coords } = await getGeolocation();
    return { lat: coords.latitude, lon: coords.longitude };
  }

  function handlePublishClick() {
    if (letterCount > leftoverChars.day) {
      setNotification('Non hai caratteri sufficienti per pubblicare');
      return;
    }

    async function publishPost() {
    let geo = geoCheck ? await getLongAndLat() : { lat: 0, lon: 0 };
    setLatitude(geo.lat);
    setLongitude(geo.lon);

      const newPost = {
        sender: user._id,
        recipients: recipients ? recipients.split(',') : [],
        text: postContent,
        timestamp: new Date(),
        image_path: imageURL ? imageURL : [],
        geolocation: geo,
        reactions: { positive: 0, negative: 0 },
      };

      fetch(`${Const.apiurl}/post`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })
        .then(async(response) => {
          if (response.ok) {
            setPostContent('');
            setImageURL('');
            setLatitude(0);
            setLongitude(0);
            setRecipients('');
            setNotification('Post inviato con successo');
            const updatedChars = { ...leftoverChars };
            updatedChars.day -= letterCount;
            updatedChars.week -= letterCount;
            updatedChars.month -= letterCount;
            setLeftoverChars(updatedChars);
            await fetch(`${Const.apiurl}/user`, {
              method: 'PATCH',
              headers: {
                Accept: 'application/json',
                Authorization: token,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ leftovers_chars: updatedChars }),
            })
              .then((response) => {
                if (response.ok) {
                  console.log('Numero di caratteri giornalieri aggiornato con successo');
                } else {
                  throw new Error("Errore nell'aggiornamento del numero di caratteri giornalieri");
                }
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            throw new Error('Errore nell\'invio del post');
          }
        })
        .catch((error) => {
          console.error(error);
          setNotification('Errore nell\'invio del post');
        });
    }

    publishPost();
  }

  


  useEffect(() => {

    if (isPersonalMessage) {
    setLetterCount(0);
    setNotification("Questo è un messaggio personale, non le verranno scalati i chars");
    return;
  }
    let count = postContent.replace(/\s/g, '').length;
    if (imageURL !== '') {
      count += 125;
    }
    if (geoCheck) {
      count += 125;
    }
    setLetterCount(count);
  }, [postContent, imageURL, geoCheck, isPersonalMessage]);

  const handleImageURLChange = (e) => {
    setImageURL(e.target.value);
    if (e.target.value !== '') {
      setNotification('Immagine aggiunta +125 Caratteri');
    }
  };

  const handleGeoCheckChange = (e) => {
    setGeoCheck(e.target.checked);
    if (e.target.checked) {
      setNotification('Geolocalizzazione presa +125 Caratteri');
    }
  };

  return (
    <div className="flex mt-6 pt-6 justify-center">
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
            <input
              className="border border-gray-300 outline-none w-full p-2 mb-2"
              type="text"
              placeholder="Inserisci URL dell'immagine"
              value={imageURL}
              onChange={handleImageURLChange}
            />
            <input
              className="border border-gray-300 outline-none w-full p-2 mb-2"
              type="text"
              placeholder="Inserisci destinatari (separati da virgole)"
              value={recipients}
              onChange={(e) => {
                const value = e.target.value;
                setIsPersonalMessage(value.includes("@"));
                setRecipients(value);}}
            />
            <textarea
              className="border border-gray-300 outline-none w-full p-2"
              placeholder="Scrivi un nuovo..."
               value={postContent}
                onChange={handlePostContentChange}
            ></textarea>
            <label htmlFor="geoCheck" className="flex items-center mt-2">
              <input
                id="geoCheck"
                type="checkbox"
                className="mr-1"
                checked={geoCheck}
                onChange={handleGeoCheckChange}
                
              />
              Includi geolocalizzazione
            </label>
            <h2>Caratteri Rimanenti</h2>
            <div className="ml-2 button teal font-bold">
              
              Giorno: {leftoverChars.day} Settimana: {leftoverChars.week} Mese: {leftoverChars.month}
            </div>
          </div>
        </div>
        <div className="text-right mb-2">
          <span>Conteggio lettere: {letterCount}</span>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary" onClick={handlePublishClick}>
            Pubblica
          </button>
        </div>
        {notification && (
          <div className="text-center mt-4">
            {notification.includes('success') ? (
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
