import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity } from 'react-native';

const backgroundImage = require("../assets/images/LoginBackground_GalaxyCare.jpg");

export default function LoginScreen({ navigation }) {
    const [username, onChangeUserName] = React.useState("");
    const [password, onChangePassword] = React.useState("");
    return (
        <View style={styles.container}>
            <ImageBackground source={backgroundImage} style={styles.image}>
                <Text style={styles.title}>Galaxy Care</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeUserName}
                    value={username}
                    placeholder="會員編號"
                    autoCapitalize="none"
                    autoCorrect={false} />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder="密碼"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true} />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>登入</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText} onPress={() => { navigation.navigate("Register") }}>預約登記</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    title: {
        fontSize: 55,
        alignSelf: 'center',
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
        marginTop: 10
    },
    buttonContainer: {
        flexDirection: "row",
        minHeight: 40,
        justifyContent: "center",
        marginTop: 20
    },
    button: {
        margin: 15
    },
    buttonText: {
        fontSize: 20,
        fontFamily: "SF-Pro-Rounded-Ultralight",
    }
})

