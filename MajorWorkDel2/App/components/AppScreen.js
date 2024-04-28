import React from "react";
import { StyleSheet, SafeAreaView, View, Platform } from "react-native";

import Constants from "expo-constants";

import AppColors from "../config/AppColors";

function AppScreen({ children, style }) {
    return (
        <View style={styles.Container}>
            <SafeAreaView style={[styles.Screen, style]}>
                {children}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: AppColors.backgroundColor,
        marginTop: Constants.statusBarHeight,
        marginTop: 0,
    },

    Screen: {
        flex: 1,
    }
});

export default AppScreen;