<template>
  <div class="flex justify-center">
    <div class="max-w-xl w-full bg-white shadow-md rounded-md p-4">
      <h1 class="text-2xl font-bold mb-4 text-center">Scrivi un nuovo Squeal!</h1>
      <div class="flex items-center mb-4">
        <img class="w-10 h-10 rounded-full mr-3" :src="avatarPath" alt="User Avatar" />
        <div class="flex-1 relative">
          <img class="w-full rounded-md mb-2" v-if="imageLoaded" :src="imagePath" alt="Uploaded Image" />
          <textarea
            class="border border-gray-300 outline-none w-full p-2"
            placeholder="Scrivi un nuovo..."
            v-model="postContent"
          ></textarea>
        </div>
      </div>
      <div class="text-right mb-2">
        <span>Conteggio lettere: {{ letterCount }}</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <label for="latitude-input">Latitudine:</label>
        <input
          id="latitude-input"
          type="number"
          step="0.000001"
          v-model.number="latitude"
        />
      </div>
      <div class="flex justify-between items-center mb-4">
        <label for="longitude-input">Longitudine:</label>
        <input
          id="longitude-input"
          type="number"
          step="0.000001"
          v-model.number="longitude"
        />
      </div>
      <div class="flex justify-between items-center">
        <div>
          <label for="image-upload" class="cursor-pointer">
            <span class="text-blue-500">+</span> Carica immagine
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />
        </div>
        <div v-if="imageLoaded" class="text-green-500">Immagine caricata (125 caratteri)</div>
      </div>
      <div class="flex justify-end">
        <button class="btn btn-primary" @click="handlePublishClick">Pubblica</button>
      </div>
      <div class="text-center mt-4" v-if="notification">
        <p v-if="notification.includes('success')" class="text-green-500">{{ notification }}</p>
        <p v-else class="text-red-500">{{ notification }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useQuery } from "react-query";
import {Const} from '../utils.js';

export default {
    name: "NewPostPage",
    setup() {
        const avatarPath = ref("https://placekitten.com/100/100");
        const postContent = ref("");
        const letterCount = ref(0);
        const imagePath = ref("");
        const imageLoaded = ref(false);
        const notification = ref(null);
        const latitude = ref(0);
        const longitude = ref(0);

        const userID = localStorage.getItem("userID")?.toString();

        const fetchUser = async () => {
            const res = await fetch(`${Const.apiurl}/user/${userID}`);
            return await res.json();
        };

        const { data: user } = useQuery(["user", userID], fetchUser);

        onMounted(() => {
            const resetDailyChars = () => {
                const now = new Date();
                const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                const timeToReset = nextDay.getTime() - now.getTime();
                setTimeout(() => {
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
        });

        onMounted(() => {
            if (user) {
                if (user.propic_path !== "") {
                    avatarPath.value = user.propic_path;
                }
            }
        });

        const handlePublishClick = () => {
            if (letterCount.value > user.leftovers_chars.day) {
                notification.value = "Non hai caratteri sufficienti per pubblicare";
                return;
            }

            const regexRecipients = /§(\w+)/g;
            const regexHashtags = /#(\w+)/g;
            const regexMentions = /@(\w+)/g;

            const recipients = [];
            const hashtags = [];
            const mentions = [];

            let match;
            while ((match = regexRecipients.exec(postContent.value))) {
                recipients.push(match[1]);
            }

            while ((match = regexHashtags.exec(postContent.value))) {
                hashtags.push(match[1]);
            }

            while ((match = regexMentions.exec(postContent.value))) {
                mentions.push(match[1]);
            }

            recipients.push(...hashtags, ...mentions);
            console.log({ recipients });

            const newPost = {
                sender: localStorage.getItem("userID"),
                recipients: recipients,
                text: postContent.value,
                timestamp: new Date(),
                image_path: imagePath.value,
                geolocation: { lat: latitude.value, lon: longitude.value },
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
                        postContent.value = "";
                        imagePath.value = "";
                        imageLoaded.value = false;
                        latitude.value = 0;
                        longitude.value = 0;
                        notification.value = "Post inviato con successo";
                        const updatedChars = { ...user.leftovers_chars };
                        updatedChars.day -= letterCount.value;
                        updatedChars.week -= letterCount.value;
                        updatedChars.month -= letterCount.value;
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
                                    console.log("Numero di caratteri giornalieri aggiornato con successo");
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
        };

        watch([postContent, imageLoaded], () => {
            let count = postContent.value.replace(/\s/g, "").length;
            if (imageLoaded.value) {
                count += 125;
            }
            letterCount.value = count;
        });

        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    imagePath.value = reader.result;
                    imageLoaded.value = true;
                };
                reader.readAsDataURL(file);
            }
        };

        return {
            avatarPath,
            postContent,
            letterCount,
            imagePath,
            imageLoaded,
            notification,
            latitude,
            longitude,
            user,
            handlePublishClick,
            handleImageUpload,
        };
    },
};
</script>

<template>
    <div class="flex justify-center">
        <div class="max-w-xl w-full bg-white shadow-md rounded-md p-4">
            <h1 class="text-2xl font-bold mb-4 text-center">Scrivi un nuovo Squeal!</h1>
            <div class="flex items-center mb-4">
                <img class="w-10 h-10 rounded-full mr-3" :src="avatarPath" alt="User Avatar" />
                <div class="flex-1 relative">
                    <img v-if="imageLoaded" class="w-full rounded-md mb-2" :src="imagePath" alt="Uploaded Image" />
                    <textarea class="border border-gray-300 outline-none w-full p-2" placeholder="Scrivi un nuovo..."
                        v-model="postContent"></textarea>
                </div>
            </div>
            <div class="text-right mb-2">
                <span>Conteggio lettere: {{ letterCount }}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
                <label for="latitude-input">Latitudine:</label>
                <input id="latitude-input" type="number" step="0.000001" v-model.number="latitude" />
            </div>
            <div class="flex justify-between items-center mb-4">
                <label for="longitude-input">Longitudine:</label>
                <input id="longitude-input" type="number" step="0.000001" v-model.number="longitude" />
            </div>
            <div class="flex justify-between items-center">
                <div>
                    <label for="image-upload" class="cursor-pointer">
                        <span class="text-blue-500">+</span> Carica immagine
                    </label>
                    <input id="image-upload" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                </div>
                <div v-if="imageLoaded" class="text-green-500">Immagine caricata (125 caratteri)</div>
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
