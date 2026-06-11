// src/screens/patient/ProfileScreen.js

import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import AppContainer from "../../components/AppContainer";
import AppCard from "../../components/AppCard";
import AppButton from "../../components/AppButton";
import COLORS from "../../utils/colors";

export default function ProfileScreen({
    patient,
    goBack,
    goToEditProfile,
    logout,
}) {
    const initials = patient?.name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const formatDob = (dobString) => {
        if (!dobString) return "—";
        const d = new Date(dobString);
        return d.toDateString(); // e.g. "Wed May 10 1995"
    };

    return (
        <AppContainer>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Profile</Text>
                </View>

                <View style={styles.avatarSection}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{initials || "P"}</Text>
                    </View>
                    <Text style={styles.patientName}>{patient?.name}</Text>
                    <Text style={styles.uhidText}>{patient?.UHID}</Text>
                </View>

                {/* Personal Info */}
                <AppCard style={styles.card}>
                    <InfoRow icon="✉️" label="Email" value={patient?.email} />
                    <Divider />
                    <InfoRow icon="📞" label="Phone" value={patient?.phone} />
                    <Divider />
                    <InfoRow icon="🩸" label="Blood Group" value={patient?.bloodGroup} />
                    <Divider />
                    <InfoRow icon="👤" label="Gender" value={patient?.gender?.toUpperCase()} />
                    <Divider />
                    <InfoRow icon="📅" label="DOB" value={formatDob(patient?.dob)} />
                </AppCard>

                {/* Address */}
                <AppCard style={styles.card}>
                    <Text style={styles.cardSectionTitle}>Address</Text>
                    <InfoRow icon="📍" label="City" value={patient?.city} />
                    <Divider />
                    <InfoRow icon="🗺️" label="State" value={patient?.state} />
                    <Divider />
                    <InfoRow icon="📌" label="Pincode" value={patient?.pincode} />
                </AppCard>

                {/* Emergency Contact */}
                {(patient?.emergencyContact?.name ||
                    patient?.emergencyContact?.phone) && (
                        <AppCard style={styles.card}>
                            <Text style={styles.cardSectionTitle}>Emergency Contact</Text>
                            <InfoRow icon="👤" label="Name" value={patient?.emergencyContact?.name} />
                            <Divider />
                            <InfoRow icon="🔗" label="Relation" value={patient?.emergencyContact?.relation} />
                            <Divider />
                            <InfoRow icon="📞" label="Phone" value={patient?.emergencyContact?.phone} />
                        </AppCard>
                    )}

                <View style={styles.btnContainer}>
                    <AppButton title="Edit Profile" onPress={goToEditProfile} />
                </View>

                {logout && (
                    <View style={styles.btnContainer}>
                        <AppButton
                            title="Logout"
                            onPress={logout}
                            color={COLORS.dangerLight}
                            textColor={COLORS.danger}
                        />
                    </View>
                )}
            </ScrollView>
        </AppContainer>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
                <Text style={styles.infoIcon}>{icon}</Text>
                <Text style={styles.infoLabel}>{label}</Text>
            </View>
            <Text style={styles.infoValue} numberOfLines={2}>
                {value || "—"}
            </Text>
        </View>
    );
}

function Divider() {
    return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
    scroll: { paddingBottom: 40 },
    pageHeader: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6 },
    pageTitle: { fontSize: 30, fontWeight: "800", color: COLORS.text, letterSpacing: -0.5 },
    avatarSection: { alignItems: "center", paddingVertical: 24 },
    avatarCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: COLORS.primary,
        justifyContent: "center", alignItems: "center", marginBottom: 12,
    },
    avatarText: { color: "#fff", fontSize: 30, fontWeight: "700" },
    patientName: { fontSize: 22, fontWeight: "700", color: COLORS.text },
    uhidText: { fontSize: 14, color: COLORS.subtitle, marginTop: 4 },
    card: { marginHorizontal: 20, marginBottom: 14, paddingVertical: 4 },
    cardSectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text, paddingVertical: 10 },
    infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
    infoLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    infoIcon: { fontSize: 18, width: 26 },
    infoLabel: { fontSize: 15, color: COLORS.subtitle },
    infoValue: { fontSize: 15, fontWeight: "600", color: COLORS.text, maxWidth: "55%", textAlign: "right" },
    divider: { height: 1, backgroundColor: COLORS.border },
    btnContainer: { marginHorizontal: 20, marginBottom: 12 },
});