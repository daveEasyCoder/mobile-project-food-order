import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "@/app-example/constants/Colors";
import { useRouter, useNavigation } from "expo-router";
import { Dimensions } from "react-native";
import { useFavorite } from "./GlobalContext/FavoriteContext";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("screen");
export default function Profile() {
  const {
   
    editImage,
    setEditImage,
    saveProfile,

    getProfileEmail,
    setGetProfileEmail,
    getProfilePassword,
    setGetProfilePassword,
    getProfileUsername,
    setGetProfileUsername,
    getProfileRole,
    getProfileImage,
    setGetProfileImage
   
  } = useFavorite();
  const router = useRouter();
  const navigation = useNavigation();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow access to your media library."
        );
      }
    })();
  }, []);
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: false,
        quality: 1,
      });

      if (!result.canceled) {
        setGetProfileImage(result.assets[0]);
      }
    } catch (err) {
      console.log("Image picking error:", err);
    }
  };

  const handlePressEdit = () => {
    setEditMode(true);
  };

  const updatedProfile = {
    username: getProfileUsername,
    email: getProfileEmail,
    password: getProfilePassword,
    image: getProfileImage,
  }
  const handleSave = () => {
    saveProfile();
    setEditMode(false);

  };
  return (
    <ScrollView style={{ flex: 1, marginBottom: 30 }}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerText}>Save</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <View style={{ alignItems: "center" }}>
        <View
          style={{
            borderWidth: 1,
            width: 190,
            height: 190,
            borderRadius: 100,
            padding: 4,
            borderColor: Colors.lightGray,
            marginVertical: 40,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {getProfileImage?.uri ? 
            <Image
              source={{ uri: `http://localhost:5000${getProfileImage.uri}` }}
              style={styles.profileImage}
            />:<Text>No profile</Text>
           }

          <TouchableOpacity
            onPress={pickImage}
            style={{
              height: 40,
              width: 40,
              borderRadius: 50,
              backgroundColor: "rgb(116, 116, 116)",
              borderRadius: 65,
              position: "absolute",
              bottom: 15,
              right: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Pick</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "60%" }}>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.lightGray,
              paddingBottom: 14,
              marginBottom: 17,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 14,
                color: "rgb(166, 166, 166)",
              }}
            >
              Username:
            </Text>
            <TextInput
              onChangeText={(text) => setGetProfileUsername(text)}
              style={[
                styles.textInput,
                { outlineStyle: "none", borderWidth: editMode ? 1 : 0 },
              ]}
              value={getProfileUsername}
              editable={editMode ? true : false}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.lightGray,
              paddingBottom: 14,
              marginBottom: 17,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 14,
                color: "rgb(166, 166, 166)",
              }}
            >
              Password:
            </Text>
            <TextInput
              onChangeText={(text) => setGetProfilePassword(text)}
              style={[
                styles.textInput,
                { outlineStyle: "none", borderWidth: editMode ? 1 : 0 },
              ]}
              value={getProfilePassword}
              editable={editMode ? true : false}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.lightGray,
              paddingBottom: 14,
              marginBottom: 17,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 14,
                color: "rgb(166, 166, 166)",
              }}
            >
              Email:
            </Text>
            <TextInput
              onChangeText={(text) => setGetProfileEmail(text)}
              style={[
                styles.textInput,
                { outlineStyle: "none", borderWidth: editMode ? 1 : 0 },
              ]}
              value={getProfileEmail}
              editable={editMode ? true : false}
            />
          </View>

          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.lightGray,
              paddingBottom: 14,
              marginBottom: 17,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 14,
                color: "rgb(166, 166, 166)",
              }}
            >
              Role:
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { outlineStyle: "none"},
              ]}
              value={getProfileRole}
              editable={false}
            />
          </View>
        </View>

        <View style={{}}>
          <TouchableOpacity onPress={handlePressEdit} style={styles.editBtn}>
            <Text
              style={{
                fontFamily: "outfit",
                color: "white",
                letterSpacing: 1,
                fontSize: 13,
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.editBtn,
              { backgroundColor: "rgb(198, 5, 5)", marginTop: 15 },
            ]}
          >
            <Text
              style={{
                fontFamily: "outfit",
                color: "white",
                letterSpacing: 1,
                fontSize: 13,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingBottom: 13,
  },
  textInput: {
    fontFamily: "outfit",
    fontSize: 14,
    paddingVertical: 8,
    borderRadius: 6,
    paddingLeft: 4,
  },
  headerText: {
    fontFamily: "outfit",
    fontSize: 14,
  },
  profileImage: {
    width: 170,
    height: 170,
    borderRadius: 120,
  },
  editBtn: {
    fontFamily: "outfit",
    paddingVertical: 13,
    color: "white",
    backgroundColor: "rgb(9, 122, 188)",
    paddingHorizontal: width * 0.3,
    borderRadius: 6,
  },
});
