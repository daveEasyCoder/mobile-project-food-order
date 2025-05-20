import { View, Text,Image, ScrollView,TouchableOpacity,StyleSheet} from "react-native";
import React from "react";
import RecipeItem from "../RecipeItem";
import { useFavorite } from "../GlobalContext/FavoriteContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

//the function that contains the favorite page , it helps to put the loved items to this part
const Favorite = () => {
  const { favorite } = useFavorite()
 
  const navigation = useNavigation()
  return (
    <ScrollView style={{flex:1,backgroundColor:"white"}}>
        <SafeAreaView>
            <TouchableOpacity  style={styles.backArrow} onPress={() => navigation.goBack()} >
               <Icon name="chevron-left" size={35} color="gray" />
            </TouchableOpacity>
        </SafeAreaView>
        <View style={{justifyContent:'center',margin:20}}>
            <Text style={{color:'black',fontFamily:'outfit',fontSize:40,textAlign:'center'}}>Your <Text style={{color:"#FFD700"}}>Favorites</Text> </Text>
        </View>


        <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:10}}>
        {favorite && favorite?.length > 0 ? (
            favorite.map(item => (
                <RecipeItem key={item.id} item={item} />
            ))
        ) : (
            <Text style={{fontFamily:'outfit',fontSize:17,color:'orange',marginTop:100}}>No Favorites</Text>
        )}
        </View>
    </ScrollView>

  );
};

export default Favorite;

const styles = StyleSheet.create({
      backArrow: {
         marginLeft:10,
      },
})