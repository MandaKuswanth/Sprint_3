// src/components/ScreenHeader.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../utils/colors";

export default function ScreenHeader({ title, subtitle, goBack }) {
    return (
        <View style={styles.container}>
            {goBack && (
                <TouchableOpacity
                    onPress={goBack}
                    style={styles.backBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
            {subtitle ? (
                <Text style={styles.subtitle}>{subtitle}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    backBtn: {
        marginBottom: 8,
    },
    backText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: "600",
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: COLORS.text,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.subtitle,
        marginTop: 4,
    },
});