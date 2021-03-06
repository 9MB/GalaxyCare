import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, FlatList, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const calendarImage = require("../assets_galaxycare/images/registerImage.png");

export default function JobBalanceScreen({ navigation }) {
  var sum = 0;
  const [memberInfo, setMemberInfo] = React.useState();
  const [balance, setBalance] = React.useState();
  const [salarySheet, setSalarySheet] = React.useState();
  const [calculated, loadCalculated] = React.useState(0);


  async function getEmployeeInfo() {
    const jsonValue = await AsyncStorage.getItem("MemberInfoLocal");
    if (jsonValue !== null) {
      const member = JSON.parse(jsonValue);
      setMemberInfo(member);
    }
  }

  async function loadSuccessfulPair() {
    const thisMonth = new Date().getMonth();
    const jsonValue = await AsyncStorage.getItem("SuccessfulPaired");
    const successArray = jsonValue != null ? JSON.parse(jsonValue) : [];
    const filteredArray = successArray.filter(job => new Date(job.startTime.seconds * 1000).getMonth() == thisMonth);
    setBalance(successArray);
  }

  async function fetchCurrency() {
    const jsonValue = await AsyncStorage.getItem("SalaryRef");
    const salaryRef = jsonValue != null ? JSON.parse(jsonValue) : undefined;
    setSalarySheet(salaryRef);
  }

  function calculateSalary(hours) {
    sum += parseInt(salarySheet[hours]);
    return salarySheet[hours];
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.jobRowContainer}>
        <MaterialIcons name="work" size={35} color="#B4F8C8" />
        <View style={styles.infoColumn}>
          <Text style={styles.jobCompanyTitle}>{item.institutionName}</Text>
          <Text style={styles.jobTime}>{new Date(item.startTime.seconds * 1000).getMonth() + 1}???{new Date(item.startTime.seconds * 1000).getDate()}???{new Date(item.startTime.seconds * 1000).getHours() < 10 ? '0' + new Date(item.startTime.seconds * 1000).getHours() : new Date(item.startTime.seconds * 1000).getHours()}:{new Date(item.startTime.seconds * 1000).getMinutes() < 10 ? '0' + new Date(item.startTime.seconds * 1000).getMinutes() : new Date(item.startTime.seconds * 1000).getMinutes()}-{new Date(item.endTime.seconds * 1000).getHours() < 10 ? '0' + new Date(item.endTime.seconds * 1000).getHours() : new Date(item.endTime.seconds * 1000).getHours()}:{new Date(item.endTime.seconds * 1000).getMinutes() < 10 ? '0' + new Date(item.endTime.seconds * 1000).getMinutes() : new Date(item.endTime.seconds * 1000).getMinutes()}</Text>
        </View>
        <Text style={styles.salaryText}> {calculateSalary(Math.ceil(
          (new Date(item.endTime.seconds * 1000).getTime() -
            new Date(item.startTime.seconds * 1000).getTime())
          / 36e5))} ??????</Text>
      </TouchableOpacity>
    )
  }

  React.useEffect(() => {
    getEmployeeInfo();
    loadSuccessfulPair();
    fetchCurrency();
  }, [])

  React.useEffect(() => {
    loadCalculated(sum);
  });

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
            <Text style={styles.rankTitle} adjustsFontSizeToFit={true}>{memberInfo.rank}</Text>
            <Text style={styles.name} adjustsFontSizeToFit={true}>{memberInfo.fullname}</Text>
            <Text adjustsFontSizeToFit={true}>????????????????????????</Text>
          </View> : null}
      </View>
      <View style={styles.balanceSheet}>
        <Text style={styles.rankTitle}>??????????????????</Text>
        {balance && salarySheet ?
          <View>
            <FlatList
              style={styles.flatlist}
              renderItem={renderItem}
              data={balance}
              ListEmptyComponent={
                <Text style={styles.emptyListText}>????????????????????????????????????</Text>
              }
            />
            <Text style={styles.sum}>??????: {calculated}</Text>
          </View> : null}
          <Button style={{height:"5%"}} title="??????" onPress={()=>{auth().signOut()}}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop:10,
    backgroundColor: "#f2f2f7"
  },
  staffCard: {
    height: "40%",
    width: "90%",
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row"
  },
  balanceSheet: {
    width: "90%",
    height: "50%",
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
    padding: 20
  },
  imageContainer: {
    width: "100%",
    height: "70%",
    margin: 10,
    padding:15,
    paddingBottom:25

  },
  staffImage: {
    width: "50%",
    height: "100%",
    alignSelf:"flex-end"
  },
  rankTitle: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 25,
    color:"black"
  },
  name: {
    fontFamily: "SF-Pro-Text-Regular",
    fontSize: 12,
    color:"black"
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
  salaryText: {
    fontFamily: "SF-Pro-Text-Bold",
    marginLeft: "auto"
  },
  sum: {
    alignSelf: "flex-end",
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 25,
    color:"black"
  },
  flatlist: {
    height: "75%"
  }
})