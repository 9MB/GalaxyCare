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

const locationOptions = [
  "全選",
  "九龍東區(KEC)",
  "九龍中區(KCC)",
  "九龍西區(KWC)",
  "新界東區(NTEC)",
  "新界西區(NTWC)",
  "港島東區(HKEC)",
  "港島西區(HKWC)",
];

export default function JobListScreen() {
  const [filterLocation, setFilterLocation] = React.useState("");
  const [isExpandingPicker, switchIsExpandingPicker] = React.useState(false);
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
                <TouchableOpacity style={styles.optionContainer} key={region.id} onPress={()=>{setFilterLocation(region)}}>
                  <Text style={styles.optionText}>{region}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
      <View style={styles.flatListContainer}>
      <FlatList />
      </View>
    </SafeAreaView>
  );
}

const {height} = Dimensions.get("window");
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
    color:"white",
    fontSize:18,
    textAlign:"center",
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
  flatListContainer:{
    width:"95%",
    height:"88%",
    alignSelf:"center",
    backgroundColor:"white",
    margin:20,
    borderRadius:10
  }
});
