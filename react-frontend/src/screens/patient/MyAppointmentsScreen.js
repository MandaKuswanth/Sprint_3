// src/screens/patient/MyAppointmentsScreen.js

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";

import {
    getMyAppointments,
    cancelAppointment,
} from "../../services/appointmentService";

import COLORS from "../../utils/colors";
import AppCard from "../../components/AppCard";
import AppButton from "../../components/AppButton";
import AppContainer from "../../components/AppContainer";
import ScreenHeader from "../../components/ScreenHeader";
import AppInput from "../../components/AppInput";

export default function MyAppointmentsScreen({
    token,
    goBack,
    goToBookAppointment,
    goToEditAppointment,
}) {
    const [tab, setTab] = useState("my");   // "book" | "my"
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const response = await getMyAppointments(token);
            setAppointments(response.data); // ✅ same structure
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (appointmentId) => {
        Alert.alert(
            "Cancel Appointment",
            "Are you sure you want to cancel this appointment?",
            [
                { text: "No" },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            await cancelAppointment(appointmentId, token);
                            Alert.alert("Success", "Appointment cancelled");
                            loadAppointments();
                        } catch (err) {
                            Alert.alert(
                                "Error",
                                err?.response?.data?.message ||
                                "Unable to cancel appointment"
                            );
                        }
                    },
                },
            ]
        );
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "BOOKED":
                return {
                    bg: COLORS.bookedLight,
                    text: COLORS.booked,
                };
            case "PENDING":
                return { bg: "#FEF3C7", text: "#D97706" };
            case "COMPLETED":
                return { bg: COLORS.primaryLight, text: COLORS.primaryMid };
            case "CANCELLED":
                return { bg: COLORS.dangerLight, text: COLORS.danger };
            default:
                return { bg: "#F1F5F9", text: COLORS.subtitle };
        }
    };

    return (
        <AppContainer>
            {/* Page title */}
            <ScreenHeader
                title="Appointments"
                subtitle="Book and view your hospital appointments"
            />

            {/* Tab switcher */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        tab === "book" && styles.tabActive,
                    ]}
                    onPress={() => {
                        setTab("book");
                        goToBookAppointment && goToBookAppointment();
                    }}
                >
                    <Text
                        style={[
                            styles.tabText,
                            tab === "book" && styles.tabTextActive,
                        ]}
                    >
                        Book Appointment
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        tab === "my" && styles.tabActive,
                    ]}
                    onPress={() => setTab("my")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            tab === "my" && styles.tabTextActive,
                        ]}
                    >
                        My Appointments
                    </Text>
                </TouchableOpacity>
            </View>

            {/* List header */}
            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>My Appointments</Text>
                <Text style={styles.listCount}>
                    {appointments.length} total
                </Text>
            </View>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.appointmentId?.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            No appointments found
                        </Text>
                    }
                    renderItem={({ item }) => {
                        const statusStyle = getStatusStyle(item.status);
                        return (
                            <AppCard style={styles.apptCard}>
                                {/* Top row */}
                                <View style={styles.apptTop}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.doctorName}>
                                            Dr. {item.doctorName}
                                        </Text>
                                        <Text style={styles.apptDate}>
                                            {new Date(
                                                item.date
                                            ).toDateString()}{" "}
                                            • {item.timeSlot}
                                        </Text>
                                        {item.reason ? (
                                            <Text style={styles.apptReason}>
                                                {item.reason}
                                            </Text>
                                        ) : null}
                                    </View>

                                    <View
                                        style={[
                                            styles.statusBadge,
                                            {
                                                backgroundColor:
                                                    statusStyle.bg,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                { color: statusStyle.text },
                                            ]}
                                        >
                                            {item.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* Action buttons */}
                                {(item.status === "PENDING" ||
                                    (item.status !== "CANCELLED" &&
                                        item.status !== "COMPLETED")) && (
                                        <View style={styles.btnRow}>
                                            {item.status === "PENDING" && (
                                                <View style={{ flex: 1 }}>
                                                    <AppButton
                                                        title="Edit"
                                                        onPress={() =>
                                                            goToEditAppointment &&
                                                            goToEditAppointment(
                                                                item
                                                            )
                                                        }
                                                        style={styles.actionBtn}
                                                    />
                                                </View>
                                            )}
                                            <View style={{ flex: 1 }}>
                                                <AppButton
                                                    title="Cancel"
                                                    color={COLORS.dangerLight}
                                                    textColor={COLORS.danger}
                                                    onPress={() =>
                                                        handleCancel(
                                                            item.appointmentId
                                                        )
                                                    }
                                                    style={styles.actionBtn}
                                                />
                                            </View>
                                        </View>
                                    )}
                            </AppCard>
                        );
                    }}
                />
            )}
        </AppContainer>
    );
}

const styles = StyleSheet.create({

    /* tab switcher */
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

    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.text,
    },
    listCount: {
        fontSize: 13,
        color: COLORS.subtitle,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    apptCard: {
        marginBottom: 12,
        paddingVertical: 16,
    },
    apptTop: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
    },
    doctorName: {
        fontSize: 17,
        fontWeight: "700",
        color: COLORS.text,
    },
    apptDate: {
        fontSize: 13,
        color: COLORS.subtitle,
        marginTop: 4,
    },
    apptReason: {
        fontSize: 13,
        color: COLORS.text,
        marginTop: 6,
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        alignSelf: "flex-start",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },

    btnRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 14,
    },
    actionBtn: {
        paddingVertical: 11,
    },

    emptyText: {
        textAlign: "center",
        marginTop: 50,
        color: COLORS.subtitle,
        fontSize: 15,
    },
});