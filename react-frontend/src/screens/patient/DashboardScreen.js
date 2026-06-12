import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
} from "react-native";

import AppAvatar from "../../components/AppAvatar";
import AppContainer from "../../components/AppContainer";
import AppCard from "../../components/AppCard";
import AppInput from "../../components/AppInput";

import COLORS from "../../utils/colors";

export default function DashboardScreen({
    patient,
    logout,
    goToProfile,
    goToBookAppointment,
    goToMyAppointments,
    doctors = [],              // pass your doctor list from parent/navigator
}) {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    console.log("Doctors received:", doctors);
console.log("Doctors length:", doctors.length);

    const specializations = [
        "All",
        ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
    ];

    const filteredDoctors = doctors.filter((d) => {
        console.log("Checking doctor:", d);

        const matchSearch =
            d.name?.toLowerCase().includes(search.toLowerCase()) ||
            d.specialization?.toLowerCase().includes(search.toLowerCase());

        const matchFilter =
            activeFilter === "All" ||
            d.specialization === activeFilter;

        console.log({
            doctor: d.name,
            specialization: d.specialization,
            matchSearch,
            matchFilter,
        });

        return matchSearch && matchFilter;
    });

    const initials = patient?.name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    console.log("===== DASHBOARD DEBUG =====");
    console.log("Doctors received:", doctors);
    console.log("Doctors count:", doctors?.length);

    console.log("Search text:", search);
    console.log("Active filter:", activeFilter);

    console.log(
        "Specializations:",
        doctors.map((d) => d.specialization)
    );

    console.log("Filtered doctors:", filteredDoctors);

    if (doctors.length > 0) {
        console.log("First doctor object:", doctors[0]);
        console.log("Doctor keys:", Object.keys(doctors[0]));
    }
    console.log("Doctors:", doctors);
    console.log("Is array:", Array.isArray(doctors));

    if (Array.isArray(doctors) && doctors.length > 0) {
        console.log("First doctor:", doctors[0]);
        console.log("Qualification:", doctors[0].qualification);
    }

    return (
        <AppContainer>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {/* ── Top bar ── */}
                <View style={styles.topBar}>
                    <View>
                        <Text style={styles.greeting}>Good day,</Text>
                        <Text style={styles.screenTitle}>Patient Record</Text>
                    </View>
                    <TouchableOpacity onPress={goToProfile}>
                        <AppAvatar
                            name={patient?.name}
                            size={46}
                        />
                    </TouchableOpacity>
                </View>

                {/* ── UHID card ── */}
                <AppCard style={styles.uhidCard}>
                    <View style={styles.uhidRow}>
                        <View>
                            <Text style={styles.uhidLabel}>Patient UHID</Text>
                            <Text style={styles.uhidValue}>{patient?.UHID}</Text>
                        </View>
                        <View style={styles.activeBadge}>
                            <Text style={styles.activeText}>Active</Text>
                        </View>
                    </View>
                </AppCard>

                {/* ── Quick action cards ── */}
                <View style={styles.quickRow}>
                    <TouchableOpacity
                        style={styles.quickCard}
                        onPress={goToBookAppointment}
                        activeOpacity={0.8}
                    >
                        <AppCard style={styles.quickCardInner}>
                            <Text style={styles.quickIcon}>＋</Text>
                            <Text style={styles.quickTitle}>Book</Text>
                            <Text style={styles.quickSub}>Appointment</Text>
                        </AppCard>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickCard}
                        onPress={goToMyAppointments}
                        activeOpacity={0.8}
                    >
                        <AppCard style={styles.quickCardInner}>
                            <Text style={styles.quickIcon}>📋</Text>
                            <Text style={styles.quickTitle}>My</Text>
                            <Text style={styles.quickSub}>Appointments</Text>
                        </AppCard>
                    </TouchableOpacity>
                </View>

                {/* ── Find a Doctor ── */}
                <AppCard style={styles.findCard}>
                    <Text style={styles.sectionTitle}>Find a Doctor</Text>
                    <Text style={styles.sectionSub}>
                        Search by doctor name or specialization
                    </Text>

                    <AppInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search doctors, e.g. Cardiology"
                    />
                </AppCard>

                {/* ── Specialization filters ── */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {specializations.map((spec) => (
                        <TouchableOpacity
                            key={spec}
                            onPress={() => setActiveFilter(spec)}
                            style={[
                                styles.filterChip,
                                activeFilter === spec && styles.filterChipActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === spec && styles.filterTextActive,
                                ]}
                            >
                                {spec}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* ── Doctor list ── */}
                <View style={styles.doctorsHeader}>
                    <Text style={styles.sectionTitle}>Available Doctors</Text>
                    <Text style={styles.countText}>
                        {filteredDoctors.length} found
                    </Text>
                </View>

                {filteredDoctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.employeeCode}
                        doctor={doctor}
                        onBook={() => goToBookAppointment?.(doctor)}
                    />
                ))}

                {filteredDoctors.length === 0 && (
                    <Text style={styles.emptyText}>No doctors found</Text>
                )}
            </ScrollView>
        </AppContainer>
    );
}

