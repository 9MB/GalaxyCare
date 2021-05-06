import React from 'react';
import { StyleSheet, Text, SafeAreaView, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

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