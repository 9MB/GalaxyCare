import React from "react";
import { StyleSheet, Text, View, AppLoading } from "react-native";
import "react-native-gesture-handler"; //Required by React-Native-Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import LoginScreen from "./screens/LoginScreen";
import JobListScreen from "./screens/JobListScreen";
import RegisterScreen from "./screens/RegisterScreen";
import * as SplashScreen from "expo-splash-screen";

const LoginStack = createStackNavigator();
const AppTab = createBottomTabNavigator();
const isLoggedIn = false;

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          "SF-Pro-Rounded-Black": require("./assets/fonts/SF-Pro-Rounded-Black.otf"),
          "SF-Pro-Rounded-Ultralight": require("./assets/fonts/SF-Pro-Rounded-Ultralight.otf"),
          "SF-Pro-Text-Bold": require("./assets/fonts/SF-Pro-Text-Bold.otf"),
          "SF-Pro-Text-Regular": require("./assets/fonts/SF-Pro-Text-Regular.otf"),
        });
        await Asset.loadAsync([
          require("./assets/images/LoginBackground_GalaxyCare.jpg"),
          require("./assets/images/registerImage.png"),
        ]);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
      } catch (e) {
        console.log("Error",e)
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);


  if (!appIsReady) {
    return null;
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
          <LoginStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <LoginStack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerStyle: { backgroundColor: "#ffcc00" },
              title: "登記",
              headerTintColor: "white",
            }}
          />
        </LoginStack.Navigator>
      )}
      
    </NavigationContainer>
  );
}
