import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Importing required libraries and components
import * as SecureStore from "expo-secure-store";

import AppColors from "../config/AppColors";
import AppIcon from "../components/AppIcon";
import AppListItem from "../components/AppListItem";
import AppPicker from "../components/AppPicker";
import AppScreen from "../components/AppScreen";



function MyCharitiesScreen({ navigation }) {

  // Predefined categories for the charity
  const categories = [
    { label: "Show All", value: 1, icon: "apps" },
    { label: "Animal Welfare", value: 2, icon: "paw" },
    { label: "Children & Youth", value: 3, icon: "teddy-bear" },
    { label: "Disaster Relief & Emergency Response", value: 4, icon: "plus-box" },
    { label: "Education and Literacy", value: 5, icon: "school" },
    { label: "Environment & Conservation", value: 6, icon: "sprout" },
    { label: "Health & Medical Research", value: 7, icon: "medical-bag" },
    { label: "Homelessness & Housing", value: 8, icon: "home-group" },
    { label: "Hunger & Povery Alleviation", value: 9, icon: "food-turkey" },
    { label: "Human Rights & Advocacy", value: 10, icon: "hand-back-right" },
    { label: "Mental Health & Wellness", value: 11, icon: "yoga" },
    { label: "Senior Care & Support", value: 12, icon: "human-cane" },
    { label: "International Development & Relief", value: 13, icon: "earth" },
  ];
  
  // State variables
  const [refreshing, setRefreshing] = useState(false);
  const [charities, setCharities] = useState([]);
  const [category, setCategory] = useState(categories[0]);
  const [filteredCharities, setFilteredCharities] = useState([]);

  const handleDelete = async (charity) => {
    // Filter out the deleted charity from both the main and filtered charity lists
    const newCharityList = charities.filter((item) => item.id !== charity.id);
    const newFilteredCharities = filteredCharities.filter(
      (item) => item.id !== charity.id
    );
    setCharities(newCharityList);
    setFilteredCharities(newFilteredCharities);
    await SecureStore.setItemAsync("charities", JSON.stringify(newCharityList));
  };

  // Used to refresh charities when visiting this page. On focus.
  useFocusEffect(
    React.useCallback(() => {
      fetchCharities();
    }, [])
  );

  const fetchCharities = async () => {
    const current_user = JSON.parse(
      await SecureStore.getItemAsync("current_user")
    );
    let existing_charities = await SecureStore.getItemAsync("charities");

    if (!existing_charities) {
      setCharities([]);
    } else {
      const allCharities = JSON.parse(existing_charities).filter(
        (row) => row.userid === current_user.id
      );

      // Filter charities based on the selected category
      let filtered = allCharities;
      if (category && category.label !== "Show All") {
        filtered = allCharities.filter(
          (charity) => charity.category === category.label
        );
      }

      setCharities(allCharities);
      setFilteredCharities(filtered);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  useEffect(() => {
    fetchCharities();
  }, [category]); // Trigger fetchCharities whenever the category changes

  const renderEmptyList = () => {
    // Rendered when the charity list is empty
    return (
      <View style={styles.EmptyContainer}>
        <Text style={styles.EmptyText}>You have no charities</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CREATE")}>
          <Text style={styles.CreateCharityText}>Create a Charity</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <AppScreen style={styles.MyCharitiesContainer}>
      <View style={styles.Filter}>
        <AppPicker
          SelectedItem={category}
          OnSelectedItem={(item) => setCategory(item)}
          data={categories}
          icon="filter"
          placeholder="Filter By Category"
          numColumns={2}
        />
      </View>

      {filteredCharities.length === 0 ? (
        renderEmptyList()
      ) : (
        <FlatList
          data={filteredCharities.length > 0 ? filteredCharities : charities}
          keyExtractor={(charity) => charity.id}
          refreshing={refreshing}
          onRefresh={() => fetchCharities()}
          renderItem={({ item }) => (
            <AppListItem
              title={item.name}
              date={"Date: " + item.date}
              amount={"Amount: " + "$" + item.amount}
              category={"Category: " + item.category}
              image={{ uri: item.image }}
              onPress={() =>
                navigation.navigate("More Information", { charity: item })
              }
              onSwipeLeft={() => (
                <View style={styles.DeleteView}>
                  <TouchableOpacity onPress={() => handleDelete(item)}>
                    <AppIcon
                      name="trash-can"
                      iconColor={AppColors.otherColors}
                      backgroundColor={AppColors.primaryColors}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.Separator} />}
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  
  MyCharitiesContainer: {
    marginTop: 30,
    flex: 1,
  },

  Filter: {
    width: "90%",
    alignSelf: "center",
  },

  EmptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  EmptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },

  CreateCharityText: {
    fontSize: 16,
    textTransform: "uppercase",
    textDecorationLine: "underline",
    color: AppColors.orange,
  },

  DeleteView: {
    backgroundColor: AppColors.orange,
    width: 75,
    justifyContent: "center",
    alignItems: "center",
  },

  Separator: {
    width: "100%",
    height: 2,
    backgroundColor: AppColors.orange,
  },
  
});

export default MyCharitiesScreen;
