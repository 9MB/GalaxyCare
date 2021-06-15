import React from 'react';
import { StyleSheet, Text, SafeAreaView, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JobBalanceScreen() {
  const signout = () =>{
    auth().signOut();
  }
  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={()=>signout()} title="登出" color="#841584" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

})