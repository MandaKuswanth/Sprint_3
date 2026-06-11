import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../utils/colors";
import PropTypes from "prop-types";

export default function AppContainer({ children, style }) {
    return (
        <SafeAreaView
            style={[
                {
                    flex: 1,
                    backgroundColor: COLORS.background,
                },
                style,
            ]}
        >
            {children}
        </SafeAreaView>
    );
}

AppContainer.propTypes = {
    children: PropTypes.node,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};