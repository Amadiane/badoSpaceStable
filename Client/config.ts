// // config.ts
// const DEV = false; // true = développement local, false = production

// // 🔹 URL de ton backend local (Django)
// const LOCAL_BASE_URL = "http://192.168.1.189:8000/api"; // remplace par ton IP PC si tu testes sur téléphone

// // 🔹 URL de ton backend en production (Render ou autre)
// const PROD_BASE_URL = "https://badospace.onrender.com/api";

// const BASE_URL = DEV ? LOCAL_BASE_URL : PROD_BASE_URL;

// export default {
//   BASE_URL,
//   ENDPOINTS: {
//     MESSAGES: `${BASE_URL}/messages/`,
//     CONVERSATIONS: `${BASE_URL}/conversations/`,
//   },
// };

// ------------------------------------------------------
// 🔥 Détection automatique : local vs production
// ------------------------------------------------------
const IS_LOCAL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.startsWith("192.168.");

// ------------------------------------------------------
// 🌍 URLs Backend
// ------------------------------------------------------
const LOCAL_BASE_URL = "http://192.168.1.189:8000"; // Django local
const PROD_BASE_URL = "https://badospace.onrender.com"; // Backend Render

// 👉 Choix automatique
const BASE_URL = IS_LOCAL ? LOCAL_BASE_URL : PROD_BASE_URL;

// ------------------------------------------------------
// 📌 ENDPOINTS API
// ------------------------------------------------------
const CONFIG = {
  BASE_URL,

  // 💬 Chat
  API_MESSAGES: `${BASE_URL}/api/messages/`,
  API_CONVERSATIONS: `${BASE_URL}/api/conversations/`,

  // Tu peux ajouter ici les autres endpoints si tu veux plus tard
};

export default CONFIG;
