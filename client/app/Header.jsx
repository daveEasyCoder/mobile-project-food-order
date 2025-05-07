import React from 'react'
import { View,Image,StyleSheet,Text,Pressable, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from "@/app-example/constants/Colors";
import { useNavigation, useRouter } from "expo-router";
import { useFavorite } from './GlobalContext/FavoriteContext';


 const Header = () => {

  const route = useRouter()
  const {name} = useFavorite()
  
  return (
    <View style={styles.header}>
        <View style={styles.profileContainer}>
            <Pressable onPress={() => route.push('/Profile')}>
               <Image style={styles.profiles} source={require('../assets/profiles/pic.jpg')} />
            </Pressable>
            <View >
                <Text style={{fontSize:16,color:'gray',fontFamily:'outfit',marginBottom:-3}}>Welcome</Text>
                <Text style={{fontFamily:'outfit',color:Colors.darkGray,fontSize:14}}>{name ? name : "user"}!</Text>
            </View>
        </View>
        <View>
          <TouchableOpacity>
             <Icon name="notifications" size={30} color="gray" />
          </TouchableOpacity>
        </View>
    </View>
  )
}

export default Header;

const styles = StyleSheet.create({
    header:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      paddingHorizontal:20,
      marginTop:15
    },
      profiles:{
        width:45,
        height:45,
        borderRadius:40,
        resizeMode:'cover'
      },
      profileContainer:{
        flexDirection:'row',
        gap:12,
        alignItems:'center'
      }
  });