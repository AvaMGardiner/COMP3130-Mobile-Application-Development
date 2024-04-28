import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

import AppText from "./AppText";
import AppColors from "../config/AppColors";

function AppListItem({ image, category, title, date, amount, iconComponent, onPress, onSwipeLeft }) {
    return (
        <GestureHandlerRootView>
            <Swipeable renderRightActions={onSwipeLeft}>
                <TouchableOpacity
                    onPress={onPress}
                    underlayColor={AppColors.otherColorsLight}
                >
                    <View style={styles.Container}>
                        {iconComponent}
                        {image && <Image source={image} style={styles.Image} />}
                        <View style={styles.TextContainer}>
                            <AppText style={styles.Title}>{title}</AppText>
                            <AppText style={styles.CategoryText}>
                                {category && category.label
                                    ? category.label
                                    : category}
                            </AppText>
                            <AppText style={styles.OtherText}>{date}</AppText>
                            <AppText style={styles.OtherText}>{amount}</AppText>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    
    Container: {
        flexDirection: "row",
        padding: 10,
    },

    Image: {
        height: 75,
        width: 75,
        marginRight: 20,
        marginLeft: 10,
    },

    Title: {
        fontWeight: "bold",
        textAlign: "left",
        textTransform: "uppercase",
        color: AppColors.green,
    },

    CategoryText: {
        fontSize: 12,
        textAlign: "left",
        flexWrap: "wrap",
    },

    OtherText: {
        fontSize: 12,
        textAlign: "left",
    },

});

export default AppListItem;