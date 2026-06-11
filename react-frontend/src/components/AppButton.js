import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";

import COLORS from "../utils/colors";

export default function AppButton({
    title,
    onPress,
    color = COLORS.primary,
    textColor = COLORS.white,
    variant = "solid",
    disabled = false,
    style,
}) {
    const isOutline = variant === "outline";

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={disabled}
            onPress={onPress}
            style={[
                styles.button,
                {
                    backgroundColor: isOutline
                        ? "transparent"
                        : disabled
                            ? "#CBD5E1"
                            : color,

                    borderWidth: isOutline ? 1.5 : 0,

                    borderColor: isOutline
                        ? color
                        : "transparent",
                },
                style,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    {
                        color: isOutline
                            ? color
                            : textColor,
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
        minHeight: 52,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    text: {
        fontSize: 16,
        fontWeight: "700",
    },
});