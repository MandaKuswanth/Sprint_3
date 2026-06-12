import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";

import { loginPatient }
    from "../../services/authService";

import AppContainer
    from "../../components/AppContainer";

import AppCard
    from "../../components/AppCard";

import AppInput
    from "../../components/AppInput";

import AppButton
    from "../../components/AppButton";

import COLORS
    from "../../utils/colors";

export default function LoginScreen({
    goToRegister,
    goToHome
}) {

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [errors, setErrors] = useState({});

    const validateForm = () => {

        const newErrors = {};

        if (!email.trim()) {

            newErrors.email =
                "Email is required";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            newErrors.email =
                "Enter a valid email address";
        }

        if (!password) {

            newErrors.password =
                "Password is required";

        } else if (password.length < 8) {

            newErrors.password =
                "Password must be at least 8 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {

        if (!validateForm()) {
            return;
        }

        try {

            setLoading(true);

            const response =
                await loginPatient({
                    email,
                    password
                });

            Alert.alert(
                "Success",
                "Login successful"
            );

            goToHome(
                response.data
            );

        } catch (err) {

            Alert.alert(
                "Login Failed",
                err?.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <AppContainer>

            <View style={styles.wrapper}>

                <AppCard>

                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>
                            🏥
                        </Text>
                    </View>

                    <Text style={styles.title}>
                        Welcome Back
                    </Text>

                    <Text style={styles.subtitle}>
                        Sign in to continue
                    </Text>

                    <AppInput
                        placeholder="Email"
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
                        placeholder="Password"
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

                    <AppButton
                        title={
                            loading
                                ? "Logging in..."
                                : "Login"
                        }
                        onPress={handleLogin}
                        disabled={loading}
                    />

                    <TouchableOpacity
                        onPress={goToRegister}
                    >

                        <Text style={styles.switchText}>
                            Don't have an account? Register
                        </Text>

                    </TouchableOpacity>

                </AppCard>

            </View>

        </AppContainer>
    );
}

const styles = StyleSheet.create({

    wrapper: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20
    },

    logoContainer: {
        alignItems: "center",
        marginBottom: 15
    },

    logo: {
        fontSize: 60
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        color: COLORS.text,
        marginBottom: 8
    },

    subtitle: {
        textAlign: "center",
        color: COLORS.subtitle,
        marginBottom: 25,
        fontSize: 15
    },

    switchText: {
        marginTop: 20,
        textAlign: "center",
        color: COLORS.primary,
        fontWeight: "600"
    }
});