// src/components/AppInput.js

import React from "react";
import { TextInput, StyleSheet } from "react-native";
import COLORS from "../utils/colors";

export default function AppInput(props) {
    return (
        <TextInput
            {...props}
            placeholderTextColor={COLORS.subtitle}
            style={[styles.input, props.style]}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: COLORS.text,
        marginBottom: 14,
    },
});