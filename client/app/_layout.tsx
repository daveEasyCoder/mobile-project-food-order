import { useFonts } from "expo-font";
import {  Stack } from "expo-router";
import FavoriteProvider from "./GlobalContext/FavoriteContext";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
 import SignUp from './auth/Signup'

export default function RootLayout() {
  useFonts({
    outfit: require("./../assets/fonts/Outfit-Bold.ttf"),
    "outfit-Regular": require("./../assets/fonts/Outfit-Regular.ttf"),
    "roboto-Regular": require("./../assets/fonts/Roboto-Regular.ttf"),
    "roboto-bold": require("./../assets/fonts/Roboto-Bold.ttf"),
  });
  return (
    <FavoriteProvider>
        <Stack screenOptions={{headerShown:false}} >
            {/* <Stack.Screen name="favorite"></Stack.Screen>
            <Stack.Screen name="home"></Stack.Screen>
            <Stack.Screen name="orders"></Stack.Screen> */}
        </Stack>
    </FavoriteProvider>
  );
}
