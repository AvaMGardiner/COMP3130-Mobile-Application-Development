import React from "react";
import { StyleSheet, Text } from "react-native";

import AppColors from "../config/AppColors";

function AppLogoText(props) {
  return (
    <Text style={[styles.Text, props.style]}>
      <Text style={styles.World}>WORLD</Text>
      <Text style={styles.Changer}>CHANGER</Text>
    </Text>
  );
}

const styles = StyleSheet.create({

  Text: {
    fontSize: 30,
    fontWeight: "bold",
  },

  World: {
    color: AppColors.black,
  },

  Changer: {
    color: AppColors.orange,
  },

});

export default AppLogoText;