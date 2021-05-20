import React from 'react';
import { StyleSheet, Text, SafeAreaView, View, ImageBackground, Button, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundImage = require("../assets/images/applicationBackground.jpg");

export default function JobApplicationScreen({ route, navigation }) {
    const { jobInfo } = route.params;
    var memberInfo;


    React.useEffect(() => {
        async function getEmployeeInfo() {
            const jsonValue = await AsyncStorage.getItem("MemberInfoLocal");
            if (jsonValue !== null) {
                memberInfo = JSON.parse(jsonValue);
                console.log("memberInfo", memberInfo)
            }
        }
        getEmployeeInfo();
    }, []);

    return (
        <View style={styles.screenContainer}>
            <View style={styles.imageContainer}>
                <ImageBackground source={backgroundImage} style={styles.image} />
            </View>
            <SafeAreaView style={styles.container}>
                <View style={styles.infoRow}>
                    <View style={styles.infoLabel}>
                        <Text style={styles.infoLabelText}>院社地址</Text>
                    </View>
                    <Text style={styles.infoText}>{jobInfo.address}</Text>
                </View>
                <View style={styles.infoRow}>
                    <View style={styles.infoLabel}>
                        <Text style={styles.infoLabelText}>工作時間</Text>
                    </View>
                    <Text style={styles.infoText}>{new Date(jobInfo.startTime.seconds * 1000).getMonth() + 1}月{new Date(jobInfo.startTime.seconds * 1000).getDate()}日{new Date(jobInfo.startTime.seconds * 1000).getHours() < 10 ? '0' + new Date(jobInfo.startTime.seconds * 1000).getHours() : new Date(jobInfo.startTime.seconds * 1000).getHours()}:{new Date(jobInfo.startTime.seconds * 1000).getMinutes() < 10 ? '0' + new Date(jobInfo.startTime.seconds * 1000).getMinutes() : new Date(jobInfo.startTime.seconds * 1000).getMinutes()}-{new Date(jobInfo.endTime.seconds * 1000).getHours() < 10 ? '0' + new Date(jobInfo.endTime.seconds * 1000).getHours() : new Date(jobInfo.endTime.seconds * 1000).getHours()}:{new Date(jobInfo.endTime.seconds * 1000).getMinutes() < 10 ? '0' + new Date(jobInfo.endTime.seconds * 1000).getMinutes() : new Date(jobInfo.endTime.seconds * 1000).getMinutes()}</Text>
                </View>
                <View style={styles.infoRow}>
                    <View style={styles.infoLabel}>
                        <Text style={styles.infoLabelText}>時數</Text>
                    </View>
                    <Text style={styles.infoText}>{Math.abs(new Date(jobInfo.endTime.seconds * 1000).getTime() - new Date(jobInfo.startTime.seconds * 1000).getTime()) / 36e5} 小時</Text>
                </View>
                <View style={styles.infoRow}>
                    <View style={styles.infoLabel}>
                        <Text style={styles.infoLabelText}>完成資薪</Text>
                    </View>
                    <Text style={styles.infoText}> 港元</Text>
                </View>
                <View style={styles.infoRow}>
                    <View style={styles.infoLabel}>
                        <Text style={styles.infoLabelText}>聯絡電話</Text>
                    </View>
                    <Text style={styles.infoText}>{jobInfo.institutionPhone}</Text>
                </View>
                <View style={styles.infoRow}>
                    <View style={styles.infoLabel}>
                        <Text style={styles.infoLabelText}>備註</Text>
                    </View>
                    <Text style={styles.infoText}></Text>
                </View>
            </SafeAreaView>
            <Button title="立即申請" />
        </View>
    );
}

const {height} = Dimensions.get("window")
const styles = StyleSheet.create({
    screenContainer: {
        height: "100%",
        width: "100%"
    },
    imageContainer: {
        height: "20%",
        width: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },
    container: {
        height: "40%",
        marginBottom:height*0.03
    },
    infoRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    infoLabel: {
        backgroundColor: "#3CAEA3",
        height: "60%",
        width: "20%",
        marginRight: 20
    },
    infoLabelText: {
        fontFamily: "SF-Pro-Text-Regular",
        alignSelf: "center",
        color: "white",
        fontSize: 18
    },
    infoText: {
        fontFamily: "SF-Pro-Text-Regular",
        fontSize: 20,
        color: "#3a3a3c"
    },
    buttonRow: {
        flexDirection: "row",

    }
})