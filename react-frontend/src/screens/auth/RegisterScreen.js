// src/screens/auth/RegisterScreen.js

import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { registerPatient } from "../../services/authService";

import AppContainer from "../../components/AppContainer";
import AppCard from "../../components/AppCard";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import COLORS from "../../utils/colors";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RegisterScreen({ goToLogin }) {

    // Basic info
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");

    // DOB
    const [dob, setDob] = useState(null);
    const [showDobPicker, setShowDobPicker] = useState(false);

    // Address
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    // Emergency contact
    const [ecName, setEcName] = useState("");
    const [ecRelation, setEcRelation] = useState("");
    const [ecPhone, setEcPhone] = useState("");

    const [loading, setLoading] = useState(false);

    const formatDob = (date) => {
        if (!date) return "";
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const handleRegister = async () => {
        if (!name || !phone || !email || !password || !gender || !dob) {
            Alert.alert("Error", "Please fill all required fields");
            return;
        }

        try {
            setLoading(true);

            await registerPatient({
                name,
                phone,
                email,
                password,
                gender,
                dob: formatDob(dob),
                bloodGroup,
                address,
                city,
                state,
                pincode,
                emergencyContact: {
                    name: ecName,
                    relation: ecRelation,
                    phone: ecPhone,
                },
            });

            Alert.alert("Success", "Account created successfully");
            goToLogin();

        } catch (err) {
            Alert.alert(
                "Registration Failed",
                err?.response?.data?.message || "Something went wrong"
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
            >
                <View style={styles.wrapper}>
                    <AppCard>

                        {/* Logo */}
                        <View style={styles.logoContainer}>
                            <Text style={styles.logo}>🏥</Text>
                        </View>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Register as a patient</Text>

                        {/* ── Basic Info ── */}
                        <SectionLabel text="Basic Information" />

                        <AppInput
                            placeholder="Full Name *"
                            value={name}
                            onChangeText={setName}
                        />
                        <AppInput
                            placeholder="Phone Number *"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                        <AppInput
                            placeholder="Email *"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <AppInput
                            placeholder="Password *"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {/* ── Gender ── */}
                        <Text style={styles.label}>Gender *</Text>
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

                        {/* ── Blood Group ── */}
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
                                            bloodGroup === bg && styles.chipTextActive,
                                        ]}
                                    >
                                        {bg}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* ── DOB ── */}
                        <Text style={styles.label}>Date of Birth *</Text>
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

                        {/* ── Address ── */}
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

                        {/* ── Emergency Contact ── */}
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

                        {/* ── Submit ── */}
                        <AppButton
                            title={loading ? "Registering..." : "Create Account"}
                            onPress={handleRegister}
                            style={styles.submitBtn}
                        />

                        <TouchableOpacity onPress={goToLogin}>
                            <Text style={styles.switchText}>
                                Already have an account?{" "}
                                <Text style={styles.switchLink}>Login</Text>
                            </Text>
                        </TouchableOpacity>

                    </AppCard>
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
    wrapper: {
        padding: 20,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 15,
    },
    logo: {
        fontSize: 55,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        color: COLORS.text,
        marginBottom: 6,
    },
    subtitle: {
        textAlign: "center",
        color: COLORS.subtitle,
        marginBottom: 24,
        fontSize: 15,
    },

    // section label
    sectionLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
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

    // chips (gender + blood group)
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
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

    // DOB
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

    submitBtn: {
        marginTop: 8,
        marginBottom: 4,
    },
    switchText: {
        marginTop: 18,
        textAlign: "center",
        color: COLORS.subtitle,
        fontSize: 15,
    },
    switchLink: {
        color: COLORS.primary,
        fontWeight: "700",
    },
});