import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../utils/colors";

export default function AppAvatar({
    name = "",
    size = 50,
    backgroundColor = COLORS.primary,
    textColor = COLORS.white,
}) {
    const initials = name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <View
            style={[
                styles.avatar,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                },
            ]}
        >
            <Text
                style={[
                    styles.text,
                    {
                        color: textColor,
                        fontSize: size * 0.35,
                    },
                ]}
            >
                {initials || "?"}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontWeight: "700",
    },
});