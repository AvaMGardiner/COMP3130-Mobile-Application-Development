import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from "react-native";

// Importing required libraries and components
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as SecureStore from "expo-secure-store";

import AppColors from "../config/AppColors";
import AppButton from "../components/AppButton";
import AppIcon from "../components/AppIcon";
import AppPicker from "../components/AppPicker";
import AppScreen from "../components/AppScreen";
import AppTextInput from "../components/AppTextInput";
import AppText from "../components/AppText";

function UpdateCharityScreen({ navigation, route, onCharityUpdate }) {

    // Predefined categories for the charity
    const categories = [
        { label: "Animal Welfare", value: 1, icon: "paw" },
        { label: "Children & Youth", value: 2, icon: "teddy-bear" },
        { label: "Disaster Relief & Emergency Response", value: 3, icon: "plus-box" },
        { label: "Education and Literacy", value: 4, icon: "school" },
        { label: "Environment & Conservation", value: 5, icon: "sprout" },
        { label: "Health & Medical Research", value: 6, icon: "medical-bag" },
        { label: "Homelessness & Housing", value: 7, icon: "home-group", backgroundColor: "red" },
        { label: "Hunger & Povery Alleviation", value: 8, icon: "food-turkey", backgroundColor: "red" },
        { label: "Human Rights & Advocacy", value: 9, icon: "hand-back-right" },
        { label: "Mental Health & Wellness", value: 10, icon: "yoga", backgroundColor: "red" },
        { label: "Senior Care & Support", value: 11, icon: "human-cane", backgroundColor: "red" },
        { label: "International Development & Relief", value: 12, icon: "earth" },
    ];

    // State variables to manage form inputs and errors
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState(route.params.charityName || "");
    const [date, setDate] = useState(route.params.donationDate || "");
    const [subtitle, setSubtitle] = useState(route.params.donationAmount || "");
    const [category, setCategory] = useState(route.params.category || null);
    const [imageUri, setImageUri] = useState(route.params.photo || null);

    const [titleError, setTitleError] = useState("");
    const [dateError, setDateError] = useState("");
    const [subtitleError, setSubtitleError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [imageError, setImageError] = useState("");

    // Function to pick an image from the device's library
    const pickImage = async () => {
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
            setImageUri(result.uri);
            setImageError("");
        }
    };

    // Function to perform error checks on form inputs
    const doErrorCheck = () => {
        setTitleError(title.length > 0 ? "" : "Provide a Charity Name");
        setDateError(date.length > 0 ? "" : "Provide a Date of Donation");
        setSubtitleError(
            subtitle.length > 0 ? "" : "Provide a Donation Amount"
        );
        setCategoryError(category ? "" : "Select a Category");
        setImageError(imageUri ? "" : "Provide an Image");
        return title.length > 0 &&
            date.length > 0 &&
            subtitle.length > 0 &&
            category &&
            imageUri
            ? true
            : false;
    };

    // Function to reset form inputs
    const resetForm = () => {
        setCategory("");
        setTitle("");
        setDate("");
        setSubtitle("");
        setImageUri("");
    };

    const [isKeyboardActive, setIsKeyboardActive] = useState(false);

    // Listen for keyboard show/hide events
    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", () =>
            setIsKeyboardActive(true)
        );
        Keyboard.addListener("keyboardDidHide", () =>
            setIsKeyboardActive(false)
        );

        return () => {
            Keyboard.removeListener("keyboardDidShow", () =>
                setIsKeyboardActive(true)
            );
            Keyboard.removeListener("keyboardDidHide", () =>
                setIsKeyboardActive(false)
            );
        };
    }, []);

    // Fetch the current user from secure storage
    useEffect(() => {
        getCurrentUser();
    }, []);

    const getCurrentUser = async () => {
        const current_user = JSON.parse(
            await SecureStore.getItemAsync("current_user")
        );
        setUser(current_user);
    };

    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    // Show the date picker
    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    // Hide the date picker
    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    // Handle date selection from the date picker
    const handleDateConfirm = (date) => {
        const formattedDate = date.toISOString().split("T")[0]; // Format the selected date as a string in the format 'YYYY-MM-DD'
        setDate(formattedDate);
        hideDatePicker();
    };

    // Function to update the charity
    const doAddCharity = async () => {
         // Remove the ".00" from the donation amount if it exists
         const amount = subtitle.endsWith(".00")
         ? subtitle.slice(0, -3)
         : subtitle;
        const updatedRecord = {
            userid: user.id,
            id: route.params.charity.id,
            name: title,
            date,
            amount: `${amount}.00`,
            category: category.label,
            image: imageUri,
        };
        await updateCharities(updatedRecord);
        navigation.goBack();
    };

    // Function to update the list of charities in secure storage
    const updateCharities = async (updatedRecord) => {
        let existing_charities = await SecureStore.getItemAsync("charities");
        if (!existing_charities) {
            existing_charities = [];
        } else {
            existing_charities = JSON.parse(existing_charities);
        }

        const updatedCharities = existing_charities.map((charity) => {
            if (charity.id === updatedRecord.id) {
                return updatedRecord; // Update the existing charity with the updated record
            }
            return charity; // Keep other charities unchanged
        });

        await SecureStore.setItemAsync(
            "charities",
            JSON.stringify(updatedCharities)
        );
        onCharityUpdate(updatedRecord); // Trigger the update in the MoreInformationScreen
    };

    return (
        <AppScreen>
            {!isKeyboardActive && (
                <View style={styles.ImageContainer}>
                    <TouchableOpacity
                        style={styles.IconContainer}
                        onPress={pickImage}
                    >
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.Icon}
                            />
                        ) : (
                            <AppIcon
                                name="camera"
                                size={100}
                                iconColor={AppColors.darkBlue}
                            />
                        )}
                    </TouchableOpacity>

                    {imageError.length > 0 && !imageUri ? (
                        <AppText style={styles.ErrorMessages}>
                            {imageError}
                        </AppText>
                    ) : null}
                </View>
            )}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.KeyboardAvoidingView}
            >
                <View style={styles.TextInputContainer}>
                    <AppTextInput
                        icon="charity"
                        placeholder="Charity Name"
                        value={title}
                        onChangeText={(inputText) => setTitle(inputText)}
                    />

                    {titleError.length > 0 ? (
                        <AppText style={styles.ErrorMessages}>
                            {titleError}
                        </AppText>
                    ) : (
                        <></>
                    )}

                    <TouchableOpacity onPress={showDatePicker}>
                        <AppTextInput
                            icon="calendar-range"
                            placeholder="Date of Donation"
                            value={date}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {dateError.length > 0 ? (
                        <AppText style={styles.ErrorMessages}>
                            {dateError}
                        </AppText>
                    ) : (
                        <></>
                    )}

                    <AppTextInput
                        icon="currency-usd"
                        placeholder="Donation Amount"
                        value={subtitle}
                        keyboardType="numeric"
                        onChangeText={(inputText) => {
                            // Check if the input text ends with ".00"
                            const isCompleteAmount = inputText.endsWith(".00");
                            // Update the state with the input text
                            setSubtitle(inputText);
                            // Add or remove ".00" based on the completion of the amount
                            setSubtitleError(
                                isCompleteAmount || inputText === ""
                                    ? ""
                                    : "Provide a Donation Amount"
                            );
                        }}
                    />

                    {subtitleError.length > 0 ? (
                        <AppText style={styles.ErrorMessages}>
                            {subtitleError}
                        </AppText>
                    ) : (
                        <></>
                    )}

                    <AppPicker
                        SelectedItem={category}
                        OnSelectedItem={(item) => setCategory(item)}
                        data={categories}
                        icon="apps"
                        placeholder="Charity Categories"
                        numColumns={2}
                    />

                    {categoryError.length > 0 ? (
                        <AppText style={styles.ErrorMessages}>
                            {categoryError}
                        </AppText>
                    ) : (
                        <></>
                    )}
                </View>
                <View style={styles.AddCharityButton}>
                    <AppButton
                        title="Update Charity"
                        onPress={() => {
                            if (doErrorCheck()) {
                                doAddCharity();
                                resetForm();
                                navigation.navigate("Charities");
                            }
                        }}
                    />
                </View>
            </KeyboardAvoidingView>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
            />
        </AppScreen>
    );
}

const styles = StyleSheet.create({
    ImageContainer: {
        textAlign: "center",
    },

    IconContainer: {
        backgroundColor: AppColors.lightBlue,
        borderColor: AppColors.darkBlue,
        color: "red",
        width: 100,
        height: 100,
        borderWidth: 2,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "5%",
        marginBotton: "5%",
    },

    Icon: {
        width: 100,
        height: 100,
        borderColor: AppColors.darkBlue,
    },

    KeyboardAvoidingView: {
        flex: 1,
    },

    TextInputContainer: {
        width: "80%",
        alignSelf: "center",
    },

    ErrorMessages: {
        color: "red",
        marginBottom: 10,
    },

    AddCharityButton: {
        width: "80%",
        alignSelf: "center",
    },
});

export default UpdateCharityScreen;
