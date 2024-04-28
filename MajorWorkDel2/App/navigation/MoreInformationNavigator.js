import React from 'react';

import { createStackNavigator } from "@react-navigation/stack";

import MyCharitiesScreen from '../screens/MyCharitiesScreen';
import MoreInformationScreen from '../screens/MoreInformationScreen';
import UpdateCharityScreen from '../screens/UpdateCharityScreen';


const AppStack = createStackNavigator();

const AuthNavigator = () => (
    <AppStack.Navigator>
        <AppStack.Screen name = "Charities" component = {MyCharitiesScreen} options={{headerShown:false}}/>
        <AppStack.Screen name = "More Information" component = {MoreInformationScreen}/>
        <AppStack.Screen name = "Update Charity" component = {UpdateCharityScreen}/>
    </AppStack.Navigator>
)

export default AuthNavigator;