function DoctorCard({ doctor, onBook }) {
    const initials = doctor.name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <AppCard style={styles.doctorCard}>
            {/* Header row */}
            <View style={styles.doctorTop}>
                <AppAvatar
                    name={doctor.name}
                    size={52}
                    backgroundColor={COLORS.primaryLight}
                    textColor={COLORS.primary}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <Text style={styles.doctorSpec}>{doctor.specialization}</Text>
                </View>
            </View>

            {/* Info rows */}
            <View style={styles.doctorInfoBox}>
                <View style={styles.doctorInfoRow}>
                    <Text style={styles.doctorInfoLabel}>Qualification</Text>
                    <Text style={styles.doctorInfoValue}>
                        {doctor.qualification || "MBBS"}
                    </Text>
                </View>
                <View style={styles.doctorInfoRow}>
                    <Text style={styles.doctorInfoLabel}>Availability</Text>
                    <Text style={styles.doctorInfoValue}>
                        {doctor.availability || "09:00 AM - 05:00 PM"}
                    </Text>
                </View>
                <View style={styles.doctorInfoRow}>
                    <Text style={styles.doctorInfoLabel}>Fee</Text>
                    <Text style={styles.doctorInfoValue}>
                        ₹{doctor.consultationFee || doctor.fee || "—"}
                    </Text>
                </View>
            </View>

            {/* Book button */}
            <TouchableOpacity
                style={styles.bookBtn}
                onPress={onBook}
                activeOpacity={0.85}
            >
                <Text style={styles.bookBtnText}>Book Appointment</Text>
            </TouchableOpacity>
        </AppCard>
    );
}

const styles = StyleSheet.create({
    scroll: {
        paddingBottom: 40,
    },

    /* top bar */
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    greeting: {
        fontSize: 14,
        color: COLORS.subtitle,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.text,
        letterSpacing: -0.5,
    },

    /* UHID card */
    uhidCard: {
        marginHorizontal: 20,
        marginBottom: 14,
    },
    uhidRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    uhidLabel: {
        fontSize: 13,
        color: COLORS.subtitle,
        marginBottom: 4,
    },
    uhidValue: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.primaryMid,
        letterSpacing: 0.5,
    },
    activeBadge: {
        backgroundColor: COLORS.bookedLight,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    activeText: {
        color: COLORS.booked,
        fontWeight: "700",
        fontSize: 13,
    },

    /* quick actions */
    quickRow: {
        flexDirection: "row",
        marginHorizontal: 20,
        gap: 12,
        marginBottom: 14,
    },
    quickCard: {
        flex: 1,
    },
    quickCardInner: {
        alignItems: "flex-start",
        paddingVertical: 18,
    },
    quickIcon: {
        fontSize: 22,
        marginBottom: 10,
        color: COLORS.primary,
        fontWeight: "700",
    },
    quickTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.text,
    },
    quickSub: {
        fontSize: 13,
        color: COLORS.subtitle,
        marginTop: 2,
    },

    /* find a doctor */
    findCard: {
        marginHorizontal: 20,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 4,
    },
    sectionSub: {
        fontSize: 13,
        color: COLORS.subtitle,
        marginBottom: 12,
    },

    /* filters */
    filterRow: {
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 14,
    },
    filterChip: {
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 50,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.text,
    },
    filterTextActive: {
        color: "#fff",
    },

    /* doctors list */
    doctorsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    countText: {
        fontSize: 13,
        color: COLORS.subtitle,
    },
    emptyText: {
        textAlign: "center",
        color: COLORS.subtitle,
        marginTop: 30,
        fontSize: 15,
    },

    /* doctor card */
    doctorCard: {
        marginHorizontal: 20,
        marginBottom: 14,
    },
    doctorTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    doctorName: {
        fontSize: 17,
        fontWeight: "700",
        color: COLORS.text,
    },
    doctorSpec: {
        fontSize: 14,
        color: COLORS.primaryMid,
        fontWeight: "600",
        marginTop: 2,
    },
    doctorInfoBox: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 4,
        marginBottom: 14,
    },
    doctorInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    doctorInfoLabel: {
        fontSize: 14,
        color: COLORS.subtitle,
    },
    doctorInfoValue: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.text,
    },
    bookBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 50,
        paddingVertical: 14,
        alignItems: "center",
    },
    bookBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
});