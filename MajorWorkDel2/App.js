import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './App/navigation/AuthNavigator';
import NewCharityScreen from './App/screens/NewCharityScreen';
import TabNavigator from './App/navigation/TabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthNavigator/>
    </NavigationContainer>
  );
}

