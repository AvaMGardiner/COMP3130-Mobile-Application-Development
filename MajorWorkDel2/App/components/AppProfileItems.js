import React from "react";
import { StyleSheet, View } from "react-native";

import AppColors from "../config/AppColors";
import AppText from "./AppText";

function AppProfileItems({ FullName, Email }) {
  return (
    <View style={styles.ProfileTextContainer}>
      <AppText style={styles.FullNameText}>{FullName}</AppText>
      <AppText>{Email}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({

  ProfileTextContainer: {
    alignItems: "center",
    marginVertical: 10,
  },

  FullNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.green,
  },

});

export default AppProfileItems;