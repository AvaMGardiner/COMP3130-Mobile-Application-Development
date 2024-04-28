import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppColors from "../config/AppColors";

function AppTextInput({ icon, ...otherProps }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const textInputStyle = [
    styles.TextInput,
    { color: isFocused ? AppColors.darkBlue : "#000" },
  ];
  const iconColor = isFocused ? AppColors.darkBlue : "#8E8E93";

  return (
    <View style={styles.Container}>
      {icon && (
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      )}
      <TextInput
        style={textInputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  Container: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.darkBlue,
  },

  TextInput: {
    fontFamily: "Roboto",
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
  },
  
});

export default AppTextInput;