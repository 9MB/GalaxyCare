import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, FlatList, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const calendarImage = require("../assets/images/registerImage.png");

export default function JobBalanceScreen() {
  const [memberInfo, setMemberInfo] = React.useState();
  const [balance, setBalance] = React.useState();
  const [salarSheet, setSalarySheet] = React.useState();
  const signout = () => {
    auth().signOut();
  }

  async function getEmployeeInfo() {
    const jsonValue = await AsyncStorage.getItem("MemberInfoLocal");
    if (jsonValue !== null) {
      const member = JSON.parse(jsonValue);
      setMemberInfo(member);
    }
  }

  async function loadSuccessfulPair() {
    const jsonValue = await AsyncStorage.getItem("SuccessfulPaired");
    const successArray = jsonValue != null ? JSON.parse(jsonValue) : [];
    setBalance(successArray);
    console.log("SuccessArray", successArray)
  }

  async function fetchCurrency() {
    const jsonValue = await AsyncStorage.getItem("SalaryRef");
    const salaryRef = jsonValue != null ? JSON.parse(jsonValue): undefined;
    setSalarySheet(salaryRef);
  }

  function calculateSalary(hours){
    return salarSheet[hours];
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.jobRowContainer}>
        <MaterialIcons name="work" size={35} color="#B4F8C8" />
        <View style={styles.infoColumn}>
          <Text style={styles.jobCompanyTitle}>{item.institutionName}</Text>
          <Text style={styles.jobTime}>{new Date(item.startTime.seconds * 1000).getMonth() + 1}月{new Date(item.startTime.seconds * 1000).getDate()}日{new Date(item.startTime.seconds * 1000).getHours() < 10 ? '0' + new Date(item.startTime.seconds * 1000).getHours() : new Date(item.startTime.seconds * 1000).getHours()}:{new Date(item.startTime.seconds * 1000).getMinutes() < 10 ? '0' + new Date(item.startTime.seconds * 1000).getMinutes() : new Date(item.startTime.seconds * 1000).getMinutes()}-{new Date(item.endTime.seconds * 1000).getHours() < 10 ? '0' + new Date(item.endTime.seconds * 1000).getHours() : new Date(item.endTime.seconds * 1000).getHours()}:{new Date(item.endTime.seconds * 1000).getMinutes() < 10 ? '0' + new Date(item.endTime.seconds * 1000).getMinutes() : new Date(item.endTime.seconds * 1000).getMinutes()}</Text>
        </View>
        <Text style={styles.salaryText}> {calculateSalary(Math.abs(
                  new Date(item.endTime.seconds * 1000).getTime() -
                    new Date(item.startTime.seconds * 1000).getTime()
                ) / 36e5)} 港元</Text>
      </TouchableOpacity>
    )
  }

  React.useEffect(() => {
    getEmployeeInfo();
    loadSuccessfulPair();
    fetchCurrency();
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.staffCard}>
        {memberInfo ?
          <View style={styles.imageContainer}>
            <Image
              source={calendarImage}
              resizeMode="cover"
              style={styles.staffImage}
            />
            <Text style={styles.rankTitle}>{memberInfo.rank}</Text>
            <Text style={styles.name}>{memberInfo.fullname}</Text>
            <Text>星玥護理有限公司</Text>
          </View> : null}
      </View>
      <View style={styles.balanceSheet}>
        <Text style={styles.rankTitle}>本月預期資薪</Text>
        {balance && salarSheet?
        <FlatList
          renderItem={renderItem}
          data={balance}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>您未有已成功配對的工作</Text>
          }
        />:null}
      </View>
      <Button onPress={() => signout()} title="登出" color="#841584" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f2f2f7"
  },
  staffCard: {
    height: "30%",
    width: "90%",
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row"
  },
  balanceSheet: {
    width: "90%",
    height: "60%",
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
    padding: 20
  },
  imageContainer: {
    width: "50%",
    height: "60%",
    margin: 10

  },
  staffImage: {
    width: "50%",
    height: "100%",
  },
  rankTitle: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 25
  },
  flatListContainer: {
    width: "100%",
    height: "95%",
    alignSelf: "center",
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10
  },
  emptyListText: {
    fontFamily: "SF-Pro-Rounded-Ultralight",
    fontSize: 20,
    alignSelf: "center",
    marginTop: 20
  },
  jobRowContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    alignItems: "center",
  },
  infoColumn: {
    marginLeft: 25
  },
  jobCompanyTitle: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 20
  },
  jobTime: {
    fontFamily: "SF-Pro-Text-Regular",
    marginTop: 5
  },
  regionBox: {
    backgroundColor: "#a1f7a1",
    marginLeft: "auto",
    height: "50%",
    width: "15%",
    alignSelf: "center",
    borderRadius: 26,
    textAlign: "center",
    justifyContent: "center"
  },
  statusBox: {
    backgroundColor: "#57ddf3",
    marginLeft: "auto",
    height: "50%",
    width: "15%",
    alignSelf: "center",
    borderRadius: 26,
    textAlign: "center",
    justifyContent: "center"
  },
  regionText: {
    fontFamily: "SF-Pro-Text-Regular",
    color: "white",
    alignSelf: "center"
  },
  salaryText:{
    fontFamily:"SF-Pro-Text-Bold",
    marginLeft:"auto"
  }
})