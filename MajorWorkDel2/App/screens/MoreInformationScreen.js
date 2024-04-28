import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";

// Importing required libraries and components
import * as SecureStore from "expo-secure-store";

import AppColors from "../config/AppColors";
import AppIcon from "../components/AppIcon";
import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";

function MoreInformationScreen({ navigation, route }) {
    // Get the charity object from the route parameters
    const { charity } = route.params;
    // State variables
    const [charities, setCharities] = useState([]);
    const [isTextInputFocused, setIsTextInputFocused] = useState(false);

    useEffect(() => {
        fetchCharities();
    }, []);

    // Fetch the charities from the local storage
    const fetchCharities = async () => {
        const existingCharities = await SecureStore.getItemAsync("charities");

        if (!existingCharities) {
            setCharities([]);
        } else {
            const parsedCharities = JSON.parse(existingCharities);
            setCharities(parsedCharities);
        }
    };

    // Handle the delete operation for a charity
    const handleDelete = async (charity) => {
        const newCharityList = charities.filter(
            (item) => item.id !== charity.id
        );
        setCharities(newCharityList);
        await SecureStore.setItemAsync(
            "charities",
            JSON.stringify(newCharityList)
        );
        navigation.goBack(); // Navigate back to the previous screen
    };

    // Handle the update operation for a charity
    const handleCharityUpdate = useCallback(
        (updatedCharity) => {
            const updatedCharities = charities.map((charity) => {
                if (charity.id === updatedCharity.id) {
                    return updatedCharity;
                }
                return charity;
            });
            setCharities(updatedCharities);
        },
        [charities]
    );

    // Handle the change in notes for a charity
    const handleNotesChange = async (text, charity) => {
        const updatedCharities = charities.map((item) => {
            if (item.id === charity.id) {
                return { ...item, notes: text };
            }
            return item;
        });
        setCharities(updatedCharities);
        await SecureStore.setItemAsync(
            "charities",
            JSON.stringify(updatedCharities)
        );
    };

    useEffect(() => {
        if (route.params && route.params.updatedCharity) {
            handleCharityUpdate(route.params.updatedCharity);
        }
    }, [route.params, handleCharityUpdate]);

    // Handle the focus event of the text input
    const handleFocus = useCallback(() => {
        setIsTextInputFocused(true);
    }, []);

    // Handle the blur event of the text input
    const handleBlur = useCallback(() => {
        setIsTextInputFocused(false);
    }, []);

    return (
        <AppScreen style={styles.MoreInformationContainer}>
            <ScrollView>
                <View style={styles.ImageContainer}>
                    <Image
                        source={{ uri: charity.image }}
                        style={styles.Image}
                    />
                    <View style={styles.EditDeleteContainer}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("Update Charity", {
                                    charity,

                                    onCharityUpdate: handleCharityUpdate, // Pass the handleCharityUpdate function as a prop
                                    photo: charity.image,
                                    charityName: charity.name,
                                    donationDate: charity.date,
                                    donationAmount: charity.amount,
                                    category: { label: charity.category },
                                })
                            }
                        >
                            <AppIcon
                                name="pencil"
                                size={30}
                                iconColor={AppColors.darkBlue}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(charity)}>
                            <AppIcon
                                name="trash-can"
                                size={30}
                                iconColor={AppColors.darkBlue}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.CharityDetails}>
                    <AppText style={styles.CharityTitle}>
                        {charity.name}
                    </AppText>
                    <AppText style={styles.Category}>
                        {"Category: " + charity.category}
                    </AppText>
                    <AppText style={styles.CharityDate}>
                        {"Date of Donation: " + charity.date}
                    </AppText>
                    <AppText style={styles.CharityAmount}>
                        {"Donation Amount: $" + charity.amount}
                    </AppText>
                    <View
                        style={[
                            styles.NotesInput,
                            isTextInputFocused
                                ? styles.TextInputFocused
                                : styles.TextInputBlur,
                        ]}
                    >
                        <TextInput
                            placeholder="Add extra notes..."
                            multiline
                            numberOfLines={3}
                            value={charity.notes}
                            onChangeText={(text) =>
                                handleNotesChange(text, charity)
                            }
                            onFocus={handleFocus}
                            onBlur={handleBlur} // Add onBlur event handler
                        />
                    </View>
                </View>
            </ScrollView>
        </AppScreen>
    );
}

const styles = StyleSheet.create({
    MoreInformationContainer: {
        flex: 1,
    },

    ImageContainer: {
        marginTop: 10,
        width: "90%",
        alignSelf: "center",
    },

    Image: {
        width: "100%",
        height: 150,
        alignSelf: "center",
    },

    EditDeleteContainer: {
        flexDirection: "row",
        marginTop: 5,
        alignSelf: "flex-end",
    },

    CharityDetails: {
        width: "80%",
        alignSelf: "center",
    },

    CharityTitle: {
        textTransform: "uppercase",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "left",
        color: AppColors.green,
    },

    Category: {
        textAlign: "left",
        fontSize: 13,
    },

    CharityDate: {
        textAlign: "left",
        fontSize: 13,
    },

    CharityAmount: {
        textAlign: "left",
        fontSize: 13,
    },

    NotesInput: {
        width: "100%",
        alignItems: "center",
        alignSelf: "center",
        borderWidth: 3,
        borderRadius: 5,
        marginVertical: 30,
    },

    TextInputFocused: {
        borderColor: AppColors.green,
    },

    TextInputBlur: {
        borderColor: AppColors.darkBlue,
    },
});

export default MoreInformationScreen;
