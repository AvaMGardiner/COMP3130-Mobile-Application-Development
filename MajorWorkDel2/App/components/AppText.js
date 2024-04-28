import React from "react";
import { Text, StyleSheet } from "react-native";

import AppColors from "../config/AppColors";

function AppText({ style, children }) {
    return <Text style={[styles.Text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
    Text: {
        fontSize: 15,
        fontFamily: "Roboto",
        textAlign: "center",
        color: AppColors.black,
    },
});

export default AppText;