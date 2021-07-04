import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  View,
  Dimensions,
  Alert,
  Button
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import defaultStickerList from "../components/defaultStickerList";

export default function StickerCreatingScreen({navigation}) {
  const [eventTitle, setEventTitle] = React.useState("");
  const [
    eventBuildingStartingHour,
    onChangeEventBuildingStartingHour,
  ] = React.useState("");
  const [
    eventBuildingStartingMinutes,
    onChangeEventBuildingStartingMinutes,
  ] = React.useState("");
  const [
    eventBuildingEndingHour,
    onChangeEventBuildingEndingHour,
  ] = React.useState("");
  const [
    eventBuildingEndingMinutes,
    onChangeEventBuildingEndingMinutes,
  ] = React.useState("");

  React.useEffect(() => {
    if (eventBuildingStartingHour.length == 2) {
      this.startingMinutesTextInput.focus();
  }
  }, [eventBuildingStartingHour]);

  React.useEffect(() => {
    if (eventBuildingStartingMinutes.length == 2) {
      this.endingHoursTextInput.focus();
    }
  }, [eventBuildingStartingMinutes]);

  React.useEffect(() => {
    if (eventBuildingEndingHour.length == 2) {
      this.endingMinutesTextInput.focus();
    }
  }, [eventBuildingEndingHour]);

  function isValidSticker(){
    if(eventTitle.replace(/\s/g, "").length < 2){
      Alert.alert("工作標示不能空白")
    }else if(eventBuildingStartingHour.length <2 || eventBuildingStartingMinutes.length <2 || eventBuildingEndingHour.length <2 || eventBuildingEndingMinutes.length <2){
      Alert.alert("請先完成填寫所有時間空格")
    }else if(eventBuildingStartingHour>=24 || eventBuildingStartingMinutes >=60 || eventBuildingEndingHour >=24 || eventBuildingEndingMinutes >=60){
      Alert.alert("時間格式錯誤")
    }else{
      storeSticker();
    }
  }

  async function storeSticker(){
    const sticker = {
      eventTitle: eventTitle,
      eventStartingHour: eventBuildingStartingHour,
      eventStartingMinute: eventBuildingStartingMinutes,
      eventEndingHour: eventBuildingEndingHour,
      eventEndingMinute: eventBuildingEndingMinutes
    }
    const jsonValue = await AsyncStorage.getItem("StickerList");
    if(jsonValue){
      let stickerArray = JSON.parse(jsonValue);
      stickerArray.push(sticker);
      try{
        console.log("Storing sticking array", stickerArray)
        const jsonValue = JSON.stringify(stickerArray);
        await AsyncStorage.setItem("StickerList", jsonValue);
        navigation.navigate("工作日歷");
      }catch(e){
        console.log("Error occured at storing sticker...", e)
      }
    }else if(!jsonValue){
      let stickerArray = defaultStickerList;
      stickerArray.push(sticker);
      try{
        console.log("Storing sticking array", stickerArray)
        const jsonValue = JSON.stringify(stickerArray);
        await AsyncStorage.setItem("StickerList", jsonValue);
        navigation.navigate("工作日歷");
      }catch(e){
        console.log("Error occured at storing sticker...", e)
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.keyboardingAvoidingView}
    >
      <View style={styles.previewContainer}>
      <View style={styles.stickerPreviewCircle}>
        <View style={styles.stickerHead}>
          <Text style={styles.stickerTitle} adjustsFontSizeToFit={true}>
            {eventTitle}
          </Text>
        </View>
        <View style={styles.stickerContentContainer}>
        <Text style={styles.stickerTime} adjustsFontSizeToFit={true}>{eventBuildingStartingHour}:{eventBuildingStartingMinutes}</Text>
        <Text style={styles.stickerTime} adjustsFontSizeToFit={true}>-</Text>
        <Text style={styles.stickerTime} adjustsFontSizeToFit={true}>{eventBuildingEndingHour}:{eventBuildingEndingMinutes}</Text>
        </View>
      </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.instructText}>工作標示:</Text>
        <TextInput
          placeholder="工作地點/名稱"
          placeholderTextColor="#aeaeb2"
          style={styles.inputBar}
          autoCapitalize="sentences"
          value={eventTitle}
          onChangeText={setEventTitle}
        ></TextInput>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.instructText}>開始時間:</Text>
        <TextInput
          placeholder="24小時制"
          placeholderTextColor="#aeaeb2"
          style={styles.inputBar}
          keyboardType="numeric"
          maxLength={2}
          value={eventBuildingStartingHour}
          onChangeText={onChangeEventBuildingStartingHour}
          onBlur={() => {
            if(eventBuildingStartingHour<10 && eventBuildingStartingHour.length==1){
              onChangeEventBuildingStartingHour("0" + eventBuildingStartingHour)
            }
          }}
        ></TextInput>
        <Text style={styles.colon}>:</Text>
        <TextInput
          ref={(input) => {
            this.startingMinutesTextInput = input;
          }}
          placeholder=""
          style={styles.inputBar}
          keyboardType="numeric"
          maxLength={2}
          value={eventBuildingStartingMinutes}
          onChangeText={onChangeEventBuildingStartingMinutes}
          onBlur={() => {
            if(eventBuildingStartingMinutes<10 && eventBuildingStartingMinutes.length==1){
              onChangeEventBuildingStartingMinutes("0" + eventBuildingStartingMinutes)
            }
          }}
        ></TextInput>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.instructText}>結束時間:</Text>
        <TextInput
          ref={(input) => {
            this.endingHoursTextInput = input;
          }}
          placeholder="24小時制"
          placeholderTextColor="#aeaeb2"
          style={styles.inputBar}
          keyboardType="numeric"
          maxLength={2}
          value={eventBuildingEndingHour}
          onChangeText={onChangeEventBuildingEndingHour}
          onBlur={() => {
            if(eventBuildingEndingHour<10 && eventBuildingEndingHour.length==1){
              onChangeEventBuildingEndingHour("0" + eventBuildingEndingHour)
            }
          }}
        ></TextInput>
        <Text style={styles.colon}>:</Text>
        <TextInput
          ref={(input) => {
            this.endingMinutesTextInput = input;
          }}
          placeholder=""
          style={styles.inputBar}
          keyboardType="numeric"
          maxLength={2}
          value={eventBuildingEndingMinutes}
          onChangeText={onChangeEventBuildingEndingMinutes}
          onBlur={() => {
            if(eventBuildingEndingMinutes<10 && eventBuildingEndingMinutes.length==1){
              onChangeEventBuildingEndingMinutes("0" + eventBuildingEndingMinutes)
            }
          }}
        ></TextInput>
      </View>
      <Button title="建立事項貼圖" onPress={()=>isValidSticker()} />
    </KeyboardAvoidingView>
  );
}

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  keyboardingAvoidingView: {
    height: height,
    backgroundColor:"white"
  },
  stickerPreviewCircle: {
    height: height * 0.16,
    backgroundColor: "#19FFE6",
    marginTop: height * 0.05,
    width: width * 0.35,
    borderRadius: 30,
    alignSelf: "center",
    marginBottom: height*0.2,
  },
  stickerHead: {
    width: "100%",
    height: "20%",
    backgroundColor: "#eeffff",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 5,
  },
  stickerTitle: {
    fontFamily: "SF-Pro-Text-Regular",
    fontSize:15
  },
  stickerContentContainer:{
    width:"100%",
    padding:5
  },
  stickerTime:{
    fontFamily:"SF-Pro-Rounded-Black",
    fontSize:25,
    textAlign:"center"
  },
  instructColumnContainer: {
    backgroundColor: "black",
    height: height,
    width: "25%",
  },
  instructText: {
    fontFamily: "SF-Pro-Text-Regular",
    fontSize: 18,
    paddingTop: 10,
  },
  inputBar: {
    fontFamily: "SF-Pro-Text-Regular",
    borderBottomWidth: 0.5,
    flex: 1,
    margin: 5,
    padding: 10,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    height: height * 0.08,
    padding: 10,
  },
  previewContainer:{
    backgroundColor:"#212124",
    height:"30%"
  }
});
