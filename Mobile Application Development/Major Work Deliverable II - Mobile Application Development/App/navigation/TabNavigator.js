import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AppColors from '../config/AppColors';
import AppIcon from '../components/AppIcon';

import HomeScreen from '../screens/HomeScreen';
import NewCharityScreen from '../screens/NewCharityScreen';
import MoreInformationNavigator from '../navigation/MoreInformationNavigator';

const AppTab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <AppTab.Navigator tabBarOptions={{activeTintColor: AppColors.black}}>
            <AppTab.Screen name="HOME" component={HomeScreen} options={{tabBarIcon: ({ focused }) => (<AppIcon size={focused ? 40 : 30} name="home" iconColor={focused ? AppColors.green : AppColors.black}/>), headerShown: false}}/>
            <AppTab.Screen name="CREATE"component={NewCharityScreen} options={{tabBarIcon: ({ focused }) => (<AppIcon size={focused ? 40 : 30} name="folder-plus" iconColor={focused ? AppColors.green : AppColors.black}/>), headerShown: false}}/>
            <AppTab.Screen name="MYCHARITIES" component={MoreInformationNavigator} options={{tabBarIcon: ({ focused }) => (<AppIcon size={focused ? 40 : 30} name="hand-heart" iconColor={focused ? AppColors.green : AppColors.black}/>), headerShown: false}}/>
        </AppTab.Navigator>
    );
};

export default TabNavigator;
