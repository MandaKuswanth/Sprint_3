import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";

import COLORS from "../utils/colors";

export default function AppButton({
    title,
    onPress,
    color = COLORS.primary,
    textColor = "#FFFFFF",
    variant = "solid",
    style,
    disabled = false,
    loading = false,
}) {
    const isOutline = variant === "outline";

    const backgroundColor = isOutline
        ? "transparent"
        : disabled
            ? COLORS.subtitle
            : color;

    const finalTextColor = isOutline ? color : textColor;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor,
                    borderWidth: isOutline ? 1.5 : 0,
                    borderColor: isOutline
                        ? disabled
                            ? COLORS.subtitle
                            : color
                        : "transparent",
                    opacity: disabled ? 0.7 : 1,
                },
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={finalTextColor} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        {
                            color: disabled && isOutline
                                ? COLORS.subtitle
                                : finalTextColor,
                        },
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    text: {
        fontWeight: "700",
        fontSize: 16,
        letterSpacing: 0.2,
    },
});

AppButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    color: PropTypes.string,
    textColor: PropTypes.string,
    variant: PropTypes.oneOf(["solid", "outline"]),
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
};