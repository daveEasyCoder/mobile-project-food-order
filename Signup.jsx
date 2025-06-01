import { View, Text,StyleSheet, TextInput, TouchableOpacity,Image, Pressable, ImageBackground } from 'react-native';
import React,{useState} from 'react';
import { Colors } from "@/app-example/constants/Colors";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons'
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFavorite } from '../GlobalContext/FavoriteContext';
import {RadioButton} from 'react-native-paper'
import { colors } from '@/app-example/constants/Colors';


const Signup = () => {

  const router = useRouter()

  const {handleSignup,setEmail,setPassword,username,setUsername, email,password,role,setRole} = useFavorite()
  const [showPassword,setShowPassword] = useState(false)

  return (
    <ImageBackground
     source={require('../../assets/images/bg-hero.jpg')}
     style={{flex:1,justifyContent:'center'}}
    >
        <View style={{backgroundColor:'rgba(0,0,0,0.7)',flex:1,alignItems:'center',justifyContent:'center',paddingTop:40}}>
          <Text style={styles.signupText}>Signup</Text>
          

          <RadioButton.Group onValueChange={value => setRole(value)} value={role} >
            <View style={{flexDirection:"row",alignItems:"center",marginBottom:30,marginTop:10,gap:10}}>
              <Text style={{color:colors.gray[300],marginRight:10,fontFamily:"outfit"}}>Signup as:</Text>
              <View style={styles.radioRow}>
                <RadioButton value="USER" />
                <Text style={{color:"white",fontFamily:"outfit"}}>USER</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="ADMIN" />
                <Text style={{color:"white",fontFamily:"outfit"}}>ADMIN</Text>
              </View>
            </View>
          </RadioButton.Group>

           {/* <Text style={{color:"white"}}>{role}</Text> */}

          <View style={{width:"85%"}}>
            <TextInput onChangeText={(text) => setUsername(text.toLowerCase())} value={username} style={styles.textInput} placeholder='Username' placeholderTextColor={colors.gray[300]} autoCapitalize="none" />
            <TextInput onChangeText={(text) => setEmail(text)} value={email} style={styles.textInput} placeholder='Email' placeholderTextColor={colors.gray[300]} />
            <View style={{position:'relative'}}>
              <TextInput onChangeText={(text) => setPassword(text)} value={password} style={styles.textInput} secureTextEntry={ showPassword ? false : true } placeholder='Password' placeholderTextColor={colors.gray[300]} />
              <Icon style={{position:'absolute',right:15,top:15}} name={showPassword ? "visibility" : "visibility-off"}  size={24} color="gray" onPress={() => setShowPassword(prev => !prev)} />
            </View>
          </View>
         
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={{textAlign:'center',color:'white',fontFamily:'outfit',letterSpacing:1}}>Create Account</Text>
          </TouchableOpacity>
          <View style={{display:'flex',alignItems:'center',flexDirection:'row',gap:5,marginTop:10,width:'85%'}}>
            <Text style={{fontFamily:'outfit-Regular',fontSize:14,color:'white'}}>You already have an account?</Text>
            <Pressable onPress={() => router.push('/auth/Signin')}>
              <Text style={{color:"#ffcc00",fontFamily:'roboto-bold',letterSpacing:0.4}}>Sign in</Text>
            </Pressable>
          </View>


          <View style={{position:'absolute',top:10,left:10}}>
            <Pressable onPress={() => router.push('/')}>
              <Icon name="chevron-left" size={35} color="white" />
            </Pressable>
          </View>

        </View>
    </ImageBackground>
  )
}

export default Signup

const styles = StyleSheet.create({
    signupText: {
        textAlign:'center',
        fontSize:40,
        fontFamily:'outfit',
        marginBottom:5,
        color:"white"

    },
    radioRow:{
       flexDirection:"row",
       alignItems:"center"
    },
    textInput: {
        fontSize:14,
        borderWidth:1,
        paddingVertical:15,
        paddingHorizontal:15,
        width:'100%',
        borderRadius:4,
        marginBottom:18,
        borderColor: "#ccc",
        color:'white',
    },
    signupButton:{
      backgroundColor:"#FFD700",
      width:'85%',
      paddingVertical:15,
      borderRadius:4,
      marginTop:10
    }
})