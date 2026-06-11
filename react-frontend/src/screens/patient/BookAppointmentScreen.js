// src/screens/patient/BookAppointmentScreen.js

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import {
    getDoctors,
    bookAppointment,
} from "../../services/appointmentService";

import COLORS from "../../utils/colors";
import AppContainer from "../../components/AppContainer";
import AppCard from "../../components/AppCard";
import AppButton from "../../components/AppButton";
import AppAvatar from "../../components/AppAvatar";
import ScreenHeader from "../../components/ScreenHeader";
import AppInput from "../../components/AppInput";

const TIME_SLOTS = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
];

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

export default function BookAppointmentScreen({
    token,
    goBack,
    selectedDoctor: preselectedDoctor,
    goToMyAppointments,
}) {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(
        preselectedDoctor || null
    );
    const [search, setSearch] = useState("");
    const [date, setDate] = useState(getTomorrow());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeSlot, setTimeSlot] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDoctors();
    }, []);

    useEffect(() => {
        if (preselectedDoctor) {
            setSelectedDoctor(preselectedDoctor);
        }
    }, [preselectedDoctor]);

    const loadDoctors = async () => {
        try {
            const response = await getDoctors(token);
            setDoctors(response.data || []);
        } catch (err) {
            console.log("DOCTORS ERROR:", err);
            Alert.alert(
                "Error",
                err?.response?.data?.message || "Failed to load doctors"
            );
        }
    };

    const filteredDoctors = doctors.filter(
        (d) =>
            d.name?.toLowerCase().includes(search.toLowerCase()) ||
            d.specialization?.toLowerCase().includes(search.toLowerCase())
    );

    const availableSlots =
        Array.isArray(selectedDoctor?.availabilitySlots) &&
        selectedDoctor.availabilitySlots.length > 0
            ? selectedDoctor.availabilitySlots
            : TIME_SLOTS;

    const formatDate = (d) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
    };

    const handleBook = async () => {
        if (!token) {
            Alert.alert("Error", "Session expired. Please login again.");
            return;
        }

        if (!selectedDoctor) {
            Alert.alert("Error", "Please select a doctor");
            return;
        }

        if (!date) {
            Alert.alert("Error", "Please select appointment date");
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

        if (selectedDoctor.joiningDate) {
            const joiningDate = new Date(selectedDoctor.joiningDate);
            joiningDate.setHours(0, 0, 0, 0);

            if (selectedDate < joiningDate) {
                Alert.alert(
                    "Invalid Date",
                    "Appointment cannot be booked before doctor's joining date"
                );
                return;
            }
        }

        if (!timeSlot) {
            Alert.alert("Error", "Please select a time slot");
            return;
        }

        try {
            setLoading(true);

            await bookAppointment(
                {
                    doctorEmployeeId: selectedDoctor.employeeCode,
                    date: toApiDate(date),
                    timeSlot,
                    reason: reason.trim(),
                },
                token
            );

            Alert.alert(
                "Success",
                "Appointment request submitted successfully"
            );

            goBack();
        } catch (err) {
            Alert.alert(
                "Error",
                err?.response?.data?.message || "Unable to book appointment"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppContainer>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                <ScreenHeader
                    title="Appointments"
                    subtitle="Book and view your hospital appointments"
                />

                <View style={styles.tabContainer}>
                    <View style={[styles.tab, styles.tabActive]}>
                        <Text style={[styles.tabText, styles.tabTextActive]}>
                            Book Appointment
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.tab}
                        onPress={goToMyAppointments}
                    >
                        <Text style={styles.tabText}>My Appointments</Text>
                    </TouchableOpacity>
                </View>

                <AppCard style={styles.formCard}>
                    <Text style={styles.formTitle}>Book Appointment</Text>

                    {selectedDoctor && (
                        <View>
                            <Text style={styles.fieldLabel}>
                                Selected Doctor
                            </Text>

                            <View style={styles.selectedDoctorBox}>
                                <AppAvatar
                                    name={selectedDoctor.name}
                                    size={42}
                                />

                                <Text style={styles.sdName}>
                                    {selectedDoctor.name}
                                </Text>

                                <View style={styles.selectedBadge}>
                                    <Text style={styles.selectedBadgeText}>
                                        Selected
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedDoctor(null);
                                    setSearch("");
                                    setTimeSlot("");
                                }}
                            >
                                <Text
                                    style={{
                                        color: COLORS.primary,
                                        marginTop: 8,
                                        fontWeight: "600",
                                    }}
                                >
                                    Change Doctor
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {!selectedDoctor && (
                        <>
                            <Text style={styles.fieldLabel}>Choose Doctor</Text>

                            <AppInput
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Search by name or specialization"
                            />
                        </>
                    )}

                    {!selectedDoctor && search.length > 0 && (
                        <View style={styles.suggestBox}>
                            {filteredDoctors.slice(0, 5).map((d) => (
                                <TouchableOpacity
                                    key={d.employeeCode}
                                    style={styles.suggestItem}
                                    onPress={() => {
                                        setSelectedDoctor(d);
                                        setSearch("");
                                        setTimeSlot("");
                                    }}
                                >
                                    <Text style={styles.suggestName}>
                                        {d.name}
                                    </Text>

                                    <Text style={styles.suggestSpec}>
                                        {d.specialization}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            {filteredDoctors.length === 0 && (
                                <Text style={styles.noResults}>
                                    No doctors found
                                </Text>
                            )}
                        </View>
                    )}

                    <Text style={styles.fieldLabel}>Appointment Date</Text>

                    <TouchableOpacity
                        style={styles.dateBtn}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.dateBtnText}>
                            {formatDate(date)}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.dateHint}>Date format: YYYY-MM-DD</Text>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            minimumDate={getTomorrow()}
                            onChange={(event, selectedDate) => {
                                if (Platform.OS === "android") {
                                    setShowDatePicker(false);
                                }

                                if (selectedDate) {
                                    setDate(selectedDate);
                                    setTimeSlot("");
                                }

                                if (Platform.OS === "ios") {
                                    setShowDatePicker(false);
                                }
                            }}
                        />
                    )}

                    <Text style={styles.fieldLabel}>Available Time Slots</Text>

                    {selectedDoctor ? (
                        <View style={styles.slotsGrid}>
                            {availableSlots.map((slot) => (
                                <TouchableOpacity
                                    key={slot}
                                    style={[
                                        styles.slotChip,
                                        timeSlot === slot &&
                                            styles.slotChipActive,
                                    ]}
                                    onPress={() => setTimeSlot(slot)}
                                >
                                    <Text
                                        style={[
                                            styles.slotText,
                                            timeSlot === slot &&
                                                styles.slotTextActive,
                                        ]}
                                    >
                                        {slot}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.slotsEmpty}>
                            <Text style={styles.slotsEmptyText}>
                                Select doctor and date to view slots
                            </Text>
                        </View>
                    )}

                    <Text style={styles.fieldLabel}>Reason</Text>

                    <AppInput
                        value={reason}
                        onChangeText={setReason}
                        placeholder="Enter reason for visit"
                        multiline
                        numberOfLines={4}
                        style={{
                            minHeight: 100,
                            textAlignVertical: "top",
                        }}
                    />

                    <AppButton
                        title={loading ? "Booking..." : "Book Appointment"}
                        onPress={handleBook}
                        style={styles.bookBtn}
                        disabled={loading}
                    />
                </AppCard>
            </ScrollView>
        </AppContainer>
    );
}

const styles = StyleSheet.create({
    scroll: {
        paddingBottom: 40,
    },

    tabContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        backgroundColor: COLORS.white,
        borderRadius: 14,
        padding: 4,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    tabActive: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.subtitle,
    },
    tabTextActive: {
        color: "#fff",
    },

    formCard: {
        marginHorizontal: 20,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.text,
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 8,
        marginTop: 16,
    },

    selectedDoctorBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: COLORS.primaryMid,
        borderRadius: 14,
        padding: 12,
        backgroundColor: "#EEF4FF",
        gap: 12,
    },
    sdName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primaryMid,
    },
    selectedBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    selectedBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },

    suggestBox: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginTop: 4,
        overflow: "hidden",
    },
    suggestItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    suggestName: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.text,
    },
    suggestSpec: {
        fontSize: 13,
        color: COLORS.primaryMid,
        marginTop: 2,
    },
    noResults: {
        padding: 14,
        color: COLORS.subtitle,
        textAlign: "center",
    },

    dateBtn: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    dateBtnText: {
        fontSize: 15,
        color: COLORS.text,
        fontWeight: "500",
    },
    dateHint: {
        fontSize: 12,
        color: COLORS.subtitle,
        marginTop: 4,
    },

    slotsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    slotChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 50,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    slotChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    slotText: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.text,
    },
    slotTextActive: {
        color: "#fff",
    },
    slotsEmpty: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    slotsEmptyText: {
        color: COLORS.subtitle,
        fontSize: 14,
    },
    bookBtn: {
        marginTop: 24,
    },
});