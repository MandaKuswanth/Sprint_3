import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
    baseURL: "http://10.11.76.142:3000/api",
=======
    baseURL: "http://10.11.66.173:3000/api",
>>>>>>> 992b119a6580817367f1202bb228f7705ae47160
    headers: {
        "Content-Type": "application/json"
    },
});

export default api;
