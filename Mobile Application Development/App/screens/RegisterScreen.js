import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Keyboard, KeyboardAvoidingView, Platform } from "react-native";

// Importing required libraries and components
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import * as SecureStore from "expo-secure-store";

import AppButton from "../components/AppButton";
import AppColors from "../config/AppColors";
import AppLogoText from "../components/AppLogoText";
import AppScreen from "../components/AppScreen";
import AppTextInput from "../components/AppTextInput";
import AppText from "../components/AppText";
import { generateRandomString } from "../config/Common";

function RegisterScreen({ navigation }) {
    // State variables
    const [users, setUsers] = useState([]); // Array of users
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    const [isKeyboardActive, setIsKeyboardActive] = useState(false); // Check if the keyboard is active

    // Form validation schema
    const schema = Yup.object().shape({
        name: Yup.string().required("Full name is required").label("Name"),
        email: Yup.string()
            .required("Email is required")
            .email("Invalid email")
            .label("Email"),
        password: Yup.string()
            .required("Password is required")
            .min(8)
            .max(16)
            .label("Password"),
    });

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

    // Function to update users from local storage
    const updateUsersFromLocal = async () => {
        let existingUsers = await SecureStore.getItemAsync("users");
        if (!existingUsers) {
            await SecureStore.setItemAsync("users", JSON.stringify([]));
        } else {
            setUsers(JSON.parse(existingUsers));
        }
    };

    // Function to validate user registration and add the new user
    const validateUser = ({ name, email, password }) => {
        if (users.find((user) => user.email === email)) {
            return "user-exists"; // User already exists
        } else {
            const newRecord = {
                id: generateRandomString(10),
                name,
                email,
                password,
            };
            addNewUser(newRecord); // Add the new user to the list
            setCurrentUser(newRecord); // Set the current user
            return "success"; // User registration success
        }
    };

    // Function to add a new user to the list and update local storage
    const addNewUser = async (newRecord) => {
        const newUsersList = [...users, newRecord];
        await SecureStore.setItemAsync("users", JSON.stringify(newUsersList));
        setUsers(newUsersList);
    };

    // Function to set the current user in local storage
    const setCurrentUser = async (newRecord) => {
        await SecureStore.setItemAsync(
            "current_user",
            JSON.stringify(newRecord)
        );
    };

    return (
        <AppScreen>
            {!isKeyboardActive && (
                <View style={styles.RegisterContainer}>
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
                    initialValues={{ name: "", email: "", password: "" }}
                    onSubmit={(values, { resetForm }) => {
                        const response = validateUser(values); // Validate user registration
                        console.log("response", response);
                        if (response === "success") {
                            resetForm();
                            navigation.navigate("Login"); // Navigate to the login screen
                        } else if (response === "user-exists") {
                            resetForm();
                            alert(
                                "Invalid Signup Details. User already exists."
                            ); // Display error message for existing user
                        } else {
                            resetForm();
                        }
                    }}
                    validationSchema={schema}
                >
                    {({
                        handleChange,
                        handleSubmit,
                        touched,
                        setFieldTouched,
                        errors,
                    }) => (
                        <>
                            <View style={styles.TextInputContainer}>
                                <AppTextInput
                                    icon="account"
                                    placeholder="Full Name"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={handleChange("name")}
                                    onBlur={() => setFieldTouched("name")}
                                />
                                {touched.name && (
                                    <AppText style={styles.ErrorMessages}>
                                        {errors.name}
                                    </AppText>
                                )}
                                <AppTextInput
                                    icon="email"
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={handleChange("email")}
                                    onBlur={() => setFieldTouched("email")}
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
                                    title="REGISTER"
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
    
    RegisterContainer: {
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

export default RegisterScreen;