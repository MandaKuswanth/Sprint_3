 import api from "../utils/api";

export const getDoctors = async (token) => {

    const response = await api.get(
        "/patientAppointment-auth/doctors",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const bookAppointment = async (
    appointmentData,
    token
) => {

    const response = await api.post(
        "patientAppointment-auth/patient-appointments",
        appointmentData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const getMyAppointments = async (
    token
) => {

    const response = await api.get(
        "patientAppointment-auth/my-appointments",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const updateAppointment = async (
    appointmentId,
    appointmentData,
    token
) => {

    const response = await api.put(
        `patientAppointment-auth/patient-appointments/${appointmentId}`,
        appointmentData,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const cancelAppointment = async (
    appointmentId,
    token
) => {

    const response = await api.put(
        `patientAppointment-auth/patient-appointments/${appointmentId}/cancel`,
        {},
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    return response.data;
};