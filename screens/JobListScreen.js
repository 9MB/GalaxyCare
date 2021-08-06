import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  Keyboard
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';

const locationOptions = [
  "所有地區",
  "九龍",
  "新界",
  "港島",
];
const now = new Date();
export default function JobListScreen({ navigation }) {
  var salaryRef;
  const [memberInfo, setMemberInfo] = React.useState();
  const [filterLocation, setFilterLocation] = React.useState("");
  const [isExpandingPicker, switchIsExpandingPicker] = React.useState(false);
  const [fetchJobArray, setFetchJobArray] = React.useState([]);
  const [filteredJobArray, setFilteredJobArray] = React.useState([]);
  const [filterStartDate, setFilterStartDate] = React.useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [filterEndDate, setFilterEndDate] = React.useState(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  const [successfulPair, setSuccessfulPair] = React.useState([]);
  const [selectFilterStart, switchSelectingFilterStart] = React.useState(false);
  const [selectFilterEnd, switchSelectingFilterEnd] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const onChangeStartDate = async (event, selectedDate) => {
    switchSelectingFilterStart(false);
    const currentDate = selectedDate || filterStartDate;
    setShow(Platform.OS === 'ios');
    setFilterStartDate(currentDate);
    filterJobByStartTime(currentDate);

  };

  const onChangeEndDate = async (event, selectedDate) => {
    switchSelectingFilterEnd(false);
    const currentDate = selectedDate || filterEndDate;
    setShow(Platform.OS === 'ios');
    setFilterEndDate(currentDate);
    filterJobByEndTime(currentDate);
  };

  async function getEmployeeInfo() {
    firestore().collection("members")
      .where("email", "==", auth().currentUser.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(async (doc) => {
          const member = doc.data();
          console.log("Getting MemberInfo On Login", member.rank)
          await AsyncStorage.setItem("MemberInfoLocal", JSON.stringify(member));
          setMemberInfo(member);
        })
      })
  }

  async function loadSuccessfulPair() {
    const jsonValue = await AsyncStorage.getItem("SuccessfulPaired");
    const successArray = jsonValue != null ? JSON.parse(jsonValue) : [];
    setSuccessfulPair(successArray);
  }

  async function storeSuccessfulPairing(mergeObject) {
    const jsonValue = await AsyncStorage.getItem("SuccessfulPaired");
    let successfulArray = jsonValue != null ? JSON.parse(jsonValue) : [];
    console.log("SuccessfulPair", successfulArray)
    if (successfulArray.length > 0) {
      if (successfulArray.filter(pair => pair.jobID == mergeObject.jobID).length > 0) {
        return;
      }
      else {
        successfulArray.push(mergeObject);
        await AsyncStorage.setItem("SuccessfulPaired", JSON.stringify(successfulArray));
        Alert.alert("您有新的工作配對")
      }
    } else {
      successfulArray.push(mergeObject);
      await AsyncStorage.setItem("SuccessfulPaired", JSON.stringify(successfulArray));
      Alert.alert("您有新的工作配對")
    }
  }

  async function fetchJobsFromDB() {
    const jsonInfo = await AsyncStorage.getItem("MemberInfoLocal");
    const info = jsonInfo != null ? JSON.parse(jsonInfo) : undefined;
    let tmpJobArray = [];
    firestore().collection("jobs")
      .where("recruiting", "==", true)
      .where("startTime", ">", now)
      .where("rank", "==", info.rank)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(async (doc) => {
          const jobObject = doc.data();
          const jobID = { jobID: doc.id };
          const mergeObject = Object.assign(jobObject, jobID);
          tmpJobArray.push(mergeObject)
          if (mergeObject.confirmed && mergeObject.appliedMembers.length == 1) {
            if (mergeObject.appliedMembers[0].email == info.email) {
              storeSuccessfulPairing(mergeObject);
            }
          }
        })
        setFetchJobArray([...tmpJobArray]);
        setFilteredJobArray([...tmpJobArray]);
        console.log("fetched", fetchJobArray)
      })
      .catch(e => {
        console.log("Error at fetching JobList From DB", e);
      })
  }

  function rankFirebaseLocation(rank) {
    switch (rank) {
      case "RN":
        return "RN_Salary";
      case "EN":
        return "EN_Salary";
      case "HW":
        return "HW_Salary";
      case "PCW":
        return "PCW_salary";
      case "WM":
        return "WM_salary";

    }
  }

  async function fetchCurrency() {
    const ref = rankFirebaseLocation(memberInfo.rank);
    firestore().collection("variables").doc(ref).get()
      .then(async (doc) => {
        const jsonValue = JSON.stringify(doc.data());
        await AsyncStorage.setItem("SalaryRef", jsonValue);
        salaryRef = jsonValue;
      })
  }

  React.useEffect(async () => {
    await getEmployeeInfo();
  }, [])

  React.useEffect(() => {
    if(memberInfo){
    fetchJobsFromDB();
    fetchCurrency();
    loadSuccessfulPair();
    }
  }, [memberInfo])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async() => {
      await getEmployeeInfo();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchJobsFromDB();
      setFilterStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
      setFilterEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));

    });
    return unsubscribe;
  }, [navigation]);

  function filterJobByLocation(region) {
    var tmpFetchedJobArray = filteredJobArray;
    setFilterLocation(region);
    switchIsExpandingPicker(false);
    switch (region) {
      case "所有地區":
        setFilteredJobArray([...fetchJobArray]);
        break;
      case "九龍":
        setFilteredJobArray([...tmpFetchedJobArray.filter(job => job.institutionRegion == "Kowloon")]);
        break;
      case "新界":
        setFilteredJobArray([...tmpFetchedJobArray.filter(job => job.institutionRegion == "New Territories")]);
        break;
      case "港島":
        setFilteredJobArray([...tmpFetchedJobArray.filter(job => job.institutionRegion == "Hong Kong Island")]);
        break;
    }
  }

  function filterJobByStartTime(date) {
    var tmpFetchedJobArray = filteredJobArray;
    setFilteredJobArray([...tmpFetchedJobArray.filter(job => new Date(job.startTime.seconds * 1000).getTime() > date.getTime())])
  }

  function filterJobByEndTime(date) {
    var tmpFetchedJobArray = filteredJobArray;
    setFilteredJobArray([...tmpFetchedJobArray.filter(job => new Date(job.endTime.seconds * 1000).getTime() < date.getTime())])
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.jobRowContainer} onPress={() => { navigation.navigate("應徵", { companyName: item.institutionName, jobInfo: item, salaryRef: salaryRef }) }}>
        <MaterialIcons name="work" size={35} color="#B4F8C8" />
        <View style={styles.infoColumn}>
          <Text style={styles.jobCompanyTitle}>{item.institutionName}</Text>
          <Text style={styles.jobTime}>{new Date(item.startTime.seconds * 1000).getMonth() + 1}月{new Date(item.startTime.seconds * 1000).getDate()}日{new Date(item.startTime.seconds * 1000).getHours() < 10 ? '0' + new Date(item.startTime.seconds * 1000).getHours() : new Date(item.startTime.seconds * 1000).getHours()}:{new Date(item.startTime.seconds * 1000).getMinutes() < 10 ? '0' + new Date(item.startTime.seconds * 1000).getMinutes() : new Date(item.startTime.seconds * 1000).getMinutes()}-{new Date(item.endTime.seconds * 1000).getHours() < 10 ? '0' + new Date(item.endTime.seconds * 1000).getHours() : new Date(item.endTime.seconds * 1000).getHours()}:{new Date(item.endTime.seconds * 1000).getMinutes() < 10 ? '0' + new Date(item.endTime.seconds * 1000).getMinutes() : new Date(item.endTime.seconds * 1000).getMinutes()}</Text>
        </View>
        <View style={styles.regionBox}>
          <Text style={styles.regionText}>{item.institutionRegion=="Kowloon"?"九龍":item.institutionRegion=="New Territories"?"新界":"港島"}</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.regionText}>{item.appliedMembers.filter(member => member.email == auth().currentUser.email).length > 0 && item.confirmed ? "已獲聘" : item.appliedMembers.filter(member => member.email == auth().currentUser.email).length > 0 ? "已申請" : "未申請"}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.backgroundContainer}>
      <TextInput
        style={styles.input}
        value={filterLocation}
        placeholder="選擇地區"
        placeholderTextColor="white"
        onFocus={() => {
          Keyboard.dismiss();
          switchIsExpandingPicker(true);
        }}
      />
      {isExpandingPicker ? (
        <View style={styles.pickerContainer}>
          <ScrollView>
            {locationOptions.map((region) => {
              return (
                <TouchableOpacity style={styles.optionContainer} key={region.id} onPress={() => { filterJobByLocation(region) }}>
                  <Text style={styles.optionText}>{region}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
        {filterStartDate && Platform.OS == "ios" ?
          <View style={{ width: "30%" }}>
            <DateTimePicker
              testID="dateTimePicker"
              value={filterStartDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeStartDate}
            /></View> :
          <TouchableOpacity onPress={() => { switchSelectingFilterStart(true) }}>
            <Text style={styles.datePickerAndroid}>{filterStartDate.getMonth() + 1}月{filterStartDate.getDate()}日</Text>
          </TouchableOpacity>}
        {selectFilterStart ?
          <DateTimePicker
            testID="dateTimePicker"
            value={filterStartDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeStartDate}
          /> : null}
        <Text style={{ color: "white", alignSelf: "center", margin: 10, fontSize: 15 }}>至</Text>
        {filterEndDate && Platform.OS == "ios" ?
          <View style={{ width: "30%" }}>
            <DateTimePicker
              testID="dateTimePicker"
              value={filterEndDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeEndDate}
            /></View> : <TouchableOpacity onPress={() => { switchSelectingFilterEnd(true) }}>
            <Text style={styles.datePickerAndroid}>{filterEndDate.getMonth() + 1}月{filterEndDate.getDate()}日</Text>
          </TouchableOpacity>}
        {selectFilterEnd ?
          <DateTimePicker
            testID="dateTimePicker"
            value={filterEndDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeEndDate}
          /> : null}
      </View>
      <ScrollView>
        <Text style={{ fontFamily: "SF-Pro-Text-Bold", fontSize: 25, marginLeft: 10, marginTop: 10, color: "black" }}>我已獲聘的工作</Text>
        <View style={styles.confirmedFlatListContainer}>
          <FlatList
            renderItem={renderItem}
            data={successfulPair}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>您未有已獲聘的工作</Text>
            }
          />
        </View>
        <Text style={{ fontFamily: "SF-Pro-Text-Bold", fontSize: 25, marginLeft: 10, marginTop: 10, color: "black" }}>可申請的工作</Text>
        <View style={styles.flatListContainer}>
          <FlatList
            renderItem={renderItem}
            data={filteredJobArray}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>您選擇的地區/時間未有工作招聘</Text>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  backgroundContainer: {
    backgroundColor: "#ffcc00",
    height: "100%",
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    width: "90%",
    alignSelf: "center",
    borderRadius: 5,
    minHeight: 40,
    marginTop: 20,
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  filterDateInput: {
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    width: "40%",
    alignSelf: "center",
    borderRadius: 5,
    minHeight: 40,
    marginTop: 20,
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  pickerContainer: {
    height: "25%",
    width: "90%",
    backgroundColor: "white",
    alignSelf: "center",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 5,
  },
  optionContainer: {
    flex: 1,
    margin: 10,
    width: "100%",
  },
  optionText: {
    fontFamily: "SF-Pro-Text-Regular",
  },
  flatListContainer: {
    width: "95%",
    height: height * 0.6,
    alignSelf: "center",
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10
  },
  confirmedFlatListContainer: {
    width: "95%",
    height: height * 0.2,
    alignSelf: "center",
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10
  },
  emptyListText: {
    fontFamily: "SF-Pro-Rounded-Ultralight",
    fontSize: 20,
    alignSelf: "center",
    marginTop: 20,
    color:"black"
  },
  jobRowContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    padding: 15,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    height: 150
  },
  infoColumn: {
    marginLeft: 25
  },
  jobCompanyTitle: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 20,
    color:"black"
  },
  jobTime: {
    fontFamily: "SF-Pro-Text-Regular",
    marginTop: 5,
    color:"black"
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
  datePickerAndroid:{
    fontFamily:"SF-Pro-Ultralight-Rounded",
    alignSelf:"center",
    fontSize:20,
    color:"#007bff"
  }
});
