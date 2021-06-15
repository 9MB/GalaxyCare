import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ImageBackground,
  Button,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const backgroundImage = require("../assets/images/applicationBackground.jpg");


export default function JobApplicationScreen({ route, navigation }) {
  const { jobInfo } = route.params;
  const [salaryRef, setSalaryRef] = React.useState();
  const [memberInfo, setMemberInfo] = React.useState();
  const appliedStatus =
    jobInfo.appliedMembers.filter(
      (member) => member.email == auth().currentUser.email
    ).length > 0
      ? true
      : false;
  const recruitedStatus =
    jobInfo.recruitedMembers.filter(
      (member) => member.email == auth().currentUser.email
    ).length > 0
      ? true
      : false;

  async function applyJob() {
    console.log("memberInfo", memberInfo)
    firestore()
      .collection("jobs")
      .doc(jobInfo.jobID)
      .get()
      .then((doc) => {
        if (
          doc
            .data()
            .appliedMembers.filter((member) => member.email == memberInfo.email)
            .length != 0
        ) {
          Alert.alert("已經成功登記！");
          return;
        } else {
          if (memberInfo.activated) {
            firestore()
              .collection("jobs")
              .doc(jobInfo.jobID)
              .update({
                appliedMembers:
                  firestore.FieldValue.arrayUnion(memberInfo),
              })
              .then(async() => {
                Alert.alert(
                  "申請成功!請等候院社進行確認，您可在工作日歷檢查配對進度。"
                );
                const jsonValue = JSON.stringify(jobInfo)
                await AsyncStorage.setItem("PendingAddEvent", jsonValue);
                navigation.popToTop();
                navigation.navigate("工作日歷");
              })
              .catch((e) => {
                Alert.alert("發生錯誤...");
                console.log("Error applying job", e);
              });
          } else {
            Alert.alert(
              "會員尚未經過驗證，請先攜同註冊證明前往我們的辦公大樓進行登記程序。"
            );
          }
        }
      });
  }

  async function cancelJobApply() {
    firestore()
      .collection("jobs")
      .doc(jobInfo.jobID)
      .get()
      .then((doc) => {
        const memberItemFromAppliedMembers = doc
          .data()
          .appliedMembers.filter(
            (member) => member.email == auth().currentUser.email
          );
        const memberItemFromRecruitedMembers = doc
          .data()
          .recruitedMembers.filter(
            (member) => member.email == auth().currentUser.email
          );
        if (memberItemFromRecruitedMembers.length > 0) {
          Alert.alert(
            "院社已確認您的申請，如要取消請Whatsapp/致電我們的客戶服務熱線94453331"
          );
        } else {
          firestore().collection("jobs").doc(jobInfo.jobID)
          .update({appliedMembers:firestore.FieldValue.arrayRemove(memberItemFromAppliedMembers[0])})
          .then(()=>{
            Alert.alert("已取消申請");
            navigation.navigate("報更")
          })
        }
      });
  }

  function calculateSalary(hours){
    return salaryRef[hours];
  }

  React.useEffect(() => {
    async function getEmployeeInfo() {
      const jsonValue = await AsyncStorage.getItem("MemberInfoLocal");
      if (jsonValue !== null) {
        const member = JSON.parse(jsonValue);
        setMemberInfo(member);
      }
      const jsonSalary = await AsyncStorage.getItem("SalaryRef");
      if (jsonSalary !== null) {
        const salaryChart = JSON.parse(jsonSalary);
        setSalaryRef(salaryChart);
        
      }
    }
    getEmployeeInfo();
  }, []);

  return (
    <View style={styles.screenContainer}>
      {salaryRef && memberInfo?
      <ImageBackground source={backgroundImage} style={styles.image}>
        <SafeAreaView style={styles.container}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.infoLabelText}>院社名稱</Text>
            </View>
            <View style={styles.infoLabelLong}>
              <Text style={styles.infoText}>{jobInfo.institutionName}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.infoLabelText}>院社地址</Text>
            </View>
            <View style={styles.infoLabelLong}>
              <Text style={styles.infoText}>{jobInfo.address}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.infoLabelText}>工作時間</Text>
            </View>
            <View style={styles.infoLabelLong}>
              <Text style={styles.infoText}>
                {new Date(jobInfo.startTime.seconds * 1000).getMonth() + 1}月
                {new Date(jobInfo.startTime.seconds * 1000).getDate()}日
                {new Date(jobInfo.startTime.seconds * 1000).getHours() < 10
                  ? "0" + new Date(jobInfo.startTime.seconds * 1000).getHours()
                  : new Date(jobInfo.startTime.seconds * 1000).getHours()}
                :
                {new Date(jobInfo.startTime.seconds * 1000).getMinutes() < 10
                  ? "0" +
                    new Date(jobInfo.startTime.seconds * 1000).getMinutes()
                  : new Date(jobInfo.startTime.seconds * 1000).getMinutes()}
                -
                {new Date(jobInfo.endTime.seconds * 1000).getHours() < 10
                  ? "0" + new Date(jobInfo.endTime.seconds * 1000).getHours()
                  : new Date(jobInfo.endTime.seconds * 1000).getHours()}
                :
                {new Date(jobInfo.endTime.seconds * 1000).getMinutes() < 10
                  ? "0" + new Date(jobInfo.endTime.seconds * 1000).getMinutes()
                  : new Date(jobInfo.endTime.seconds * 1000).getMinutes()}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.infoLabelText}>時數</Text>
            </View>
            <View style={styles.infoLabelLong}>
              <Text style={styles.infoText}>
                {Math.abs(
                  new Date(jobInfo.endTime.seconds * 1000).getTime() -
                    new Date(jobInfo.startTime.seconds * 1000).getTime()
                ) / 36e5}{" "}
                小時
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.infoLabelText}>完成資薪</Text>
            </View>
            <View style={styles.infoLabelLong}>
              <Text style={styles.infoText}> {calculateSalary(Math.abs(
                  new Date(jobInfo.endTime.seconds * 1000).getTime() -
                    new Date(jobInfo.startTime.seconds * 1000).getTime()
                ) / 36e5)} 港元</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.infoLabelText}>聯絡電話</Text>
            </View>
            <View style={styles.infoLabelLong}>
              <Text style={styles.infoText}>{jobInfo.institutionPhone}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.infoLabelText}>備註</Text>
            </View>
            <View style={styles.infoLabelLong}>
              <Text style={styles.infoText}></Text>
            </View>
          </View>
        </SafeAreaView>
        {appliedStatus ? (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              cancelJobApply();
            }}
          >
            <Text style={styles.applyButtonText}>取消申請</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              applyJob();
            }}
          >
            <Text style={styles.applyButtonText}>立即申請</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.referenceText}>招聘編號:{jobInfo.jobID}</Text>
      </ImageBackground>
      :null}
    </View>
  );
}

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  screenContainer: {
    height: "100%",
    width: "100%",
  },
  imageContainer: {
    height: "100%",
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    opacity: 0.95,
  },
  container: {
    height: "80%%",
    marginBottom: height * 0.1,
  },
  infoRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    backgroundColor: "#3CAEA3",
    height: "60%",
    width: "20%",
  },
  infoLabelLong: {
    backgroundColor: "white",
    height: "60%",
    width: "70%",
    alignItems: "center",
  },
  referenceText: {
    marginTop: "auto",
    marginLeft: 5,
  },
  infoLabelText: {
    fontFamily: "SF-Pro-Text-Bold",
    alignSelf: "center",
    color: "white",
    fontSize: 18,
  },
  infoText: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 20,
  },
  applyButton: {
    backgroundColor: "#0000ff",
    height: "6%",
    width: "35%",
    borderRadius: 12,
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    bottom: height * 0.03,
  },
  cancelButton: {
    backgroundColor: "#d01110",
    height: "6%",
    width: "35%",
    borderRadius: 12,
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    bottom: height * 0.03,
  },
  applyButtonText: {
    color: "white",
    alignSelf: "center",
    fontFamily: "SF-Pro-Text-Regular",
    fontSize: 15,
  },
});
