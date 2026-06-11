import React from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
} from "react-native";
import PropTypes from "prop-types";

import COLORS from "../utils/colors";

export default function AppInput({
    label,
    error,
    style,
    containerStyle,
    ...props
}) {
    return (
        <View style={[styles.container, containerStyle]}>
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
                    error && styles.inputError,
                    style,
                ]}
            />

            {error && (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },

    label: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 6,
        fontWeight: "500",
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

    inputError: {
        borderColor: "#EF4444",
    },

    errorText: {
        color: "#EF4444",
        fontSize: 12,
        marginTop: 4,
    },
});

AppInput.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    containerStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};