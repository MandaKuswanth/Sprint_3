import React from "react";

import {
    View,
    TextInput,
    Text,
    StyleSheet,
} from "react-native";

import COLORS from "../utils/colors";

export default function AppInput({
    label,
    error,
    style,
    ...props
}) {
    return (
        <View style={styles.container}>

            {label && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}

            <TextInput
                {...props}
                placeholderTextColor={COLORS.subtitle}
                style={[
                    styles.input,
                    style,
                ]}
            />

            {error && (
                <Text style={styles.error}>
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 14,
    },

    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.text,
    },

    input: {
        backgroundColor: COLORS.surface,

        borderWidth: 1,
        borderColor: COLORS.border,

        borderRadius: 14,

        paddingHorizontal: 16,
        paddingVertical: 14,

        fontSize: 15,
        color: COLORS.text,
    },

    error: {
        marginTop: 4,
        color: COLORS.danger,
        fontSize: 12,
    },
});