import axios from "axios";

const api = axios.create({
    baseURL: "http://10.11.68.109:3000/api",
    headers: {
        "Content-Type": "application/json"
    },
});

export default api;
