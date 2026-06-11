// src/screens/auth/RegisterScreen.js

import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

import { registerPatient } from "../../api/authApi";

import AppContainer from "../../components/AppContainer";
import AppCard from "../../components/AppCard";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";

import COLORS from "../../utils/colors";

const BLOOD_GROUPS = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
];

const GENDERS = ["male", "female", "others"];

export default function RegisterScreen({
    goToLogin,
}) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [gender, setGender] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");

    const [dob, setDob] = useState(null);
    const [showDobPicker, setShowDobPicker] = useState(false);

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    const [ecName, setEcName] = useState("");
    const [ecRelation, setEcRelation] = useState("");
    const [ecPhone, setEcPhone] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        dob: "",
        pincode: "",
        ecPhone: "",
    });

    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const formatDob = (date) => {
        if (!date) return "";

        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");

        return `${y}-${m}-${d}`;
    };

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePhone = (value) => {
        const phoneRegex = /^[6-9][0-9]{9}$/;
        return phoneRegex.test(value);
    };

    const validatePincode = (value) => {
        if (!value) return true;

        const pincodeRegex = /^[1-9][0-9]{5}$/;
        return pincodeRegex.test(value);
    };

    const validateForm = () => {
        const newErrors = {
            name: "",
            phone: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "",
            dob: "",
            pincode: "",
            ecPhone: "",
        };

        let isValid = true;

        const trimmedName = name.trim();
        const trimmedPhone = phone.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
            newErrors.name = "Full name is required";
            isValid = false;
        } else if (trimmedName.length < 3) {
            newErrors.name = "Name must be at least 3 characters";
            isValid = false;
        }

        if (!trimmedPhone) {
            newErrors.phone = "Phone number is required";
            isValid = false;
        } else if (!validatePhone(trimmedPhone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
            isValid = false;
        }

        if (!trimmedEmail) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!validateEmail(trimmedEmail)) {
            newErrors.email = "Enter a valid email address";
            isValid = false;
        }

        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required";
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        if (!gender) {
            newErrors.gender = "Gender is required";
            isValid = false;
        }

        if (!dob) {
            newErrors.dob = "Date of birth is required";
            isValid = false;
        }

        if (!validatePincode(pincode.trim())) {
            newErrors.pincode = "Enter a valid 6-digit pincode";
            isValid = false;
        }

        if (ecPhone.trim() && !validatePhone(ecPhone.trim())) {
            newErrors.ecPhone = "Enter a valid emergency contact number";
            isValid = false;
        }

        setErrors(newErrors);
        setApiError("");

        return isValid;
    };

    const getBackendErrorMessage = (err) => {
        if (err?.response?.data?.message) {
            return err.response.data.message;
        }

        if (err?.response?.data?.error) {
            return err.response.data.error;
        }

        if (err?.code === "ECONNABORTED") {
            return "Request timeout. Please check your network or backend server.";
        }

        if (err?.message === "Network Error") {
            return "Network error. Please check backend URL or internet connection.";
        }

        return "Something went wrong. Please try again.";
    };

    const clearFieldError = (fieldName) => {
        setErrors((prev) => ({
            ...prev,
            [fieldName]: "",
        }));

        setApiError("");
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setApiError("");

            const patientData = {
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim().toLowerCase(),
                password,
                confirmPassword,
                gender,
                dob: formatDob(dob),
                bloodGroup,
                address: address.trim(),
                city: city.trim(),
                state: state.trim(),
                pincode: pincode.trim(),
                emergencyContact: {
                    name: ecName.trim(),
                    relation: ecRelation.trim(),
                    phone: ecPhone.trim(),
                },
            };

            const response = await registerPatient(patientData);

            console.log("REGISTER BACKEND RESPONSE:", response);

            Toast.show({
                type: "success",
                text1: "Registration Successful",
                text2: "Account created successfully",
            });

            goToLogin();
        } catch (err) {
            console.log("REGISTER ERROR:", err?.response?.data);

            const message = getBackendErrorMessage(err);

            setApiError(message);

            Toast.show({
                type: "error",
                text1: "Registration Failed",
                text2: message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppContainer>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <AppCard>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoCircle}>
                                <Text style={styles.logo}>
                                    🏥
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.title}>
                            Create Account
                        </Text>

                        <Text style={styles.subtitle}>
                            Register as a patient
                        </Text>

                        {apiError ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorBoxText}>
                                    {apiError}
                                </Text>
                            </View>
                        ) : null}

                        <SectionLabel text="Basic Information" />

                        <AppInput
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={name}
                            onChangeText={(value) => {
                                setName(value);
                                clearFieldError("name");
                            }}
                            error={errors.name}
                        />

                        <AppInput
                            label="Phone Number"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChangeText={(value) => {
                                setPhone(value);
                                clearFieldError("phone");
                            }}
                            keyboardType="phone-pad"
                            maxLength={10}
                            error={errors.phone}
                        />

                        <AppInput
                            label="Email Address"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);
                                clearFieldError("email");
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            error={errors.email}
                        />

                        <View style={styles.passwordWrapper}>
                            <AppInput
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={(value) => {
                                    setPassword(value);
                                    clearFieldError("password");
                                }}
                                secureTextEntry={!showPassword}
                                style={styles.passwordInput}
                                error={errors.password}
                            />

                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.eyeText}>
                                    {showPassword ? "Hide" : "Show"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.passwordWrapper}>
                            <AppInput
                                label="Confirm Password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChangeText={(value) => {
                                    setConfirmPassword(value);
                                    clearFieldError("confirmPassword");
                                }}
                                secureTextEntry={!showConfirmPassword}
                                style={styles.passwordInput}
                                error={errors.confirmPassword}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                style={styles.eyeButton}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.eyeText}>
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>
                            Gender
                        </Text>

                        <View style={styles.chipRow}>
                            {GENDERS.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.chip,
                                        gender === item && styles.chipActive,
                                    ]}
                                    onPress={() => {
                                        setGender(item);
                                        clearFieldError("gender");
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            gender === item &&
                                            styles.chipTextActive,
                                        ]}
                                    >
                                        {item.charAt(0).toUpperCase() +
                                            item.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {errors.gender ? (
                            <Text style={styles.errorText}>
                                {errors.gender}
                            </Text>
                        ) : null}

                        <Text style={styles.label}>
                            Blood Group
                        </Text>

                        <View style={styles.chipRow}>
                            {BLOOD_GROUPS.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.chip,
                                        bloodGroup === item &&
                                        styles.chipActive,
                                    ]}
                                    onPress={() => setBloodGroup(item)}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            bloodGroup === item &&
                                            styles.chipTextActive,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>
                            Date of Birth
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.dateButton,
                                errors.dob && styles.dateButtonError,
                            ]}
                            onPress={() => {
                                setShowDobPicker(true);
                                clearFieldError("dob");
                            }}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.dateButtonText,
                                    !dob && styles.datePlaceholder,
                                ]}
                            >
                                {dob
                                    ? formatDob(dob)
                                    : "Select date of birth"}
                            </Text>
                        </TouchableOpacity>

                        {errors.dob ? (
                            <Text style={styles.errorText}>
                                {errors.dob}
                            </Text>
                        ) : null}

                        {showDobPicker ? (
                            <DateTimePicker
                                value={dob || new Date(2000, 0, 1)}
                                mode="date"
                                maximumDate={new Date()}
                                display={
                                    Platform.OS === "ios"
                                        ? "spinner"
                                        : "default"
                                }
                                onChange={(event, selectedDate) => {
                                    if (Platform.OS === "android") {
                                        setShowDobPicker(false);
                                    }

                                    if (selectedDate) {
                                        setDob(selectedDate);
                                        clearFieldError("dob");
                                    }

                                    if (Platform.OS === "ios") {
                                        setShowDobPicker(false);
                                    }
                                }}
                            />
                        ) : null}

                        <SectionLabel text="Address" />

                        <AppInput
                            label="Street Address"
                            placeholder="Enter your address"
                            value={address}
                            onChangeText={(value) => {
                                setAddress(value);
                                setApiError("");
                            }}
                            multiline
                        />

                        <AppInput
                            label="City"
                            placeholder="Enter your city"
                            value={city}
                            onChangeText={(value) => {
                                setCity(value);
                                setApiError("");
                            }}
                        />

                        <AppInput
                            label="State"
                            placeholder="Enter your state"
                            value={state}
                            onChangeText={(value) => {
                                setState(value);
                                setApiError("");
                            }}
                        />

                        <AppInput
                            label="Pincode"
                            placeholder="Enter your pincode"
                            value={pincode}
                            onChangeText={(value) => {
                                setPincode(value);
                                clearFieldError("pincode");
                            }}
                            keyboardType="numeric"
                            maxLength={6}
                            error={errors.pincode}
                        />

                        <SectionLabel text="Emergency Contact" />

                        <AppInput
                            label="Contact Name"
                            placeholder="Enter emergency contact name"
                            value={ecName}
                            onChangeText={(value) => {
                                setEcName(value);
                                setApiError("");
                            }}
                        />

                        <AppInput
                            label="Relation"
                            placeholder="Example: Father, Mother, Spouse"
                            value={ecRelation}
                            onChangeText={(value) => {
                                setEcRelation(value);
                                setApiError("");
                            }}
                        />

                        <AppInput
                            label="Contact Phone"
                            placeholder="Enter emergency contact number"
                            value={ecPhone}
                            onChangeText={(value) => {
                                setEcPhone(value);
                                clearFieldError("ecPhone");
                            }}
                            keyboardType="phone-pad"
                            maxLength={10}
                            error={errors.ecPhone}
                        />

                        <AppButton
                            title="Create Account"
                            onPress={handleRegister}
                            loading={loading}
                            disabled={loading}
                            style={styles.submitButton}
                        />

                        <TouchableOpacity
                            onPress={goToLogin}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.switchText}>
                                Already have an account?{" "}
                                <Text style={styles.switchLink}>
                                    Login
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </AppCard>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppContainer>
    );
}

