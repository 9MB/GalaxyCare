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
  TouchableOpacity
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const locationOptions = [
  "全選",
  "九龍",
  "新界",
  "港島",
];

export default function JobListScreen({ navigation }) {
  var salaryRef;
  const [filterLocation, setFilterLocation] = React.useState("");
  const [isExpandingPicker, switchIsExpandingPicker] = React.useState(false);
  const [fetchJobArray, setFetchJobArray] = React.useState([]);
  const [filteredJobArray, setFilteredJobArray] = React.useState([]);

  async function getEmployeeInfo() {
    const jsonValue = await AsyncStorage.getItem("MemberInfoLocal");
    if (jsonValue !== null) {
      const memberInfo = JSON.parse(jsonValue);
      return memberInfo
    }
  }

  async function fetchJobsFromDB() {
    const now = new Date();
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
          console.log("", tmpJobArray)
          /*
          const jsonValue = await AsyncStorage.getItem("SuccessfulPaired");
          var successArray = jsonValue != null ? JSON.parse(jsonValue) : [];
          if (successArray.filter(job => job == mergeObject).length==0) {
            if (mergeObject.recruitedMembers.filter(member => member.email == memberInfo.email)) {
              alert("您有新的成功配對！請留意上班時間")
              successArray.push(mergeObject);
              const jsonArray = JSON.stringify(successArray);
              console.log("Success", successArray)
              AsyncStorage.setItem("SuccessfulPaired", jsonArray);
            }
          }*/
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
    var tmpFetchedJobArray = fetchJobArray;
    setFilterLocation(region);
    switch (region) {
      case "全選":
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
        onBlur={() => {
          switchIsExpandingPicker(false);
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
      <View style={styles.flatListContainer}>
        <FlatList
          renderItem={renderItem}
          data={filteredJobArray}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>您選擇的地區未有工作招聘</Text>
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
  },
  optionText: {
    fontFamily: "SF-Pro-Text-Regular",
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
    borderBottomWidth: 0.3,
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
  }
});
