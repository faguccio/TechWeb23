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
               <div class="ml-2 font-bold">D: {{ leftoverChars.day }} W: {{ leftoverChars.week }} M: {{ leftoverChars.month
               }}</div>
            </div>
         </div>
         <div class="text-right mb-2"><span>Conteggio lettere: {{ letterCount }}</span></div>
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
import axios from "axios";

export default {
   data() {
      return {
         avatarPath: 'https://placekitten.com/100/100',
         postContent: '',
         letterCount: 0,
         imageURL: '',
         recipients: '',
         notification: null,
         geoCheck: false,
         latitude: 0,
         longitude: 0,
         leftoverChars: { day: 0, week: 0, month: 0 },
         user: null,
         token: localStorage.token
      };
   },
   methods: {
      async fetchUser() {
         try {
            const response = await axios.get(`${Const.apiurl}/user/${this.user.managing}`, {
               headers: { Authorization: this.token },
            });
            this.user = response.data;
            this.leftoverChars = this.user.leftovers_chars;
            if (this.user.propic_path !== '') {
               this.avatarPath = this.user.propic_path;
            }
         } catch (error) {
            console.error(error);
         }
      },
      async getLongAndLat() {
         return new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
         ).then(({ coords }) => ({ lat: coords.latitude, lon: coords.longitude }));
      },
      async handlePublishClick() {
         if (this.letterCount > this.leftoverChars.day) {
            this.notification = 'Non hai caratteri sufficienti per pubblicare';
            return;
         }
         let geo = this.geoCheck ? await this.getLongAndLat() : { lat: 0, lon: 0 };
         this.latitude = geo.lat;
         this.longitude = geo.lon;
         const newPost = {
            sender: this.user.managing,
            recipients: this.recipients ? this.recipients.split(',') : [],
            text: this.postContent,
            timestamp: new Date(),
            image_path: this.imageURL ? this.imageURL : [],
            geolocation: geo,
            reactions: { positive: 0, negative: 0 },
         };
         try {
            let response = await axios.post(`${Const.apiurl}/post`, newPost, {
               headers: {
                  Accept: 'application/json',
                  Authorization: this.token,
                  'Content-Type': 'application/json',
               },
            });
            if (response.ok) {
               this.postContent = '';
               this.imageURL = '';
               this.latitude = 0;
               this.longitude = 0;
               this.recipients = '';
               this.notification = 'Post inviato con successo';
               const updatedChars = { ...this.leftoverChars };
               updatedChars.day -= this.letterCount;
               updatedChars.week -= this.letterCount;
               updatedChars.month -= this.letterCount;
               this.leftoverChars = updatedChars;
               response = await axios.patch(`${Const.apiurl}/user`, { leftovers_chars: updatedChars }, {
                  headers: {
                     Accept: 'application/json',
                     Authorization: this.token,
                     'Content-Type': 'application/json',
                  },
               });
               if (response.ok) {
                  console.log('Numero di caratteri giornalieri aggiornato con successo');
               } else {
                  throw new Error("Errore nell'aggiornamento del numero di caratteri giornalieri");
               }
            } else {
               throw new Error('Errore nell\'invio del post');
            }
         } catch (error) {
            console.error(error);
            this.notification = 'Errore nell\'invio del post';
         }
      },
   },
   watch: {
      postContent() {
         this.letterCount = this.postContent.replace(/\s/g, '').length;
      },
   },
   created() {
      this.fetchUser();
   },
};
</script>
