import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Importing required libraries and components
import { Formik } from "formik";
import * as SecureStore from "expo-secure-store";
import * as Yup from "yup";

import AppButton from "../components/AppButton";
import AppColors from "../config/AppColors";
import AppLogoText from "../components/AppLogoText";
import AppScreen from "../components/AppScreen";
import AppTextInput from "../components/AppTextInput";
import AppText from "../components/AppText";

// Validation schema for the login form
const schema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(4).max(8).label("Password"),
});

function LoginScreen({ navigation }) {
    // State variables
    const [users, setUsers] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  // Hook to listen for keyboard events and update state accordingly
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardActive(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardActive(false)
    );

    // Load user data from local storage
    updateUsersFromLocal();

    // Clean up keyboard event listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

    // Validate user credentials and set the current user if valid
    const validateUser = ({ email, password }) => {
        const existingUser = users.filter(
            (user) => user.email === email && user.password === password
        );
        existingUser &&
            existingUser.length > 0 &&
            setCurrentUser(existingUser[0]);
        return !!existingUser;
    };

    // Set the current user in secure storage
    const setCurrentUser = async (newRecord) => {
        await SecureStore.setItemAsync(
            "current_user",
            JSON.stringify(newRecord)
        );
    };

    // Load users from secure storage
    const updateUsersFromLocal = async () => {
        let existingUsers = await SecureStore.getItemAsync("users");

        if (!existingUsers) {
            // If no users exist, initialize an empty array in secure storage
            await SecureStore.setItemAsync("users", JSON.stringify([]));
        } else {
            setUsers(JSON.parse(existingUsers));
        }
    };

    return (
        <AppScreen>
            {!isKeyboardActive && (
                <View style={styles.LoginContainer}>
                    <Image
                        style={styles.Logo}
                        source={require("../assets/MyImages/WorldChangerLogo.png")}
                    />
                    <AppLogoText style={styles.LogoText}>
                        WORLDCHANGER
                    </AppLogoText>
                </View>
            )}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.KeyboardAvoidingView}
            >
                <Formik
                    initialValues={{ email: "", password: "" }}
                    onSubmit={(values, { resetForm }) => {
                        if (validateUser(values)) {
                            resetForm();
                            navigation.navigate("Home");
                        } else {
                            resetForm();
                            alert("Invalid Login Details");
                        }
                    }}
                    validationSchema={schema}
                >
                    {({
                        values,
                        handleChange,
                        handleSubmit,
                        touched,
                        setFieldTouched,
                        errors,
                    }) => (
                        <>
                            <View style={styles.TextInputContainer}>
                                <AppTextInput
                                    icon="email"
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="emailAddress"
                                    value={values.email}
                                    onBlur={() => setFieldTouched("email")}
                                    onChangeText={handleChange("email")}
                                />
                                {touched.email && (
                                    <AppText style={styles.ErrorMessages}>
                                        {errors.email}
                                    </AppText>
                                )}
                                <View style={styles.PasswordContainer}>
                                    <AppTextInput
                                        icon="lock"
                                        placeholder="Password"
                                        secureTextEntry={!showPassword}
                                        textContentType="password"
                                        value={values.password}
                                        onBlur={() =>
                                            setFieldTouched("password")
                                        }
                                        onChangeText={handleChange("password")}
                                    />
                                    <View style={styles.PasswordIconContainer}>
                                        <MaterialCommunityIcons
                                            name={
                                                showPassword ? "eye-off" : "eye"
                                            }
                                            size={20}
                                            color={AppColors.mediumGrey}
                                            onPress={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            style={styles.PasswordIcon}
                                        />
                                    </View>
                                </View>
                                {touched.password && (
                                    <AppText style={styles.ErrorMessages}>
                                        {errors.password}
                                    </AppText>
                                )}
                            </View>
                            <View style={styles.ButtonContainer}>
                                <AppButton
                                    title="LOGIN"
                                    onPress={handleSubmit}
                                />
                            </View>
                        </>
                    )}
                </Formik>
            </KeyboardAvoidingView>
        </AppScreen>
    );
}

const styles = StyleSheet.create({

    LoginContainer: {
        justifyContent: "center",
        alignItems: "center",
    },

    Logo: {
        width: 150,
        height: 150,
    },

    LogoText: {
        fontSize: 20,
        fontWeight: "bold",
    },

    KeyboardAvoidingView: {
        flex: 1,
        marginTop: 40,
    },

    TextInputContainer: {
        width: "80%",
        alignSelf: "center",
    },

    PasswordContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    PasswordIconContainer: {
        position: "absolute",
        right: 0,
    },

    PasswordIcon: {
        padding: 10,
    },

    ErrorMessages: {
        color: "red",
        alignSelf: "flex-start",
        marginBottom: 10,
    },

    ButtonContainer: {
        marginTop: 20,
        width: "80%",
        alignSelf: "center",
    },
    
});

export default LoginScreen;