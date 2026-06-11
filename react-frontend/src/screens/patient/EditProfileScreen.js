// src/screens/patient/EditProfileScreen.js

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity,
    Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import AppContainer from "../../components/AppContainer";
import AppCard from "../../components/AppCard";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import ScreenHeader from "../../components/ScreenHeader";
import COLORS from "../../utils/colors";
import { updatePatient } from "../../services/patientService";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function EditProfileScreen({
    patient,
    token,
    goBack,
    onUpdate,
}) {
    // Basic info
    const [name, setName] = useState(patient?.name || "");
    const [phone, setPhone] = useState(patient?.phone || "");
    const [gender, setGender] = useState(patient?.gender || "");
    const [bloodGroup, setBloodGroup] = useState(patient?.bloodGroup || "");

    // DOB
    const [dob, setDob] = useState(
        patient?.dob ? new Date(patient.dob) : null
    );
    const [showDobPicker, setShowDobPicker] = useState(false);

    // Address
    const [address, setAddress] = useState(patient?.address || "");
    const [city, setCity] = useState(patient?.city || "");
    const [state, setState] = useState(patient?.state || "");
    const [pincode, setPincode] = useState(patient?.pincode || "");

    // Emergency contact
    const [ecName, setEcName] = useState(
        patient?.emergencyContact?.name || ""
    );
    const [ecRelation, setEcRelation] = useState(
        patient?.emergencyContact?.relation || ""
    );
    const [ecPhone, setEcPhone] = useState(
        patient?.emergencyContact?.phone || ""
    );

    const [loading, setLoading] = useState(false);

    const formatDob = (date) => {
        if (!date) return "";
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);

            const response = await updatePatient(
                patient.UHID,
                {
                    name,
                    phone,
                    gender,
                    bloodGroup,
                    dob: dob ? formatDob(dob) : undefined,
                    address,
                    city,
                    state,
                    pincode,
                    emergencyContact: {
                        name: ecName,
                        relation: ecRelation,
                        phone: ecPhone,
                    },
                },
                token
            );

            Alert.alert("Success", "Profile updated successfully");
            onUpdate(response.data);
            goBack();

        } catch (err) {
            console.log(err);
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
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scroll}
            >
                {/* Header */}
                <ScreenHeader
                    title="Edit Profile"
                    subtitle="Update your personal information"
                    goBack={goBack}
                />

                {/* ── Basic Info ── */}
                <AppCard style={styles.card}>
                    <SectionLabel text="Basic Information" />

                    <AppInput
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <AppInput
                        placeholder="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    {/* Gender */}
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.chipRow}>
                        {["male", "female", "others"].map((g) => (
                            <TouchableOpacity
                                key={g}
                                style={[
                                    styles.chip,
                                    gender === g && styles.chipActive,
                                ]}
                                onPress={() => setGender(g)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        gender === g && styles.chipTextActive,
                                    ]}
                                >
                                    {g.charAt(0).toUpperCase() + g.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Blood Group */}
                    <Text style={styles.label}>Blood Group</Text>
                    <View style={styles.chipRow}>
                        {BLOOD_GROUPS.map((bg) => (
                            <TouchableOpacity
                                key={bg}
                                style={[
                                    styles.chip,
                                    bloodGroup === bg && styles.chipActive,
                                ]}
                                onPress={() => setBloodGroup(bg)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        bloodGroup === bg &&
                                        styles.chipTextActive,
                                    ]}
                                >
                                    {bg}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* DOB */}
                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity
                        style={styles.dateBtn}
                        onPress={() => setShowDobPicker(true)}
                    >
                        <Text
                            style={[
                                styles.dateBtnText,
                                !dob && { color: COLORS.subtitle },
                            ]}
                        >
                            {dob ? formatDob(dob) : "Select date of birth"}
                        </Text>
                    </TouchableOpacity>

                    {showDobPicker && (
                        <DateTimePicker
                            value={dob || new Date(2000, 0, 1)}
                            mode="date"
                            maximumDate={new Date()}
                            onChange={(event, selectedDate) => {
                                if (Platform.OS === "android")
                                    setShowDobPicker(false);
                                if (selectedDate) setDob(selectedDate);
                                if (Platform.OS === "ios")
                                    setShowDobPicker(false);
                            }}
                        />
                    )}
                </AppCard>

                {/* ── Address ── */}
                <AppCard style={styles.card}>
                    <SectionLabel text="Address" />

                    <AppInput
                        placeholder="Street Address"
                        value={address}
                        onChangeText={setAddress}
                    />
                    <AppInput
                        placeholder="City"
                        value={city}
                        onChangeText={setCity}
                    />
                    <AppInput
                        placeholder="State"
                        value={state}
                        onChangeText={setState}
                    />
                    <AppInput
                        placeholder="Pincode"
                        value={pincode}
                        onChangeText={setPincode}
                        keyboardType="numeric"
                    />
                </AppCard>

                {/* ── Emergency Contact ── */}
                <AppCard style={styles.card}>
                    <SectionLabel text="Emergency Contact" />

                    <AppInput
                        placeholder="Contact Name"
                        value={ecName}
                        onChangeText={setEcName}
                    />
                    <AppInput
                        placeholder="Relation (e.g. Spouse, Parent)"
                        value={ecRelation}
                        onChangeText={setEcRelation}
                    />
                    <AppInput
                        placeholder="Contact Phone"
                        value={ecPhone}
                        onChangeText={setEcPhone}
                        keyboardType="phone-pad"
                    />
                </AppCard>

                <View style={styles.buttonContainer}>
                    <AppButton
                        title={loading ? "Updating..." : "Update Profile"}
                        onPress={handleUpdate}
                    />
                </View>
            </ScrollView>
        </AppContainer>
    );
}

function SectionLabel({ text }) {
    return (
        <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>{text}</Text>
            <View style={styles.sectionDivider} />
        </View>
    );
}

const styles = StyleSheet.create({
    scroll: {
        paddingBottom: 40,
    },
    card: {
        marginHorizontal: 20,
        marginBottom: 14,
    },

    sectionLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
        gap: 10,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.subtitle,
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    sectionDivider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: 10,
        marginTop: 4,
    },

    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 14,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    chipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.text,
    },
    chipTextActive: {
        color: "#fff",
    },

    dateBtn: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 14,
    },
    dateBtnText: {
        fontSize: 15,
        color: COLORS.text,
    },

    buttonContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
});