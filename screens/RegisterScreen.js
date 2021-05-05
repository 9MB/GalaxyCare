import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Image,
  View,
  Button,
  Alert
} from "react-native";
import SwitchSelector from "react-native-switch-selector";

const registerImage = require("../assets/images/registerImage.png");
const options = [
  { label: "註冊護士(RN)", value: "RN" },
  { label: "登記護士(EN)", value: "EN" },
  { label: "病房助理(PCA)", value: "PCA" },
];

export default function RegisterScreen() {
  const [fullname, onChangeFullName] = React.useState("");
  const [phone, onChangePhone] = React.useState("");
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [confirmPassword, onChangeConfirmPassword] = React.useState("");
  const [rank, onChangeRank] = React.useState("");


  const onSubmit = () => {
    if (fullname.replace(/\s/g, "").length < 2){
      Alert.alert("英文全名不能為空白")
    }
    else if (phone.length != 8 ){
      Alert.alert("電話號碼需為8位數字")
    }else if (email.replace(/\s/g, "").length < 2){
      Alert.alert("電郵地址不能為空白")
    }
    else if (password.replace(/\s/g, "").length<5 || password != confirmPassword){
      Alert.alert("密碼或確認密碼錯誤");
      onChangePassword("");
      onChangeConfirmPassword("");
    }else if (rank == ""){
      Alert.alert("請選擇申請職銜！")
    }else{
      return;
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <View style={styles.container}>
        <Text style={styles.greet}>歡迎您加入Galaxy Care！</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeFullName}
          value={fullname}
          placeholder="您的英文全名（需與身分證相符）"
          autoCapitalize="words"
          autoCorrect={false}
        />
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
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeConfirmPassword}
          value={confirmPassword}
          placeholder="確認密碼"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
        <Text style={styles.instruction}>申請職銜</Text>
        <SwitchSelector
          options={options}
          initial={-1}
          onPress={(value) => {
            onChangeRank(value);
          }}
        />
        <View style={styles.buttonContainer}>
        <Button
          onPress={onSubmit}
          title="提交"
          color="#841584"
        />
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={registerImage}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "80%",
    color: "#ffffff",
    padding: 10,
  },
  greet: {
    fontFamily: "SF-Pro-Rounded-Ultralight",
    fontSize: 25,
    margin: 15,
    marginBottom: 30,
  },
  instruction: {
    fontFamily: "SF-Pro-Rounded-Ultralight",
    margin: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aeaeb2",
    padding: 10,
    width: "80%",
    borderRadius: 5,
    minHeight: 40,
    marginLeft: 15,
    marginBottom: 20,
  },
  buttonContainer:{
    marginTop:"10%"
  },
  button:{
    marginTop:50
  },
  imageContainer: {
    height: "20%",
    width: "100%",
    alignItems: "flex-end",
  },
  image: {
    position: "absolute",
    height: "100%",
    width: "100%",
    bottom: 0,
  },
});
