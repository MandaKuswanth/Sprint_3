import React from "react";
import { View, StyleSheet } from "react-native";

export default function AppCard({
    children,
    style,
    padding = 20,
}) {
    return (
        <View
            style={[
                styles.card,
                { padding },
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 8,

        elevation: 2,
    },
});