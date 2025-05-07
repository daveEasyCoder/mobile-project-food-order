import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";

import { Colors } from "@/app-example/constants/Colors";
import { useRoute } from "@react-navigation/native";
import { useFavorite } from "./GlobalContext/FavoriteContext";


let { width, height } = Dimensions.get("screen");

const Details = () => {
  const{isFavorite,removeFromFavorite,addToCart,addToFavorite,product,isInTheCart,removeFromCart} = useFavorite()
  const navigation = useNavigation();
  const route = useRoute()
  const { id } = route.params

  const recipeObject = product.find((obj) => obj.id === id);

  
  

  return (
    <ScrollView style={{ flex: 1,backgroundColor:"white"}}>
      {
        recipeObject ? 
        <View style={{ width: width }}>
        <Image style={styles.detailImage} source={{ uri: `http://localhost:5000${recipeObject.img}` }} />
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity
            style={styles.backArrow}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={35} color="white" />
          </TouchableOpacity>
          <Pressable onPress={() => isFavorite(recipeObject.id) ? removeFromFavorite(recipeObject.id) : addToFavorite(recipeObject)}>
            <Icon
              name="favorite"
              size={40}
              color={isFavorite(recipeObject.id) ? "red" : "white"}
            />
          </Pressable>
        </SafeAreaView>
        <View style={styles.detailInfo}>
 
          <Text style={styles.detailTitle}>{recipeObject.name}</Text>
          <Text style={styles.description}>{recipeObject.description}</Text>
          <View>
            {/* Button for add to cart */}
            <TouchableOpacity style={[styles.cartButton,{backgroundColor:isInTheCart(recipeObject.id) ? "gray" : "#FFD700"}]} onPress={() => isInTheCart(recipeObject.id) ? removeFromCart(recipeObject.id) : addToCart(recipeObject)} >
               <Text style={{fontFamily:'outfit',color:'white'}}>{isInTheCart(recipeObject.id) ? 'Remove from cart' : 'Add To Cart'}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontFamily: "outfit", marginTop: 10 }}>
              Ingredients:
            </Text>
            <View>
              {recipeObject.ingredients
                ? recipeObject.ingredients.map((ingredient,index) => (
                    <Text
                      key={index}
                      style={{
                        fontFamily: "roboto-bold",
                        paddingLeft: 16,
                        fontSize: 15,
                        color:Colors.darkGray
                      }}
                    >
                      • {ingredient}
                    </Text>
                  ))
                : <Text>There is no description</Text>}
            </View>
          </View>
        </View>
      </View>
        : <Text>No Details</Text>
      }
    </ScrollView>
  );
};

export default Details;

const styles = StyleSheet.create({
  detailImage: {
    width: width,
    height: height * 0.4,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  safeArea: {
    paddingHorizontal: 10,
    width: width,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 3,
  },
  backArrow: {
    backgroundColor: "#FFD700",
    padding: 4,
    borderRadius: 50,
  },
  detailInfo: {
    marginTop: 10,
    paddingHorizontal: 12,
  },
  detailTitle: {
    fontSize: 34,
    marginBottom: 8,
    fontFamily: "outfit",
  },
  description: {
    fontSize: 14,
    letterSpacing: 1,
    lineHeight: 20,
    fontFamily: "roboto-Regular",
    color: Colors.darkGray,
  },
  ingredients: {
    color:Colors.darkGray
  },
  cartButton:{
    alignSelf:'flex-start',
    paddingHorizontal:35,
    paddingVertical:7,
    marginTop:10,
    borderRadius:4,

  }
});
