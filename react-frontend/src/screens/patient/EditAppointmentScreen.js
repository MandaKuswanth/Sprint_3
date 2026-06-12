import React, { useState } from "react";

import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import {
    updateAppointment
} from "../../services/appointmentService";

import COLORS from "../../utils/colors";

import AppContainer from "../../components/AppContainer";
import AppCard from "../../components/AppCard";
import AppButton from "../../components/AppButton";
import ScreenHeader from "../../components/ScreenHeader";

const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
};

const toApiDate = (value) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export default function EditAppointmentScreen({
    appointment,
    token,
    goBack
}) {
    const [date, setDate] = useState(
        appointment?.date
            ? new Date(appointment.date)
            : getTomorrow()
    );

    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!token) {
            Alert.alert("Error", "Session expired. Please login again.");
            return;
        }

        if (!appointment?.appointmentId) {
            Alert.alert("Error", "Appointment ID missing");
            return;
        }

        if (appointment.status !== "PENDING") {
            Alert.alert(
                "Not Allowed",
                "Only pending appointments can be edited"
            );
            return;
        }

        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        const tomorrow = getTomorrow();

        if (selectedDate < tomorrow) {
            Alert.alert(
                "Invalid Date",
                "Appointments can be booked only from tomorrow onwards"
            );
            return;
        }

        try {
            setLoading(true);

            await updateAppointment(
                appointment.appointmentId,
                {
                    date: toApiDate(date),
                    timeSlot: appointment.timeSlot
                },
                token
            );

            Alert.alert(
                "Success",
                "Appointment updated successfully"
            );

            goBack();

        } catch (err) {
            Alert.alert(
                "Error",
                err?.response?.data?.message || "Update failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <AppContainer>
            <ScreenHeader
                title="Edit Appointment"
                subtitle="Update your appointment date"
                goBack={goBack}
            />

            <AppCard>
                <Text style={styles.label}>
                    Appointment Date
                </Text>

                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowPicker(true)}
                    disabled={loading}
                >
                    <Text style={styles.dateText}>
                        📅 {date.toDateString()}
                    </Text>
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        minimumDate={getTomorrow()}
                        onChange={(event, selectedDate) => {
                            setShowPicker(false);

                            if (selectedDate) {
                                setDate(selectedDate);
                            }
                        }}
                    />
                )}

                <AppButton
                    title={
                        loading
                            ? "Updating..."
                            : "Update Appointment"
                    }
                    onPress={handleUpdate}
                    style={styles.button}
                    disabled={loading}
                />
            </AppCard>
        </AppContainer>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: 10
    },

    dateButton: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 16,
        backgroundColor: COLORS.white
    },

    dateText: {
        color: COLORS.text,
        fontSize: 15,
        fontWeight: "600"
    },

    button: {
        marginTop: 25
    }
});