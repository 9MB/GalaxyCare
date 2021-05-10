import React from "react";
import "react-native-gesture-handler"; //Required by React-Native-Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import AppLoading from 'expo-app-loading';


import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import JobListScreen from "./screens/JobListScreen";
import JobCalendarScreen from "./screens/JobCalendarScreen";
import JobBalanceScreen from "./screens/JobBalanceScreen";
import InfoReceivedScreen from "./screens/InfoReceivedScreen";
import StickerCreatingScreen from "./screens/StickerCreatingScreen";

import auth from '@react-native-firebase/auth';

const LoginStack = createStackNavigator();
const CalendarStack = createStackNavigator();
const AppTab = createBottomTabNavigator();

function Calendar(){
  return(
    <CalendarStack.Navigator initialRouteName="工作日歷">
      <CalendarStack.Screen name="工作日歷" component={JobCalendarScreen} options={{headerShown:false}}/>
      <CalendarStack.Screen name="常用事項" component={StickerCreatingScreen} options={{headerStyle: { backgroundColor: "#ffcc00" },headerTintColor: "white"}}/>
    </CalendarStack.Navigator>
  )
}

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

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
        require("./assets/images/CheckMark.png")
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

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


  if (!appIsReady) {
    return (
    <AppLoading
    startAsync={prepare}
    onFinish={() => setAppIsReady(true)}
    onError={console.warn}
    />
    )
  }

  return (
    <NavigationContainer>
      {user && auth().currentUser.emailVerified ? (
        <AppTab.Navigator initialRouteName="工作日歷">
          <AppTab.Screen name="工作日歷" component={Calendar} />
          <AppTab.Screen name="報更" component={JobListScreen} />
          <AppTab.Screen name="我的月結單" component={JobBalanceScreen} />
        </AppTab.Navigator>
      ) : (
        <LoginStack.Navigator initialRouteName="Login">
          <LoginStack.Screen
            name="登入"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <LoginStack.Screen
            name="登記"
            component={RegisterScreen}
            options={{
              headerStyle: { backgroundColor: "#ffcc00" },
              title: "登記",
              headerTintColor: "white",
            }}
          />
          <LoginStack.Screen
            name="InfoReceived"
            component={InfoReceivedScreen}
            options={{ headerShown: false }}
          />
        </LoginStack.Navigator>
      )}
      
    </NavigationContainer>
  );
}
