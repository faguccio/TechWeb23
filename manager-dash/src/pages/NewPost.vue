<template>
  <div class="flex justify-center">
    <div class="max-w-xl w-full bg-zinc-50 shadow-lg shadow-zinc-300 rounded-md p-4 mt-4">
      <h1 class="text-2xl font-bold mb-4 text-center">
        Scrivi un nuovo Squeal!
      </h1>
      <div class="flex items-center mb-4">
        <img
          class="w-10 h-10 rounded-full mr-3"
          :src="avatarPath"
          alt="User Avatar"
        />
        <div class="flex-1 relative">
          <label class="label " for="imageURL">
            URL Immagine
          </label>
          <input
            class="input input-bordered input-primary w-full p-2 mb-2"
            type="text"
            placeholder="Inserisci URL dell'immagine"
            id="imageURL"
            v-model="imageURL"
            @input="handleImageURLChange"
          />
          <label class="label " for="recipients">
            Destinatari
          </label>
          <input
            class="input input-bordered input-primary w-full p-2 mb-2"
            type="text"
            placeholder="Inserisci destinatari (separati da virgole)"
            id="recipients"
            v-model="recipients"
          />
          <label class="label " for="postContent">
            Testo del Post
          </label>
          <textarea
            class="textarea textarea-bordered textarea-primary w-full p-2 mb-3"
            placeholder="Scrivi un nuovo..."
            v-model="postContent"
            id="postContent"
            @input="handleTextChange"
          ></textarea>
          <label for="geoCheck" class="flex items-center">
            <input
              id="geoCheck"
              type="checkbox"
              class="checkbox checkbox-primary mr-2"
              v-model="geoCheck"
              @input="handleGeoCheckChange"
            />
            Includi geolocalizzazione
          </label>
        </div>
      </div>
      <div class="flex flex-row items-center justify-between px-4">
        <div class="flex flex-col">
          <p id="leftovers-chars" class="">Caratteri Rimanenti</p>
          <div class="text-lg ml-2" aria-labelledby="leftovers-chars">
            Giorno: <span class="font-semibold">{{ leftoverChars.day }}</span><br/>
            Settimana: <span class="font-semibold">{{ leftoverChars.week }}</span><br/>
            Mese: <span class="font-semibold">{{ leftoverChars.month }}</span>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-right text-lg mb-2">
            Conteggio lettere: <span class="font-bold text-primary">{{ letterCount }}</span>
          </div>
          <div class="flex justify-end">
            <button class="btn btn-accent" @click="handlePublishClick">
              Pubblica
            </button>
          </div>
        </div>
      </div>
      <div v-if="notification" class="text-center mt-4">
        <p v-if="notification.includes('success')" class="text-green-500">
          {{ notification }}
        </p>
        <p v-else class="text-red-500">{{ notification }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import { ref, reactive, onMounted } from "vue";
import { useQuery } from "vue-query";
import { Const, fetchUser, fetchUserManaged } from "../utils";

export default {
  setup() {
    const token = localStorage.tokenPro;
    const user = ref(null);
    //const userManaged = ref(null);
    const avatarPath = ref(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    );
    const postContent = ref("");
    const letterCount = ref(0);
    const imageURL = ref("");
    const recipients = ref("");
    const notification = ref(null);
    const geoCheck = ref(false);
    const geolocation = ref(null);
    const leftoverChars = reactive({ day: 0, week: 0, month: 0 });
    const mediaChars = 125;
    var isImageCharsAdded = false;

    /*
      const fetchUserManaged = async () => {
         const response = await fetch(`${Const.apiurl}/user/${userManaged.value._id}`, {
            headers: { Authorization: token },
         });
         const userManagedData = await response.json();
         Object.assign(leftoverChars, userManagedData.leftovers_chars);
         return userManagedData;
      };
      */
    //const { data: userManagedData } = useQuery('userManaged', fetchUserManaged);

    onMounted(async () => {
        if (!token) {
          router.push("/login");
          return;
        }
      const response1 = await fetchUser();
      user.value = await response1;
      if (user.value.type === "manager" && user.value.managing !== null) {
        const response2 = await fetchUserManaged();
        user.value = await response2;
      }
      if (user.value.propic_path !== "") {
        avatarPath.value = user.value.propic_path;
      }
      leftoverChars.day = user.value.leftovers_chars.day;
      leftoverChars.week = user.value.leftovers_chars.week;
      leftoverChars.month = user.value.leftovers_chars.month;
      //console.log("user.value.leftovers_chars.day", user.value.leftovers_chars.day);
      //console.log("leftoverChars", leftoverChars);
    });

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
      if (letterCount.value > leftoverChars.day) {
        notification.value = "Non hai caratteri sufficienti per pubblicare";
        return;
      }

      async function publishPost() {
        notification.value = "Pubblicazione in corso...";
        let newPost = {
          sender: user.value._id, // Utilizziamo user come sender
          recipients: recipients.value
            ? recipients.value.split(",").map((recipients) => {
                recipients.trim();
              })
            : [],
          text: postContent.value,
          timestamp: new Date(),
          reactions: { positive: 0, negative: 0 },
        };
        if (recipients.value !== "") {
          newPost.recipients = recipients.value.split(",");
          newPost.recipients = newPost.recipients.map((recipient) => {
            return recipient.trim();
          });
        }
        if (imageURL.value !== "") newPost.image_path = imageURL.value;
        if (geoCheck.value) newPost.geolocation = geolocation.value;

        console.log("newPost", newPost);

        fetch(`${Const.apiurl}/post`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        })
          .then(async (response) => {
            if (response.ok) {
              postContent.value = "";
              imageURL.value = "";
              recipients.value = "";
              isImageCharsAdded = false; // Resetto il flag
              geoCheck.value = false;
              notification.value = "Post inviato con successo";
              setTimeout(() => {
                notification.value = "";
              }, 2000);

              leftoverChars.day -= letterCount.value;
              leftoverChars.week -= letterCount.value;
              leftoverChars.month -= letterCount.value;
              letterCount.value = 0;
              console.log("leftoverChars", leftoverChars);
              await fetch(`${Const.apiurl}/user/${user.value._id}`, {
                method: "PATCH",
                headers: {
                  Accept: "application/json",
                  Authorization: token,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  leftovers_chars: {
                    day: leftoverChars.day,
                    week: leftoverChars.week,
                    month: leftoverChars.month,
                  },
                }),
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
            notification.value = "Errore nell'invio del post";
          });
      }

      publishPost();
    }

    function handleImageURLChange(event) {
      imageURL.value = event.target.value;
      if (event.target.value !== "" && !isImageCharsAdded) {
        letterCount.value += mediaChars;
        isImageCharsAdded = true;
        notification.value = "Immagine aggiunta +125 Caratteri";
        setTimeout(() => {
          notification.value = "";
        }, 2000);
      } else if (event.target.value === "") {
        letterCount.value -= mediaChars;
        isImageCharsAdded = false;
      }
    }

    function handleGeoCheckChange(event) {
      geoCheck.value = event.target.checked;
      if (event.target.checked) {
        geolocation.value = getLongAndLat();
        letterCount.value += mediaChars;
        notification.value = "Geolocalizzazione presa +125 Caratteri";
        setTimeout(() => {
          notification.value = "";
        }, 3000);
      } else letterCount.value -= mediaChars;
    }

    function getIncrementedLetterCount() {
      let increment = 0;
      if (isImageCharsAdded) increment += mediaChars;

      if (geoCheck.value) increment += mediaChars;
      return increment;
    }

    function handleTextChange(event) {
      letterCount.value =
        event.target.value.length + getIncrementedLetterCount();
      if (event.target.value.length > leftoverChars.day) {
        notification.value = "Hai superato il limite di caratteri";
      }
    }

    return {
      avatarPath,
      postContent,
      letterCount,
      imageURL,
      recipients,
      notification,
      geoCheck,
      leftoverChars,
      handlePublishClick,
      handleImageURLChange,
      handleGeoCheckChange,
      handleTextChange,
      user,
    };
  },
};
</script>