function SectionLabel({ text }) {
    return (
        <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>
                {text}
            </Text>

            <View style={styles.sectionDivider} />
        </View>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },

    logoContainer: {
        alignItems: "center",
        marginBottom: 18,
    },

    logoCircle: {
        width: 86,
        height: 86,
        borderRadius: 43,
        backgroundColor: "#E3F2FD",
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        fontSize: 46,
    },

    title: {
        fontSize: 30,
        fontWeight: "800",
        textAlign: "center",
        color: COLORS.text,
        marginBottom: 8,
    },

    subtitle: {
        textAlign: "center",
        color: COLORS.subtitle,
        marginBottom: 28,
        fontSize: 15,
        lineHeight: 22,
    },

    errorBox: {
        backgroundColor: "#FFEBEE",
        borderLeftWidth: 4,
        borderLeftColor: "#D32F2F",
        padding: 12,
        borderRadius: 10,
        marginBottom: 18,
    },

    errorBoxText: {
        color: "#B71C1C",
        fontSize: 14,
        fontWeight: "500",
    },

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
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: 10,
        marginTop: 4,
    },

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
        color: "#FFFFFF",
    },

    passwordWrapper: {
        position: "relative",
    },

    passwordInput: {
        paddingRight: 70,
    },

    eyeButton: {
        position: "absolute",
        right: 16,
        top: 38,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
    },

    eyeText: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: "700",
    },

    dateButton: {
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 14,
    },

    dateButtonError: {
        borderColor: "#D32F2F",
    },

    dateButtonText: {
        fontSize: 15,
        color: COLORS.text,
    },

    datePlaceholder: {
        color: COLORS.subtitle,
    },

    errorText: {
        color: "#D32F2F",
        fontSize: 13,
        marginTop: -8,
        marginBottom: 10,
        marginLeft: 4,
    },

    submitButton: {
        marginTop: 8,
        marginBottom: 4,
    },

    switchText: {
        marginTop: 18,
        textAlign: "center",
        color: COLORS.subtitle,
        fontSize: 15,
        fontWeight: "500",
    },

    switchLink: {
        color: COLORS.primary,
        fontWeight: "700",
    },
});