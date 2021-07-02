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
  Platform
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
  const [filterLocation, setFilterLocation] = React.useState("");
  const [isExpandingPicker, switchIsExpandingPicker] = React.useState(false);
  const [fetchJobArray, setFetchJobArray] = React.useState([]);
  const [filteredJobArray, setFilteredJobArray] = React.useState([]);
  const [filterStartDate, setFilterStartDate] = React.useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [filterEndDate, setFilterEndDate] = React.useState(new Date(now.getFullYear(), now.getMonth()+1, 0));
  const [show, setShow] = React.useState(false);

  const onChangeStartDate = async(event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setFilterStartDate(currentDate);
    filterJobByStartTime(currentDate);
  };

  const onChangeEndDate = async(event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setFilterEndDate(currentDate);
    filterJobByEndTime(currentDate);
  };

  async function getEmployeeInfo() {
    const jsonValue = await AsyncStorage.getItem("MemberInfoLocal");
    if (jsonValue !== null) {
      const memberInfo = JSON.parse(jsonValue);
      return memberInfo
    }
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
    }else {
      successfulArray.push(mergeObject);
      await AsyncStorage.setItem("SuccessfulPaired", JSON.stringify(successfulArray));
      Alert.alert("您有新的工作配對")
    }
  }

  async function fetchJobsFromDB() {
    let tmpJobArray = [];
    const memberInfo = await getEmployeeInfo();
    firestore().collection("jobs")
      .where("recruiting", "==", true)
      .where("startTime", ">", now)
      .where("rank", "==", memberInfo.rank)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(async (doc) => {
          const jobObject = doc.data();
          const jobID = { jobID: doc.id };
          const mergeObject = Object.assign(jobObject, jobID);
          tmpJobArray.push(mergeObject)
          console.log("MergeObject", mergeObject)
          if (mergeObject.recruitedMembers.length > 0) {
            if (mergeObject.recruitedMembers[0].email == memberInfo.email) {
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
    const memberInfo = await getEmployeeInfo();
    const ref = rankFirebaseLocation(memberInfo.rank);
    firestore().collection("variables").doc(ref).get()
      .then(async (doc) => {
        const jsonValue = JSON.stringify(doc.data());
        await AsyncStorage.setItem("SalaryRef", jsonValue);
        salaryRef = jsonValue;
      })
  }

  React.useEffect(() => {
    fetchJobsFromDB();
    fetchCurrency();
  }, [])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchJobsFromDB();
    });
    return unsubscribe;
  }, [navigation]);

  function filterJobByLocation(region) {
    var tmpFetchedJobArray = filteredJobArray;
    setFilterLocation(region);
    switchIsExpandingPicker(false);
    switch (region) {
      case "所有地區":
        setFilteredJobArray([...tmpFetchedJobArray]);
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

  function filterJobByStartTime(date){
    var tmpFetchedJobArray = filteredJobArray;
    setFilteredJobArray([...tmpFetchedJobArray.filter(job=>new Date(job.startTime.seconds*1000).getTime()>date.getTime())])
  }

  function filterJobByEndTime(date){
    var tmpFetchedJobArray = filteredJobArray;
    setFilteredJobArray([...tmpFetchedJobArray.filter(job=>new Date(job.endTime.seconds*1000).getTime()<date.getTime())])
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
          <Text style={styles.regionText}>{item.institutionRegion.slice(0, 3)}</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.regionText}>{item.recruitedMembers.filter(member => member.email == auth().currentUser.email).length > 0 ? "已獲聘" : item.appliedMembers.filter(member => member.email == auth().currentUser.email).length > 0 ? "已申請" : "未申請"}</Text>
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
      <View style={{flexDirection:"row", justifyContent:"center", marginTop:20}}>
      {filterStartDate?
      <View style={{width:"30%"}}>
      <DateTimePicker
          testID="dateTimePicker"
          value={filterStartDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeStartDate}
        /></View>:null}
      <Text style={{color:"white", alignSelf:"center", margin:10, fontSize:15}}>至</Text>
      {filterEndDate?
      <View style={{width:"30%"}}>
      <DateTimePicker
          testID="dateTimePicker"
          value={filterEndDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeEndDate}
        /></View>:null}
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          renderItem={renderItem}
          data={filteredJobArray}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>您選擇的地區/時間未有工作招聘</Text>
          }
        />
      </View>
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
    width: "100%"
  },
  optionText: {
    fontFamily: "SF-Pro-Text-Regular",
  },
  flatListContainer: {
    width: "100%",
    height: "80%",
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
    borderBottomWidth: 0.3,
    padding: 15,
    alignItems: "center",
    width:"90%",
    alignSelf:"center",
    height:150
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
  }
});
