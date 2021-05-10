import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import * as Calendar from "expo-calendar";


const calendarImage = require("../assets/images/registerImage.png");

export default function JobCalendarScreen({ navigation }) {
  const today = new Date().getDate();
  const [queryMonth, setMonth] = React.useState(new Date().getMonth()); //In 0-based
  const [queryYear, setYear] = React.useState(new Date().getFullYear());
  const [queryDay, setQueryDay] = React.useState(new Date().getDate());
  const [calendarArray, buildCalendarArray] = React.useState([]);
  const [eventsArray, setEventsArray] = React.useState([]);

  function nextMonth() {
    if (queryMonth == 11) {
      setMonth(0);
      setYear(queryYear + 1);
      setQueryDay(1);
    } else {
      setMonth(queryMonth + 1);
      setQueryDay(1);
    }
  }

  function previousMonth() {
    if (queryMonth == 0) {
      setMonth(11);
      setYear(queryYear - 1);
      setQueryDay(1);
    } else {
      setMonth(queryMonth - 1);
      setQueryDay(1);
    }
  }


  React.useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const calendarsIDArray = calendars.map(calendar=>{calendar.id});
        const startDate = new Date(queryYear, queryMonth, 1);
        const endDate = new Date(queryYear, queryMonth+1, 1);
        const eventsArray = await Calendar.getEventsAsync(
          calendarsIDArray,
          startDate,
          endDate
        );
      setEventsArray(eventsArray)
      }
    })();
  }, [queryMonth]);

  React.useEffect(() => {
    function calendarDateArray() {
      const numOfDaysInMonth = new Date(queryYear, queryYear, 0).getDate();
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
          } else if ((i == 5) & (j == 6)) {
            sixWeeksArrayFrame[i][j] = "image";
          } else if (day > numOfDaysInMonth) {
            sixWeeksArrayFrame[i][j] = null;
          } else {
            sixWeeksArrayFrame[i][j] = day;
            day++;
          }
        }
      }
      buildCalendarArray(sixWeeksArrayFrame);
    }
    calendarDateArray();
  }, [queryMonth]);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.monthRow}>
        <TouchableOpacity
          style={styles.caretContainer}
          onPress={() => {
            previousMonth();
          }}
        >
          <AntDesign name="caretleft" size={15} color="black" />
        </TouchableOpacity>
        <Text style={styles.monthText}>{queryMonth + 1}月</Text>
        <TouchableOpacity
          style={styles.caretContainer}
          onPress={() => {
            nextMonth();
          }}
        >
          <AntDesign name="caretright" size={15} color="black" />
        </TouchableOpacity>
        <View style={styles.controlPanelContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {
              navigation.navigate("常用事項");
            }}
          >
            <MaterialCommunityIcons
              name="sticker-plus"
              size={24}
              color="white"
            />
            <Text style={styles.instructText}>常用事項</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <FontAwesome5 name="calendar-plus" size={24} color="white" />
            <Text style={styles.instructText}>新增日程</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.calendarContainer}>
        <View style={styles.weeksDayRow}>
          <View style={styles.dayBox}>
            <Text style={styles.weekDayText}>日</Text>
          </View>
          <View style={styles.dayBox}>
            <Text style={styles.weekDayText}>一</Text>
          </View>
          <View style={styles.dayBox}>
            <Text style={styles.weekDayText}>二</Text>
          </View>
          <View style={styles.dayBox}>
            <Text style={styles.weekDayText}>三</Text>
          </View>
          <View style={styles.dayBox}>
            <Text style={styles.weekDayText}>四</Text>
          </View>
          <View style={styles.dayBox}>
            <Text style={styles.weekDayText}>五</Text>
          </View>
          <View style={styles.dayBox}>
            <Text style={styles.weekDayText}>六</Text>
          </View>
        </View>
        {calendarArray.map((weekArray) => {
          return (
            <View style={styles.weeksRow}>
              {weekArray.map((day) => {
                const dayDateObject = new Date(queryYear, queryMonth, day);
                const dayEventsArray = eventsArray.filter(event=>new Date(event.startDate).getDate() == dayDateObject.getDate());
                return (
                  <TouchableOpacity
                    style={day == queryDay ? styles.queryDayBox : styles.dayBox}
                    onPress={() => {
                      if (parseInt(day)) {
                        setQueryDay(day);
                      }
                    }}
                  >
                    {day == "image" ? (
                      <Image
                        source={calendarImage}
                        resizeMode="cover"
                        style={styles.calendarImage}
                      />
                    ) : (
                      <Text
                        style={
                          day == today && queryMonth == new Date().getMonth()
                            ? styles.queryDayText
                            : styles.dayText
                        }
                      >
                        {day}
                      </Text>
                    )}
                    {dayEventsArray.map((event)=>{
                      return(
                        <View style={styles.eventPotContainer}>
                        <Text style={styles.calendarEventTitle}>{event.title}</Text>
                        <View style={styles.sticker}></View>
                        </View>
                      )
                    })}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
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
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  controlPanelContainer: {
    flexDirection: "row",
  },
  controlButton: {
    margin: 10,
    marginRight: 20,
  },
  instructText: {
    fontFamily: "SF-Pro-Rounded-Ultralight",
  },
  caretContainer: {
    paddingVertical: 15,
  },
  monthText: {
    fontSize: 25,
    margin: 10,
  },
  weekDayText: {
    flex: 1,
    fontFamily: "SF-Pro-Rounded-Ultralight",
  },
  calendarEventTitle:{
    fontFamily:"SF-Pro-Rounded-Ultralight",
    fontSize:12,
    textAlign:"center"
  },
  calendarContainer: {
    height: height * 0.75,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  calendarImage: {
    height: "80%",
    width: "100%",
  },
  weeksDayRow: {
    flexDirection: "row",
    flex: 0.5,
  },
  weeksRow: {
    flexDirection: "row",
    flex: 1,
  },
  queryDayBox: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    backgroundColor: "#19FF64",
  },
  dayBox: {
    flex: 1,
    padding: 5,
    alignItems: "center",
  },
  dayText: {
    fontFamily: "SF-Pro-Text-Regular",
  },
  queryDayText: {
    fontFamily: "SF-Pro-Text-Bold",
  },
  eventPotContainer:{
    height:"100%",
    width:"100%"
  },
  sticker:{
    width:"100%",
    height:"20%",
    backgroundColor:"#19FFE6"
  },
});
