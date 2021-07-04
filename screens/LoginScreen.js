import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundImage = require("../assets/images/LoginBackground_GalaxyCare.jpg");

export default function LoginScreen({ navigation }) {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");

  const login = async () => {
    await auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          if (!auth().currentUser.emailVerified) {
            Alert.alert("請先到電子郵箱驗證您的電子郵件");
          }
        }
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/invalid-email") {
          Alert.alert("電子郵件格式不正確");
        } else if (errorCode == "auth/user-disabled") {
          Alert.alert("帳號已被停用，請與客戶服務聯絡");
        } else if (errorCode == "auth/user-not-found") {
          Alert.alert("此電郵地址未有註冊");
        } else if (errorCode == "auth/wrong-password") {
          Alert.alert("電郵地址或密碼不正確");
        } else {
          Alert.alert(errorCode || errorMessage);
        }
      });
  };
  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.image}>
        <Text style={styles.title}>Galaxy Care</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="您的電郵地址"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="密碼"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={() => login()}>
              登入
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={() => {
                navigation.navigate("登記");
              }}
            >
              預約登記
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  title: {
    fontSize: 55,
    alignSelf: "center",
    fontFamily: "SF-Pro-Rounded-Ultralight",
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    width: "75%",
    alignSelf: "center",
    borderRadius: 5,
    minHeight: 40,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    minHeight: 40,
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    margin: 15,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "SF-Pro-Rounded-Ultralight",
  },
});
