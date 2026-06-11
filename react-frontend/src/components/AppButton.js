// src/components/AppButton.js

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import COLORS from "../utils/colors";

export default function AppButton({
    title,
    onPress,
    color = COLORS.primary,
    textColor = "#FFFFFF",
    variant = "solid", // "solid" | "outline"
    style,
}) {
    const isOutline = variant === "outline";

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: isOutline
                        ? "transparent"
                        : color,
                    borderWidth: isOutline ? 1.5 : 0,
                    borderColor: isOutline ? color : "transparent",
                },
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text
                style={[
                    styles.text,
                    {
                        color: isOutline ? color : textColor,
                    },
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        borderRadius: 50,        // fully pill-shaped like screenshots
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontWeight: "700",
        fontSize: 16,
        letterSpacing: 0.2,
    },
});