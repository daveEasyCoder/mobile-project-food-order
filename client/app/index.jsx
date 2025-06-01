import { Text,StyleSheet,TouchableOpacity, Image, View, ImageBackground } from "react-native";
import { Colors } from "@/app-example/constants/Colors";
import { useRouter } from "expo-router";
import { useFavorite } from "./GlobalContext/FavoriteContext";
import React,{useEffect} from "react";

export default function Index() {

  const router = useRouter()
  // const {isLoggedIn} = useFavorite()



  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.push("/(tabs)/Home");
  //   }
  // }, [isLoggedIn]);

  return (
    <View style={styles.container} >
      <ImageBackground  source={require('../assets/images/bg-hero.jpg')} style = {styles.background} >
         <View style={styles.overlay}>
            <Text style={{fontSize:40,textAlign:'center', fontFamily:'outfit',color:'white',margin:0, marginTop:30,lineHeight:45}}>Welcome to  {"\n"} <Text style={{color:'#FFD700'}}>Recipe  </Text>World</Text>
            <Text style={{fontSize:14,textAlign:'center',fontFamily:'outfit',letterSpacing:1,width:'80%', color:'white', marginTop:10}}>Dive into a world of tasty recipes, perfect for every meal and occasion.</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/Signup')}>
                <Text style={{color:'#FFD700',width:100,textAlign:'center',fontFamily:"outfit"}}>Get Started</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button,{backgroundColor:'transparent',borderWidth:1,borderColor:'white'}]} onPress={() => router.push('/auth/Signin')}>
                <Text style={{color:'white',width:100,textAlign:'center',fontFamily:'outfit'}}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
      </ImageBackground>
 
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
        flex:1, 
  },
  background:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    resizeMode:'cover'
  },
  overlay: {
     flex:1,
     alignItems:'center',
     justifyContent:'center',
     height:'100%',
     width:'100%',
     paddingTop:16,
     backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  button: {
    backgroundColor:"white",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginHorizontal: 10,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // justifyContent: 'center',
    // alignItems: 'center', 
  },
  buttonContainer: {
  //  alignItems:'center',
  //  justifyContent:'center',
   gap:18,
   marginTop:35
  },
});