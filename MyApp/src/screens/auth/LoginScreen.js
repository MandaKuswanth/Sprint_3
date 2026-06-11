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

import Toast from "react-native-toast-message";

import { loginPatient } from "../../api/authApi";

import AppContainer from "../../components/AppContainer";
import AppCard from "../../components/AppCard";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";

import COLORS from "../../utils/colors";

export default function LoginScreen({
    goToRegister,
    goToHome,
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validateForm = () => {
        const newErrors = {
            email: "",
            password: "",
        };

        let isValid = true;

        const trimmedEmail = email.trim();

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

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setApiError("");

            const response = await loginPatient({
                email: email.trim().toLowerCase(),
                password,
            });

            Toast.show({
                type: "success",
                text1: "Login Successful",
                text2: "Welcome back!",
            });

            goToHome(response.data || response);
        } catch (err) {
            const message = getBackendErrorMessage(err);

            setApiError(message);

            Toast.show({
                type: "error",
                text1: "Login Failed",
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
                            Welcome Back
                        </Text>

                        <Text style={styles.subtitle}>
                            Login to manage your health appointments
                        </Text>

                        {apiError ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorBoxText}>
                                    {apiError}
                                </Text>
                            </View>
                        ) : null}

                        <AppInput
                            label="Email Address"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);
                                setErrors((prev) => ({
                                    ...prev,
                                    email: "",
                                }));
                                setApiError("");
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
                                    setErrors((prev) => ({
                                        ...prev,
                                        password: "",
                                    }));
                                    setApiError("");
                                }}
                                secureTextEntry={!showPassword}
                                error={errors.password}
                                style={styles.passwordInput}
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

                        <AppButton
                            title="Login"
                            onPress={handleLogin}
                            loading={loading}
                            disabled={loading}
                        />

                        <TouchableOpacity
                            onPress={goToRegister}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.switchText}>
                                Don't have an account?{" "}
                                <Text style={styles.registerText}>
                                    Register
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </AppCard>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppContainer>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
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

    switchText: {
        marginTop: 22,
        textAlign: "center",
        color: COLORS.subtitle,
        fontWeight: "500",
    },

    registerText: {
        color: COLORS.primary,
        fontWeight: "700",
    },
});