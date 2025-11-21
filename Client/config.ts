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


// 🔍 Local uniquement si hostname = localhost OU 127.0.0.1
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// 🖥️ Backend local
const LOCAL_BASE_URL = "http://192.168.1.189:8000/api";

// 🌍 Backend production (Render)
const PROD_BASE_URL = "https://badospace.onrender.com/api";

// ✔️ Toujours PROD en HTTPS sauf localhost
export const BASE_URL = isLocal ? LOCAL_BASE_URL : PROD_BASE_URL;

export default {
  BASE_URL,
  ENDPOINTS: {
    MESSAGES: `${BASE_URL}/messages/`,
    CONVERSATIONS: `${BASE_URL}/conversations/`,
  },
};
