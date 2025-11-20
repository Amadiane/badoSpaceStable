// config.ts
const DEV = false; // true = développement local, false = production

// 🔹 URL de ton backend local (Django)
const LOCAL_BASE_URL = "http://192.168.1.189:8000/api"; // remplace par ton IP PC si tu testes sur téléphone

// 🔹 URL de ton backend en production (Render ou autre)
const PROD_BASE_URL = "https://badospace.onrender.com/api";

const BASE_URL = DEV ? LOCAL_BASE_URL : PROD_BASE_URL;

export default {
  BASE_URL,
  ENDPOINTS: {
    MESSAGES: `${BASE_URL}/messages/`,
    CONVERSATIONS: `${BASE_URL}/conversations/`,
  },
};
