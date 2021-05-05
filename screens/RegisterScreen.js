import React from 'react';
import { StyleSheet, Text, TextInput, KeyboardAvoidingView, Image, View } from 'react-native';

const registerImage = require("../assets/images/registerImage.png");

export default function RegisterScreen() {
  const [fullname, onChangeFullName] = React.useState("");
  const [phone, onChangePhone] = React.useState("");
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [confirmPassword, onChangeConfirmPassword] = React.useState("");
  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.container}>
        <Text style={styles.greet}>歡迎您加入Galaxy Care！</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeFullName}
          value={fullname}
          placeholder="您的英文全名（需與身分證相符）"
          autoCapitalize="words"
          autoCorrect={false} />
        <TextInput
          style={styles.input}
          onChangeText={onChangePhone}
          value={phone}
          placeholder="您的手提電話號碼"
          keyboardType="number-pad"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="您的電郵地址（將用於登入帳戶）"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="密碼"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true} />
        <TextInput
          style={styles.input}
          onChangeText={onChangeConfirmPassword}
          value={confirmPassword}
          placeholder="確認密碼"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true} />
      </View>
      <View style={styles.imageContainer}>
        <Image source={registerImage} resizeMode="contain" style={styles.image} />
      </View>


    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "80%",
    color: "#ffffff"
  },
  greet: {
    fontFamily: "SF-Pro-Rounded-Ultralight",
    fontSize: 25,
    margin: 15,
    marginBottom: 30
  },
  input: {
    borderWidth: 1,
    borderColor: "#aeaeb2",
    padding: 10,
    width: "80%",
    borderRadius: 5,
    minHeight: 40,
    marginLeft: 15,
    marginBottom: 20
  },
  imageContainer: {
    height: "20%",
    width: "100%",
    alignItems: "flex-end"
  },
  image: {
    position: "absolute",
    height: "100%",
    width: "100%",
    bottom: 0,
  }
})