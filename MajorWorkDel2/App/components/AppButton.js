import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import AppColors from "../config/AppColors";

function AppButton({ title, color = "orange", onPress }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={[styles.Button, { backgroundColor: AppColors[color] }]}
            >
                <Text style={styles.Text}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    Button: {
        backgroundColor: AppColors.orange,
        borderRadius: 20,
        width: "100%",
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },

    Text: {
        color: AppColors.backgroundColor,
        fontSize: 20,
        textTransform: "uppercase",
        fontWeight: "bold",
    },
});

export default AppButton;