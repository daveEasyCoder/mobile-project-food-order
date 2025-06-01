import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import React from "react";
import { Colors } from "@/app-example/constants/Colors";
import { useRouter } from "expo-router";
import { useFavorite } from "../GlobalContext/FavoriteContext";
const Signin = () => {
  const router = useRouter();

  const {
    handleSignin,
    setEmailSignin,
    setPasswordSignin,
    emailSignin,
    passwordSignin,
    loginLoading
  } = useFavorite();
  return (
    <ImageBackground
      source={require("../../assets/images/loginImage.jpg")}
      style={{ flex: 1, justifyContent: "center" }}
    >
      <View
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 40,
          width: "100%",
        }}
      >
        <Text style={styles.signupText}>Sign in</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="gray"
          onChangeText={(text) => setEmailSignin(text)}
          value={emailSignin}
        />
        <TextInput
          placeholderTextColor="gray"
          style={styles.textInput}
          // secureTextEntry={true}
          placeholder="Password"
          onChangeText={(text) => setPasswordSignin(text)}
          value={passwordSignin}
        />
        <TouchableOpacity style={styles.signupButton} onPress={handleSignin} >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontFamily: "outfit",
              letterSpacing: 1,
              fontSize: 16,
            }}
          >
            {loginLoading ? "Loading..." : "Sign in"}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            gap: 5,
            marginTop: 10,
            width: "85%",
          }}
        >
          <Text
            style={{
              fontFamily: "outfit-Regular",
              fontSize: 14,
              color: "white",
            }}
          >
            Have no an account?
          </Text>
          <Pressable onPress={() => router.push("/auth/Signup")}>
            <Text
              style={{
                color: "#ffcc00",
                fontFamily: "roboto-bold",
                fontSize: 13,
                letterSpacing: 0.4,
              }}
            >
              Create one
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Signin;

const styles = StyleSheet.create({
  signupText: {
    textAlign: "center",
    fontSize: 40,
    fontFamily: "outfit",
    marginBottom: 5,
    color: "white",
  },
  textInput: {
    fontSize: 14,
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 9,
    fontFamily: "roboto-Regular",
    width: "85%",
    borderRadius: 4,
    marginBottom: 18,
    borderColor: "#ccc",
    color:"white"
  },
  signupButton: {
    backgroundColor: "#FFD700",
    width: "85%",
    paddingVertical: 13,
    borderRadius: 4,
  },
});
