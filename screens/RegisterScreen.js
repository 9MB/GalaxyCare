import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';

export default function RegisterScreen() {
  return (
    <SafeAreaView>
        <Text style={styles.greet}>歡迎您加入Galaxy Care！</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    greet:{
        fontFamily:"SF-Pro-Rounded-Ultralight",
        fontSize:30
    }
})