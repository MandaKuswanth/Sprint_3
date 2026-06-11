import React from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import COLORS from "../utils/colors";

export default function ScreenHeader({
    title,
    subtitle,
    goBack,
    rightComponent,
}) {
    return (
        <View style={styles.container}>

            {goBack && (
                <TouchableOpacity
                    onPress={goBack}
                    style={styles.backBtn}
                >
                    <Text style={styles.backText}>
                        ← Back
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>
                        {title}
                    </Text>

                    {subtitle && (
                        <Text style={styles.subtitle}>
                            {subtitle}
                        </Text>
                    )}
                </View>

                {rightComponent}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    backBtn: {
        marginBottom: 8,
    },

    backText: {
        color: COLORS.primary,
        fontWeight: "600",
        fontSize: 16,
    },

    title: {
        fontSize: 30,
        fontWeight: "800",
        color: COLORS.text,
        letterSpacing: -0.5,
    },

    subtitle: {
        marginTop: 4,
        fontSize: 14,
        color: COLORS.subtitle,
    },
});