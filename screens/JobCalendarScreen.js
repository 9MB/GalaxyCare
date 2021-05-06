import React from "react";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";

export default function JobCalendarScreen() {
  const [queryMonth, setMonth] = React.useState(new Date().getMonth()); //In 0-based
  const [queryYear, setYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    function calendarDateArray() {
      const numOfDaysInMonth = new Date(queryYear, queryYear, 0).getDate();
      console.log("numOfDay", numOfDaysInMonth);
      const weekdayOfFirstDayInMonth = new Date(
        queryYear,
        queryMonth,
        1
      ).getDay();
      //Building 6 x 7 2D Array
      var sixWeeksArrayFrame = new Array(6);
      for (var i = 0; i < sixWeeksArrayFrame.length; i++) {
        sixWeeksArrayFrame[i] = new Array(7);
      }
      var day = 1;
      for (var i = 0; i < sixWeeksArrayFrame.length; i++) {
        for (var j = 0; j < sixWeeksArrayFrame[i].length; j++) {
          if (i == 0 && j < weekdayOfFirstDayInMonth) {
            sixWeeksArrayFrame[i][j] = null;
          } else if (day > numOfDaysInMonth) {
            sixWeeksArrayFrame[i][j] = null;
          } else {
            sixWeeksArrayFrame[i][j] = day;
            day++;
          }
        }
      }

      console.log("SixWeeksFrame", sixWeeksArrayFrame);
    }
    calendarDateArray();
  }, [queryMonth]);
  return (
    <View style={styles.screenContainer}>
      <Text>{queryMonth + 1}月</Text>
      <Button
        title="+"
        onPress={() => {
          setMonth(queryMonth + 1);
        }}
      />
      <View style={styles.calendarContainer}></View>
    </View>
  );
}

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "#ffcc00",
    height: height,
    justifyContent: "center",
    alignItems: "center",
    padding: height * 0.01,
  },
  calendarContainer: {
    height: height * 0.75,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 10,
  },
});
