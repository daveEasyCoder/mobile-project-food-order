import {View, Text,StyleSheet,Image,Dimensions,Pressable} from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { Colors } from "../app-example/constants/Colors";


var {width,height} = Dimensions.get('window')

 const RecipeItem = ({item}) => {

    const navigation = useNavigation()

    const handleNavigation = (productId) => {
        navigation.navigate("Details",{id:productId})
      }

      
  return (
    <View style={{ shadowColor: '#000',shadowOffset: { width: 0, height: 8 },  shadowOpacity: 0.2,elevation: 10,  shadowRadius: 12,}}>
      <Pressable onPress={() => handleNavigation(item.id)}>
         <Image style={styles.image} source={{ uri: `http://localhost:5000${item.img}` }} />
      </Pressable>
      <Text style={styles.productTitle}>{item?.name?.length > 18 ? item?.name?.slice(0,18) : item.name }</Text>
      <Text style={{fontFamily:'outfit',color:Colors.darkGray}}>${item.price}</Text>
    </View>
  );
};

export default RecipeItem;


const styles = StyleSheet.create({
    image: {
        width: width*0.45,
        height: 130,
        borderRadius: 14,
        resizeMode: "cover",
        marginBottom: 5,
      },
      productTitle: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 3,
      },
  });
  
