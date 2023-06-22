<template>
   <div class="flex justify-center">
      <div class="max-w-xl w-full bg-white shadow-md rounded-md p-4">
         <h1 class="text-2xl font-bold mb-4 text-center">Scrivi un nuovo Squeal!</h1>
         <div class="flex items-center mb-4">
            <img class="w-10 h-10 rounded-full mr-3" :src="avatarPath" alt="User Avatar" />
            <div class="flex-1 relative">
               <input class="border border-gray-300 outline-none w-full p-2 mb-2" type="text"
                  placeholder="Inserisci URL dell'immagine" v-model="imageURL" @input="handleImageURLChange" />
               <input class="border border-gray-300 outline-none w-full p-2 mb-2" type="text"
                  placeholder="Inserisci destinatari (separati da virgole)" v-model="recipients" />
               <textarea class="border border-gray-300 outline-none w-full p-2" placeholder="Scrivi un nuovo..."
                  v-model="postContent"></textarea>
               <label for="geoCheck" class="flex items-center mt-2">
                  <input id="geoCheck" type="checkbox" class="mr-1" v-model="geoCheck" @change="handleGeoCheckChange" />
                  Includi geolocalizzazione
               </label>
               <h2>Caratteri Rimanenti</h2>
               <div class="ml-2 button teal font-bold">
                  Giorno: {{ leftoverChars.day }} Settimana: {{ leftoverChars.week }} Mese: {{ leftoverChars.month }}
               </div>
            </div>
         </div>
         <div class="text-right mb-2">
            <span>Conteggio lettere: {{ letterCount }}</span>
         </div>
         <div class="flex justify-end">
            <button class="btn btn-primary" @click="handlePublishClick">Pubblica</button>
         </div>
         <div v-if="notification" class="text-center mt-4">
            <p v-if="notification.includes('success')" class="text-green-500">{{ notification }}</p>
            <p v-else class="text-red-500">{{ notification }}</p>
         </div>
      </div>
   </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useQuery } from 'vue-query';
import { Const } from '../utils';

export default {
   name: 'NewPostPage',
   setup() {
      const token = localStorage.token;
      const avatarPath = ref('https://placekitten.com/100/100');
      const postContent = ref('');
      const letterCount = ref(0);
      const imageURL = ref('');
      const recipients = ref('');
      const notification = ref(null);
      const geoCheck = ref(false);
      const latitude = ref(0);
      const longitude = ref(0);
      const leftoverChars = reactive({ day: 0, week: 0, month: 0 });

      async function fetchUser() {
         const response = await fetch(`${Const.apiurl}/user`, {
            method: 'GET',
            headers: {
               Authorization: localStorage.tokenPro
            },
         });
         const userData = await res.json();
         leftoverChars.day = userData.leftovers_chars.day;
         leftoverChars.week = userData.leftovers_chars.week;
         leftoverChars.month = userData.leftovers_chars.month;
         return userData;
      };

      async function fetchUserManaged() {
         const response = await fetch(`${Const.apiurl}/userManager/vip`, {
            method: 'GET',
            headers: {
               Authorization: localStorage.tokenPro
            },
         });
         return await response.json();
      }
      
      const { data: user } = useQuery('user', fetchUser);

      onMounted(() => {
         if (user) {
            if (user.propic_path !== '') {
               avatarPath.value = user.propic_path;
            }
         }
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
            notification.value = 'Non hai caratteri sufficienti per pubblicare';
            return;
         }

         async function publishPost() {
            let geo = geoCheck.value ? await getLongAndLat() : { lat: 0, lon: 0 };
            latitude.value = geo.lat;
            longitude.value = geo.lon;

            const newPost = {
               sender: user._id,
               recipients: recipients.value ? recipients.value.split(',') : [],
               text: postContent.value,
               timestamp: new Date(),
               image_path: imageURL.value ? imageURL.value : [],
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
               .then(async (response) => {
                  if (response.ok) {
                     postContent.value = '';
                     imageURL.value = '';
                     latitude.value = 0;
                     longitude.value = 0;
                     recipients.value = '';
                     notification.value = 'Post inviato con successo';
                     const updatedChars = { ...leftoverChars };
                     updatedChars.day -= letterCount.value;
                     updatedChars.week -= letterCount.value;
                     updatedChars.month -= letterCount.value;
                     leftoverChars.day = updatedChars.day;
                     leftoverChars.week = updatedChars.week;
                     leftoverChars.month = updatedChars.month;
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

      function handleImageURLChange(e) {
         imageURL.value = e.target.value;
         if (e.target.value !== '') {
            notification.value = 'Immagine aggiunta +125 Caratteri';
         }
      }

      function handleGeoCheckChange(e) {
         geoCheck.value = e.target.checked;
         if (e.target.checked) {
            notification.value = 'Geolocalizzazione presa +125 Caratteri';
         }
      }

      const updateLetterCount = () => {
         let count = postContent.value.replace(/\s/g, '').length;
         if (imageURL.value !== '') {
            count += 125;
         }
         if (geoCheck.value) {
            count += 125;
         }
         letterCount.value = count;
      };

      return {
         avatarPath,
         postContent,
         letterCount,
         imageURL,
         recipients,
         notification,
         geoCheck,
         latitude,
         longitude,
         leftoverChars,
         handlePublishClick,
         handleImageURLChange,
         handleGeoCheckChange,
         updateLetterCount,
      };
   },
};
</script>

