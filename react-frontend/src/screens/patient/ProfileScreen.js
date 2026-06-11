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
import AppAvatar from "../../components/AppAvatar";
import ScreenHeader from "../../components/ScreenHeader";
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
                <ScreenHeader
                    title="Profile"
                />

                <View style={styles.avatarSection}>
                    <AppAvatar
                        name={patient?.name}
                        size={80}
                    />
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

    <InfoRow
        icon="🏠"
        label="Street"
        value={patient?.address?.street}
    />
    <Divider />

    <InfoRow
        icon="📍"
        label="City"
        value={patient?.address?.city}
    />
    <Divider />

    <InfoRow
        icon="🗺️"
        label="State"
        value={patient?.address?.state}
    />
    <Divider />

    <InfoRow
        icon="📌"
        label="Pincode"
        value={patient?.address?.pincode}
    />
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
    avatarSection: { alignItems: "center", paddingVertical: 24 },
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