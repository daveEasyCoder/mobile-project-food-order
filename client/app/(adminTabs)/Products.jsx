import { View, Text,StyleSheet,TouchableOpacity,Image,ScrollView,ActivityIndicator } from 'react-native'
import React, { useEffect,useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { format } from 'date-fns';
import { useNavigation } from 'expo-router';

const Products = () => {
  const [adminProducts, setAdminProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const[isdeleteLoading,setIsDeleteLoading] = useState(false)

  const navigation = useNavigation()
  useEffect(() => {
      const fetchData = async () => {
        setLoading(true)
        const token = await AsyncStorage.getItem("token");
        axios.get("http://localhost:5000/api/products",{headers: { Authorization: `Bearer ${token}`}})
        .then(res => {
          setAdminProducts(res.data)
           setLoading(false)
        })
        .catch(error => {
           console.log(error);
           setLoading(false)
        })
     }

     fetchData()
  },[])




  const onDelete = async (id) => {
    setIsDeleteLoading(true)
    const token = await AsyncStorage.getItem("token")
    axios.delete(`http://localhost:5000/api/products/${id}`,{headers: { Authorization: `Bearer ${token}`}})
    .then(res => {
      setAdminProducts(adminProducts.filter(product => product.id !== id))
      setIsDeleteLoading(false)
    })
    .catch(error => {
      console.log(error);
      setIsDeleteLoading(false)
    })
  }


  const onEdit = (item) => {
    navigation.navigate('ProductEdit', { product: item });
  };

  

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }


  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{flex:1,marginBottom: 70}}>
      {
        adminProducts && adminProducts.length > 0 ? 
         adminProducts.map((product) => (
          <View key={product.id} style={styles.container}>
          <Image style={{height:70,width:100,borderRadius:4,marginRight:12}} source={{ uri: `http://localhost:5000${product.img}` }} />

          <View style={styles.details}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Text style={styles.date}>
              Created: {format(new Date(product.createdAt), 'MMM dd, yyyy')}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.editButton} onPress={() => onEdit(product)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(product.id)}>
              <Text style={styles.buttonText}>{isdeleteLoading? "deleting" : "Delete"}</Text>
            </TouchableOpacity>
          </View>
        </View>
         ))
        : null

      }
      </View>
    </ScrollView>

  )
}

export default Products


const styles = {
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#555',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
