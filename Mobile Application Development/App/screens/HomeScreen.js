import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from "react-native";

// Importing required libraries and components
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

import AppButton from "../components/AppButton";
import AppColors from "../config/AppColors";
import AppIcon from "../components/AppIcon";
import AppProfileItems from "../components/AppProfileItems";
import AppScreen from "../components/AppScreen";

function HomeScreen({ navigation }) {
    // State variables
    const [imageUri, setImageUri] = useState(null); // State to store the selected image URI
    const [user, setUser] = useState(null); // State to store the current user data

    const pickImage = async () => {
        // Function to pick an image from the device's media library
        const {
            status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImageUri(result.uri); // Set the selected image URI in state
        }
    };

    useEffect(() => {
        getCurrentUser(); // Fetch the current user data when the component mounts
    }, []);

    const getCurrentUser = async () => {
        // Function to get the current user data from SecureStore
        const current_user = JSON.parse(
            await SecureStore.getItemAsync("current_user")
        );
        setUser(current_user); // Set the current user data in state
    };

    const signOutUser = async () => {
        // Function to sign out the user and navigate to the logout screen
        await SecureStore.deleteItemAsync("current_user"); // Remove the current user data from SecureStore
        navigation.navigate("Logout"); // Navigate to the Logout screen
      };
      

    return (
        <AppScreen>
            <View style={styles.AccountContainer}>
                <TouchableOpacity
                    style={styles.IconContainer}
                    onPress={pickImage}
                >
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.Icon} />
                    ) : (
                        <AppIcon
                            name="account-plus-outline"
                            size={100}
                            iconColor={AppColors.darkBlue}
                        />
                    )}
                </TouchableOpacity>
                {user && (
                    <AppProfileItems FullName={user.name} Email={user.email} />
                )}

                <View style={styles.ButtonContainer}>
                    <AppButton title="LOGOUT" onPress={() => signOutUser()} />
                </View>
            </View>
        </AppScreen>
    );
}

const styles = StyleSheet.create({
    AccountContainer: {
        marginVertical: 80,
        alignItems: "center",
    },

    IconContainer: {
        backgroundColor: AppColors.lightBlue,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: AppColors.darkBlue,
        alignItems: "center",
        justifyContent: "center",
    },

    Icon: {
        width: 100,
        height: 100,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: AppColors.darkBlue,
    },

    ButtonContainer: {
        alignSelf: "center",
        width: "50%",
        marginVertical: 20,
    },

});

export default HomeScreen;