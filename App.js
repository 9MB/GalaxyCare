import React from 'react';
import { StyleSheet, Text, View, AppLoading } from 'react-native';
import 'react-native-gesture-handler'; //Required by React-Native-Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAssets } from 'expo-asset';
import { useFonts } from 'expo-font';
import LoginScreen from "./screens/LoginScreen";
import JobListScreen from "./screens/JobListScreen";
import RegisterScreen from "./screens/RegisterScreen";

const LoginStack = createStackNavigator();
const AppTab = createBottomTabNavigator();
const isLoggedIn = false;


export default function App() {
  const [assets] = useAssets([require("./assets/images/LoginBackground_GalaxyCare.jpg")]);
  const [fonts] = useFonts({ "SF-Pro-Rounded-Black": require("./assets/fonts/SF-Pro-Rounded-Black.otf"), "SF-Pro-Rounded-Ultralight": require("./assets/fonts/SF-Pro-Rounded-Ultralight.otf"), "SF-Pro-Text-Bold": require("./assets/fonts/SF-Pro-Text-Bold.otf"), "SF-Pro-Text-Regular": require("./assets/fonts/SF-Pro-Text-Regular.otf") })
  if (!assets && !fonts) {
    <AppLoading />
  }
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppTab.Navigator initialRouteName="Job List">
          <AppTab.Screen name="工作日歷" component={JobListScreen} />
          <AppTab.Screen name="報更" component={JobListScreen} />
          <AppTab.Screen name="我的月結單" component={JobListScreen} />
        </AppTab.Navigator>
      ) : (
        <LoginStack.Navigator initialRouteName="Login">
          <LoginStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <LoginStack.Screen name="Register" component={RegisterScreen} options={{ headerStyle: { backgroundColor: "#ffcc00" }, title: "登記", headerTintColor: "white" }} />
        </LoginStack.Navigator>
      )}
    </NavigationContainer>
  );
}


