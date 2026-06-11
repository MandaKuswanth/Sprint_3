import api from "./axiosConfig"
export const registerPatient = async (patientData) => {
    const response = await api.post("/patient-auth/register", patientData);
    return response.data;
};

export const loginPatient = async (loginData) => {
    const response = await api.post("/patient-auth/login", loginData);
    return response.data;
};