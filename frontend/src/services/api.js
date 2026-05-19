import axios from "axios";

const API = axios.create({
    baseURL: "/auth"
});

export default API;