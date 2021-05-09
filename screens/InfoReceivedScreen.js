import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

const checkMark = require("../assets/images/CheckMark.png");

export default function InfoReceivedScreen({navigation}) {
  React.useEffect(()=>{
    setTimeout(function(){navigation.navigate("登入")},3000)
  },[]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>您的申請資料已被接納 : )</Text>
      <Text style={styles.title}>我哋會儘快與您聯絡</Text>
      <View style={styles.imageContainer}>
        <Image source={checkMark} resizeMode="contain" style={styles.image}/>
      </View>
    </View>
  );
}

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container:{
    height:height,
    backgroundColor:"#ffcc00",
    justifyContent:"center"
  },
  title:{
    fontFamily:"SF-Pro-Rounded-Ultralight",
    fontSize:25,
    alignSelf:"center",
  },
  imageContainer:{
    margin:30,
    height:"20%",
  },
  image:{
    position:"absolute",
    height:"100%",
    width:"100%"
  }
})