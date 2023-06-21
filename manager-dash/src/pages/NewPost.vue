<template>
   <div class="flex justify-center">
      <div class="max-w-xl w-full bg-white shadow-md rounded-md p-4">
         <h1 class="text-2xl font-bold mb-4 text-center">Scrivi un nuovo Squeal!</h1>
         <div class="flex items-center mb-4">
            <img class="w-10 h-10 rounded-full mr-3" :src="avatarPath" alt="User Avatar" />
            <div class="flex-1 relative">
               <input class="border border-gray-300 outline-none w-full p-2 mb-2" type="text"
                  placeholder="Inserisci URL dell'immagine" v-model="imageURL" />
               <input class="border border-gray-300 outline-none w-full p-2 mb-2" type="text"
                  placeholder="Inserisci destinatari (separati da virgole)" v-model="recipients" />
               <textarea class="border border-gray-300 outline-none w-full p-2" placeholder="Scrivi un nuovo..."
                  v-model="postContent"></textarea>
               <label for="geoCheck" class="flex items-center mt-2">
                  <input id="geoCheck" type="checkbox" class="mr-1" v-model="geoCheck" />
                  Includi geolocalizzazione
               </label>
            </div>
         </div>
         <div class="text-right mb-2">
            <span>Conteggio lettere: {{ letterCount }}</span>
         </div>
         <div class="flex justify-end">
            <button class="btn btn-primary" @click="handlePublishClick">
               Pubblica
            </button>
         </div>
         <div class="text-center mt-4" v-if="notification">
            <p :class="notification.includes('success') ? 'text-green-500' : 'text-red-500'">
               {{ notification }}
            </p>
         </div>
      </div>
   </div>
</template>

<script>
import { reactive, computed, ref, onMounted } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { Const } from '../utils';

export default {
   name: 'NewPostPage',
   setup() {
      const avatarPath = ref('https://placekitten.com/100/100');
      const postContent = ref('');
      const letterCount = ref(0);
      const imageURL = ref('');
      const recipients = ref('');
      const notification = ref(null);
      const geoCheck = ref(false);
      const latitude = ref(0);
      const longitude = ref(0);

      const userID = localStorage.getItem('userID')?.toString();

      const fetchUser = async () => {
         const res = await fetch(`${Const.apiurl}/user/${userID}`);
         return await res.json();
      };

      const { data: user } = useQuery(['user', userID], fetchUser);

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
         if (letterCount.value > user.leftovers_chars.day) {
            notification.value = "Non hai caratteri sufficienti per pubblicare";
            return;
         }

         async function publishPost() {
            let geo = geoCheck.value ? await getLongAndLat() : { lat: 0, lon: 0 };
            latitude.value = geo.lat;
            longitude.value = geo.lon;

            const newPost = {
               sender: localStorage.getItem('userID'),
               recipients: recipients.value.split(','),
               text: postContent.value,
               timestamp: new Date(),
               image_path: imageURL.value,
               geolocation: geo,
               reactions: { positive: 0, negative: 0 },
            };

            fetch(`${Const.apiurl}/post`, {
               method: 'POST',
               headers: {
                  Accept: 'application/json',
                  Authorization: localStorage.token,
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(newPost),
            })
               .then((response) => {
                  if (response.ok) {
                     postContent.value = '';
                     imageURL.value = '';
                     latitude.value = 0;
                     longitude.value = 0;
                     recipients.value = '';
                     notification.value = 'Post inviato con successo';
                     const updatedChars = { ...user.leftovers_chars };
                     updatedChars.day -= letterCount.value;
                     updatedChars.week -= letterCount.value;
                     updatedChars.month -= letterCount.value;
                     fetch(`${Const.apiurl}/user/${localStorage.getItem('userID')}`, {
                        method: 'PATCH',
                        headers: {
                           Accept: 'application/json',
                           Authorization: localStorage.token,
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
                  notification.value = 'Errore nell\'invio del post';
               });
         }

         publishPost();
      }

      const updateLetterCount = () => {
         let count = postContent.value.replace(/\s/g, '').length;
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
         handlePublishClick,
         updateLetterCount
      };
   },
};
</script>
