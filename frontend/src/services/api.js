import axios from "axios";

const API = axios.create({
    baseURL: "https://sfswitch-4tts.onrender.com"
});

export default API;
