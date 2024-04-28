import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Modal, Button, FlatList } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppColors from "../config/AppColors";
import AppPickerItem from "./AppPickerItem";
import AppScreen from "./AppScreen";
import AppText from "./AppText";

function AppPicker({ data, icon, placeholder, numColumns, SelectedItem, OnSelectedItem }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [iconClicked, setIconClicked] = useState(false);

  const handlePressIn = () => {
    setPressed(true);
    setIconClicked(true);
  };

  const handlePressOut = () => {
    setPressed(false);
    setIconClicked(false);
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => setModalVisible(true)}
      >
        <View
          style={[
            styles.Container,
            {
              borderColor: pressed ? AppColors.blue : AppColors.darkBlue,
            },
          ]}
        >
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={iconClicked ? AppColors.blue : AppColors.darkBlue}
              onPress={() => setIconClicked(!iconClicked)}
              style={styles.Icon}
            />
          )}
          <AppText style={styles.Text}>
            {SelectedItem ? SelectedItem.label : placeholder}
          </AppText>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={AppColors.darkBlue}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="slide">
        <AppScreen>
          <Button title="Close" onPress={() => setModalVisible(false)} />
          <FlatList
            numColumns={numColumns}
            data={data}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <AppPickerItem
                onPress={() => {
                  setModalVisible(false);
                  OnSelectedItem(item);
                }}
                label={item.label}
                icon={item.icon}
                backgroundColor={item.backgroundColor}
              />
            )}
          />
        </AppScreen>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({

  Container: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 20,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },

  Icon: {
    marginRight: 10,
  },

  Text: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Roboto",
    color: AppColors.darkBlue,
  },
});

export default AppPicker;