import axios from "axios";
import { Alert, Platform } from "react-native";

import { getItem, removeItem, setItem } from "../utils/storage"
import { resetToLogin } from "../navigation/navigationRef";

const baseURL =
    Platform.OS === "android"
        ? "http://10.11.66.71:3000/api"
        : "http://localhost:3000/api";

const api = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (
            status === 401 &&
            (
                message === "jwt expired" ||
                message === "Invalid token" ||
                message === "No token provided"
            )
        ) {
            await removeItem("token");
            await removeItem("user");
            await removeItem("patientData");

            Alert.alert("Session Expired", "Please login again.");

            resetToLogin();
        }

        return Promise.reject(error);
    }
);

export default api;