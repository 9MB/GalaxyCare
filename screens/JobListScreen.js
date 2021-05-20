import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  FlatList,
  Dimensions
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import firestore from "@react-native-firebase/firestore";

const locationOptions = [
  "全選",
  "九龍東(KEC)",
  "九龍中(KCC)",
  "九龍西(KWC)",
  "新界東(NTEC)",
  "新界西(NTWC)",
  "港島東(HKEC)",
  "港島西(HKWC)",
];

export default function JobListScreen({navigation}) {
  const [filterLocation, setFilterLocation] = React.useState("");
  const [isExpandingPicker, switchIsExpandingPicker] = React.useState(false);
  const [fetchJobArray, setFetchJobArray] = React.useState([]);
  const [filteredJobArray, setFilteredJobArray] = React.useState([]);

  React.useEffect(() => {
    const now = new Date();
    async function fetchJobsFromDB() {
      let tmpJobArray = [];
      firestore().collection("jobs")
        .where("recruiting", "==", true)
        .where("startTime", ">", now)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            tmpJobArray.push(doc.data())
          })
          setFetchJobArray([...tmpJobArray]);
          setFilteredJobArray([...tmpJobArray]);
          console.log("Fetched", fetchJobArray)
        })
        .catch(e => {
          console.log("Error at fetching JobList From DB", e);
        })
    }
    fetchJobsFromDB();
  }, [])

  function filterJobByLocation(region) {
    var tmpFetchedJobArray = fetchJobArray;
    setFilterLocation(region);
    switch (region) {
      case "全選":
        setFilteredJobArray([...tmpFetchedJobArray]);
        break;
      case "九龍東(KEC)":
        setFilteredJobArray([...tmpFetchedJobArray.filter(job => job.institutionRegion == "九龍東(KEC)")]);
        break;
      case "九龍中(KCC)":
        setFilteredJobArray([...tmpFetchedJobArray.filter(job => job.institutionRegion == "九龍中(KCC)")]);
        break;
      case "九龍西(KWC)":
        setFilteredJobArray([...tmpFetchedJobArray.filter(job => job.institutionRegion == "九龍西(KWC)")]);
        break;
      case "新界西(NTWC)":
        setFilteredJobArray([...tmpFetchedJobArray.filter(job => job.institutionRegion == "新界西(NTWC)")]);
        break;
      case "新界東(NTEC)":
        setFilteredJobArray([...tmpFetchedJobArray.filter(job => job.institutionRegion == "新界東(NTEC)")]);
        break;
      case "港島東(HKEC)":
        setFilteredJobArray([...tmpFetchedJobArray.filter(job => job.institutionRegion == "港島東(HKEC)")]);
        break;
      case "港島西(HKWC)":
        setFilteredJobArray([...tmpFetchedJobArray.filter(job => job.institutionRegion == "港島西(HKWC)")]);
        break;
    }
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.jobRowContainer} onPress={()=>{navigation.navigate("應徵", {companyName: item.institutionName, jobInfo:item})}}>
        <View>
          <Text style={styles.jobCompanyTitle}>{item.institutionName}</Text>
          <Text style={styles.jobTime}>{new Date(item.startTime.seconds * 1000).getMonth() + 1}月{new Date(item.startTime.seconds * 1000).getDate()}日{new Date(item.startTime.seconds * 1000).getHours() < 10 ? '0' + new Date(item.startTime.seconds * 1000).getHours() : new Date(item.startTime.seconds * 1000).getHours()}:{new Date(item.startTime.seconds * 1000).getMinutes() < 10 ? '0' + new Date(item.startTime.seconds * 1000).getMinutes() : new Date(item.startTime.seconds * 1000).getMinutes()}-{new Date(item.endTime.seconds * 1000).getHours() < 10 ? '0' + new Date(item.endTime.seconds * 1000).getHours() : new Date(item.endTime.seconds * 1000).getHours()}:{new Date(item.endTime.seconds * 1000).getMinutes() < 10 ? '0' + new Date(item.endTime.seconds * 1000).getMinutes() : new Date(item.endTime.seconds * 1000).getMinutes()}</Text>
        </View>
        <View style={styles.regionBox}>
          <Text style={styles.regionText}>{item.institutionRegion.slice(0, 3)}</Text>
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
    width: "95%",
    height: "88%",
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
    padding: 15
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
    backgroundColor: "#3CAEA3",
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
