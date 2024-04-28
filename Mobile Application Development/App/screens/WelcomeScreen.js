import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Image, Animated, Easing } from "react-native";

// Importing required libraries and components
import * as SecureStore from "expo-secure-store";

import AppButton from "../components/AppButton";
import AppColors from "../config/AppColors";
import AppIcon from "../components/AppIcon";
import AppLogoText from "../components/AppLogoText";
import AppScreen from "../components/AppScreen";

function WelcomeScreen({ navigation }) {
    const iconAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animation loop for the rotating icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(iconAnimation, {
                    toValue: 1,
                    duration: 250,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(iconAnimation, {
                    toValue: 0.5,
                    duration: 250,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(iconAnimation, {
                    toValue: 0,
                    duration: 250,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.delay(500),
                Animated.timing(iconAnimation, {
                    toValue: 0.75,
                    duration: 250,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(iconAnimation, {
                    toValue: 1,
                    duration: 250,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ]),
            { iterations: 1 }
        ).start();
    }, []);

    useEffect(() => {
        // Check if user is already logged in
        checkIfUserLoggedIn();
    }, []);

    const checkIfUserLoggedIn = async () => {
        // Retrieve the current user from secure storage
        const current_user = JSON.parse(
            await SecureStore.getItemAsync("current_user")
        );
        if (current_user) {
            // If user is logged in, navigate to Home screen
            navigation.navigate("Home");
        }
    };

    const interpolatedRotateAnimation = iconAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "1800deg"],
    });

    return (
        <AppScreen>
            <View style={styles.WelcomeContainer}>
                <Image
                    style={styles.Logo}
                    source={require("../assets/MyImages/WorldChangerLogo.png")}
                />
                <AppLogoText>WORLDCHANGER</AppLogoText>
            </View>
            <Animated.View
                style={[
                    styles.IconContainer,
                    {
                        transform: [{ rotate: interpolatedRotateAnimation }],
                    },
                ]}
            >
                <AppIcon
                    name="arrow-down-drop-circle"
                    size={80}
                    iconColor={AppColors.darkBlue}
                />
            </Animated.View>
            <View style={styles.ButtonsContainer}>
                <AppButton
                    title="Login"
                    onPress={() => navigation.navigate("Login")}
                />
                <AppButton
                    title="Register"
                    color="black"
                    onPress={() => navigation.navigate("Register")}
                />
            </View>
        </AppScreen>
    );
}

const styles = StyleSheet.create({
    
    WelcomeContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: "25%",
    },

    Logo: {
        height: 200,
        width: 200,
    },

    IconContainer: {
        alignItems: "center",
    },

    ButtonsContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignSelf: "center",
        width: "70%",
    },
    
});

export default WelcomeScreen;