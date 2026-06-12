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
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    // Emergency contact
    const [ecName, setEcName] = useState("");
    const [ecRelation, setEcRelation] = useState("");
    const [ecPhone, setEcPhone] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const formatDob = (date) => {
        if (!date) return "";
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const validateForm = () => {

        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        } else if (!/^[A-Za-z ]+$/.test(name.trim())) {
            newErrors.name = "Only alphabets are allowed";
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(phone)) {
            newErrors.phone = "Enter a valid 10 digit mobile number";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            newErrors.email = "Enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password =
                "Password must be at least 8 characters";
        }

        if (!gender) {
            newErrors.gender = "Please select gender";
        }

        if (!dob) {
            newErrors.dob = "Date of birth is required";
        }

        if (pincode && !/^\d{6}$/.test(pincode)) {
            newErrors.pincode =
                "Pincode must contain 6 digits";
        }

        if (
            ecPhone &&
            !/^[6-9]\d{9}$/.test(ecPhone)
        ) {
            newErrors.ecPhone =
                "Enter a valid emergency contact number";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {

        if (!validateForm()) {
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
                address: {
                    street,
                    city,
                    state,
                    pincode
                },
                emergencyContact: {
                    name: ecName,
                    relation: ecRelation,
                    phone: ecPhone
                }
            });

            Alert.alert(
                "Success",
                "Account created successfully"
            );

            goToLogin();

        } catch (err) {

            Alert.alert(
                "Registration Failed",
                err?.response?.data?.message ||
                "Something went wrong"
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
                            onChangeText={(text) => {
                                setName(text);
                                setErrors(prev => ({
                                    ...prev,
                                    name: ""
                                }));
                            }}
                            error={errors.name}
                        />

                        <AppInput
                            placeholder="Phone Number *"
                            value={phone}
                            onChangeText={(text) => {
                                setPhone(text);
                                setErrors(prev => ({
                                    ...prev,
                                    phone: ""
                                }));
                            }}
                            keyboardType="phone-pad"
                            error={errors.phone}
                        />

                        <AppInput
                            placeholder="Email *"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setErrors(prev => ({
                                    ...prev,
                                    email: ""
                                }));
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                        />

                        <AppInput
                            placeholder="Password *"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setErrors(prev => ({
                                    ...prev,
                                    password: ""
                                }));
                            }}
                            secureTextEntry
                            error={errors.password}
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
                            value={street}
                            onChangeText={setStreet}
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
                            onChangeText={(text) => {
                                setPincode(text);
                                setErrors(prev => ({
                                    ...prev,
                                    pincode: ""
                                }));
                            }}
                            keyboardType="numeric"
                            error={errors.pincode}
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
                            onChangeText={(text) => {
                                setEcPhone(text);
                                setErrors(prev => ({
                                    ...prev,
                                    ecPhone: ""
                                }));
                            }}
                            keyboardType="phone-pad"
                            error={errors.ecPhone}
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