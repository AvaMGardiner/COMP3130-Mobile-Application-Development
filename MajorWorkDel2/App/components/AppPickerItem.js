import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import AppColors from '../config/AppColors';
import AppIcon from './AppIcon';
import AppText from './AppText';

function AppPickerItem({onPress, label, icon}) {
    return (
        <TouchableOpacity onPress = {onPress} style = {styles.Container}>
            <AppIcon name = {icon} size = {50} iconColor={AppColors.darkBlue} backgroundColor={AppColors.lightBlue}/>
            <AppText style = {styles.Text}>{label}</AppText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    
    Container: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        width: "50%",
        alignItems: "center",
    },

    Text: {
        fontSize: 15,
        marginVertical: 15,
    },

})

export default AppPickerItem;