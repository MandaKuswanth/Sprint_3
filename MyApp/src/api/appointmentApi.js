import api from "./axiosConfig";

export const getDoctors = async () => {
    const response = await api.get(
        "/patientAppointment-auth/doctors"
    );

    return response.data;
};

export const bookAppointment = async (appointmentData) => {
    const response = await api.post(
        "/patientAppointment-auth/patient-appointments",
        appointmentData
    );

    return response.data;
};

export const getMyAppointments = async () => {
    const response = await api.get(
        "/patientAppointment-auth/my-appointments"
    );

    return response.data;
};

export const updateAppointment = async (
    appointmentId,
    appointmentData
) => {
    const response = await api.put(
        `/patientAppointment-auth/patient-appointments/${appointmentId}`,
        appointmentData
    );

    return response.data;
};

export const cancelAppointment = async (
    appointmentId
) => {
    const response = await api.put(
        `/patientAppointment-auth/patient-appointments/${appointmentId}/cancel`,
        {}
    );

    return response.data;
};