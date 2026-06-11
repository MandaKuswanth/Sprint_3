import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../utils/colors";

export default function AppContainer({
    children,
    style,
}) {
    return (
        <SafeAreaView
            style={[
                styles.container,
                style,
            ]}
        >
            {children}
        </SafeAreaView>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
};