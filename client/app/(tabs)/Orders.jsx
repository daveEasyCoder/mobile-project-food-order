import { View, Text, StyleSheet, TouchableOpacity,Image, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFavorite } from "../GlobalContext/FavoriteContext";
import { useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Orders = () => {

  const{cart,removeFromCart} = useFavorite()

  const totalPrice = (cart.reduce((acc, item) => acc + item.price, 0)).toFixed(2)
  const quantity = cart?.length
  const navigation = useNavigation()
  const route = useRouter()


  return (
    <ScrollView style={{flex:1,backgroundColor:"white",marginBottom:50}}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={35} color="#595959" />
        </TouchableOpacity>
      </SafeAreaView>
      <View style={{justifyContent:'center',margin:20}}>
            <Text style={{color:'black',fontFamily:'outfit',fontSize:40,textAlign:'center'}}>Your <Text style={{color:"#FFD700"}}>Orders</Text> </Text>
      </View>

       <View style={{paddingHorizontal:15,marginTop:14}}>
            {
              cart ? 
                cart.map(c => (
                  <View key={c.id} style={styles.orderItem}>
                    <View style={{flexDirection:'row',gap:12,alignItems:'center'}}>
                      <Image style={styles.orderImage} source={{ uri: `http://10.240.212.213:5000${c.img}` }} />
                      <View>
                          <Text style={{fontFamily:'roboto-bold',fontSize:16,color:'black',marginBottom:2}}>{c?.name?.length>16 ? c.name.slice(0,16)+'...' : c.name}</Text>
                          <Text style={{fontFamily:'outfit',color:'gray'}}>${c.price}</Text>
                      </View>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => removeFromCart(c.id)}>
                            <Text style={{fontFamily:'outfit',fontSize:15,color:'red'}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                 </View>
                ))
              : <View style={{height:300,justifyContent:'center',alignItems:'center'}}>
                 <Image style={{width:"90%",height:250,marginTop:50}} source={require('../../assets/out-of-order.jpg')} />
                 <TouchableOpacity style={{backgroundColor:"#FFD700",paddingHorizontal:15,paddingVertical:5,borderRadius:3}} onPress={() => route.push("/Home")} >
                    <Text style={{fontFamily:'outfit',color:"white"}}>See Recipe</Text>
                 </TouchableOpacity>
              </View>
            }
       </View>


       <View style={styles.container}>
      <Text style={styles.summaryTitle}>Order Summary</Text>
      
      <View style={styles.divider} />
      
      <View style={styles.rowContainer}>
        <Text style={styles.rowLabel}>Quantity</Text>
        <Text style={styles.rowValue}>{quantity && quantity}</Text>
      </View>
      
      
      <View style={styles.divider} />
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${totalPrice && totalPrice}</Text>
      </View>
      
      {/* <TouchableOpacity 
        style={styles.checkoutButton}
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity> */}
    </View>
    </ScrollView>
  );
};

export default Orders;

const styles = StyleSheet.create({
    safeArea: {
        paddingHorizontal: 10,
        alignItems:'flex-start',
        marginTop: 3,
      },
      backArrow: {
         borderRadius:10
      },
      orderItem:{
        borderWidth:1,
        borderColor:"#cccccc",
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderRadius:10,
        paddingLeft:10,
        paddingRight:20,
        paddingVertical:6,
        marginBottom:15
      },
      orderImage:{
        width:90,
        height:90,
        borderRadius:50
      },









      container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      summaryTitle: {
        fontFamily: 'roboto-bold',
        fontSize: 18,
        color: '#333',
        marginBottom: 12,
      },
      divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 12,
      },
      rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
      },
      rowLabel: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: '#595959',
      },
      rowValue: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: '#333',
      },
      totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        marginBottom: 16,
      },
      totalLabel: {
        fontFamily: 'roboto-bold',
        fontSize: 16,
        color: '#333',
      },
      totalValue: {
        fontFamily: 'roboto-bold',
        fontSize: 18,
        color: '#333',
      },
      checkoutButton: {
        backgroundColor: '#FFD700',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
      },
      checkoutButtonText: {
        fontFamily: 'roboto-bold',
        fontSize: 16,
        color: 'white',
      },
});
