import React from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";

export default function AppCard({ children, style }) {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
});

AppCard.propTypes = {
    children: PropTypes.node,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};