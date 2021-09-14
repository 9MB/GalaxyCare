import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  View,
  Button,
  Alert,
  Dimensions,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Picker } from "@react-native-picker/picker";

const registerImage = require("../assets_galaxycare/images/registerImage.png");
const genderOptions = [
  { label: "男", value: "male" },
  { label: "女", value: "female" },
];
const jobOptions = [
  { label: "護理職系", value: "nurse" },
  { label: "助理職系", value: "assistant" },
];
const nurseOptions = [
  { label: "註冊護士(RN)", value: "RN" },
  { label: "登記護士(EN)", value: "EN" },
];
const hcaOptions = [
  { label: "病房助理/保健員(HCA/HW)", value: "PCA/HW" },
  { label: "起居照顧員(PCW)", value: "PCW" },
  { label: "常務員(WM)", value: "WM" },
];

export default function RegisterScreen({ navigation }) {
  const [fullname, onChangeFullName] = React.useState("");
  const [gender, onChangeGender] = React.useState("");
  const [phone, onChangePhone] = React.useState("");
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [confirmPassword, onChangeConfirmPassword] = React.useState("");
  const [jobType, onChangeJobType] = React.useState("");
  const [rank, onChangeRank] = React.useState("");
  const [preferLocation, setPreferLocation] = React.useState("");
  const [preferLocation2nd, setPreferLocation2nd] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <Button onPress={() => onSubmit()} title="提交" />
        </View>
      ),
    });
  }, [
    navigation,
    fullname,
    gender,
    phone,
    email,
    password,
    confirmPassword,
    rank,
    preferLocation,
  ]);

  const onSubmit = () => {
    if (fullname.replace(/\s/g, "").length < 2) {
      Alert.alert("英文全名不能為空白");
    } else if (phone.length != 8) {
      Alert.alert("電話號碼需為8位數字");
    } else if (email.replace(/\s/g, "").length < 2) {
      Alert.alert("電郵地址不能為空白");
    } else if (gender == "") {
      Alert.alert("請選擇性別");
    } else if (
      password.replace(/\s/g, "").length < 5 ||
      password != confirmPassword
    ) {
      Alert.alert("密碼或確認密碼錯誤");
      onChangePassword("");
      onChangeConfirmPassword("");
    } else if (rank == "") {
      Alert.alert("請選擇申請職銜！");
    } else if (preferLocation == "") {
      Alert.alert("請選擇預期工作地點！");
    } else {
      createUserOnAuth();
    }
  };

  const createUserOnAuth = async () => {
    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        await createUserOnFirestore();
        auth().currentUser.sendEmailVerification();
        Alert.alert("驗證電郵已經發出，請到電子郵箱確認");
        auth().signOut();
        navigation.navigate("InfoReceived");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("此電郵地址已被註冊");
        }

        if (error.code === "auth/invalid-email") {
          Alert.alert("此電郵地址無效");
          onChangeEmail("");
        }

        console.error(error);
      });
  };

  const createUserOnFirestore = async () => {
    const memberInfo = {
      fullname: fullname,
      gender: gender,
      rank: rank,
      preferLocation: preferLocation,
      preferLocation2nd: preferLocation2nd,
      phone: phone,
      email: email,
      builtDate: new Date(),
      activated: false,
      currentlyAppliedJob: [],
      completedJob: [],
      vacination: "N/A",
      lastNCovid: new Date(),
      covidResult: "N/A",
    };
    await firestore()
      .collection("members")
      .add(memberInfo)
      .catch((e) => {
        console.log("Create memberInfo on firestore failed", e);
      });
  };

  return (
    <ScrollView style={{flex:1, height:"200%"}}>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.container}>
          <Text style={styles.greet}>歡迎您加入Galaxy Care！</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeFullName}
            value={fullname}
            placeholder="您的英文全名（需與身分證相符）"
            autoCapitalize="characters"
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
          <Text style={styles.instruction}>性別</Text>
          <SwitchSelector
            options={genderOptions}
            value={gender}
            onPress={(value) => {
              onChangeGender(value);
            }}
          />
          <Text style={styles.instruction}>申請職銜</Text>
          <SwitchSelector
            options={jobOptions}
            value={jobType}
            onPress={(value) => {
              onChangeJobType(value);
            }}
          />
          <View style={styles.seperator}></View>
          {jobType == "" ? null : jobType == "nurse" ? (
            <SwitchSelector
              options={nurseOptions}
              value={rank}
              onPress={(value) => {
                onChangeRank(value);
              }}
            />
          ) : (
            <SwitchSelector
              options={hcaOptions}
              value={rank}
              onPress={(value) => {
                onChangeRank(value);
              }}
            />
          )}

          <Text style={styles.instruction}>預期工作地點(第一)</Text>
          <Picker
            selectedValue={preferLocation}
            style={styles.pickerWheel}
            onValueChange={(itemValue, itemIndex) =>
              setPreferLocation(itemValue)
            }
          >
            <Picker.Item label="滑動選擇" value="" />
            <Picker.Item label="九龍" value="Kowloon" />
            <Picker.Item label="新界" value="New Territories" />
            <Picker.Item label="港島" value="Hong Kong Island" />
          </Picker>
          <Text style={styles.instruction}>預期工作地點(第二)</Text>
          <Picker
            selectedValue={preferLocation2nd}
            style={styles.pickerWheel}
            onValueChange={(itemValue, itemIndex) =>
              setPreferLocation2nd(itemValue)
            }
          >
            <Picker.Item label="滑動選擇" value="" />
            <Picker.Item label="九龍" value="Kowloon" />
            <Picker.Item label="新界" value="New Territories" />
            <Picker.Item label="港島" value="Hong Kong Island" />
          </Picker>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    height: "100%",
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
    margin: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aeaeb2",
    padding: 10,
    width: "80%",
    borderRadius: 5,
    minHeight: 40,
    marginLeft: 15,
    marginBottom: 18,
  },
  seperator: {
    height: 10,
  },
  pickerWheel: {
    width: "95%",
  },
});
