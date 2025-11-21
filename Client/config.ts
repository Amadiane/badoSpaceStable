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



// config.ts

// 🔍 Détecter si on est en local (PC ou mobile)
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168."));

// 🖥️ Backend local
const LOCAL_BASE_URL = "http://192.168.1.189:8000/api";

// 🌍 Backend production (Render)
const PROD_BASE_URL = "https://badospace.onrender.com/api";

// ✔️ Sélection automatique (AUCUNE variable DEV)
export const BASE_URL = isLocal ? LOCAL_BASE_URL : PROD_BASE_URL;

export default {
  BASE_URL,
  ENDPOINTS: {
    MESSAGES: `${BASE_URL}/messages/`,
    CONVERSATIONS: `${BASE_URL}/conversations/`,
  },
};
