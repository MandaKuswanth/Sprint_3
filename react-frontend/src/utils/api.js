import axios from "axios";

const api = axios.create({
    baseURL: "http://10.11.76.142:3000/api",
    headers: {
        "Content-Type": "application/json"
    },
});

export default api;
