import { View, Text,StyleSheet,TextInput,TouchableOpacity,Pressable, ScrollView,Image} from 'react-native'
import React,{useState,useEffect} from 'react'
import { colors } from '../app-example/constants/Colors'
import { useFavorite } from './GlobalContext/FavoriteContext'
import * as ImagePicker from 'expo-image-picker'
import { useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'


const ProductEdit = () => {

    const route = useRoute()
   
    const product = route.params?.product

    const [foodName, setFoodName] = useState(product.name)
    const [description, setDescription] = useState(product.description)
    const [price, setPrice] = useState(product.price)
    const [ingredients, setIngredients] = useState(product.ingredients.join(","))
    const [image, setImage] = useState(product.img)


      useEffect(() => {
        (async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission required', 'Please allow access to your media library.');
          }
        })();
      }, []);
      const pickImage = async () => {
        try {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: true,
            base64: false,
            quality: 1,
          });
    
          if (!result.canceled) {
            setImage(result.assets[0]);
          }
        } catch (err) {
          console.log('Image picking error:', err);
        }
      };

      const submitEditedProduct = async () => {
        if(foodName && description && price && ingredients && image){
           const ingredientsArray = ingredients
           .split(",")              
           .map(item => item.trim())  
           .filter(item => item);
           let formData = new FormData();
       
           formData.append("name", foodName);
           formData.append("description", description);
           formData.append("price", price);
           formData.append("ingredients", JSON.stringify(ingredientsArray)); 
       
   
      
       
        if(typeof(image) === 'string'){
            formData.append("img", image);    
        }else{
            const mimeType = image.uri.match(/data:(.*?);base64/)[1]; 
            const blob = base64ToBlob(image.uri, mimeType);
            formData.append("img", blob, image.fileName || "photo.jpg");
            
        }
           
           const token = await AsyncStorage.getItem("token")
           axios.post("http://localhost:5000/api/products",formData,{headers: { Authorization: `Bearer ${token}`}})
           .then(res => {
               console.log(res);    
               alert(res.data.message)
           })
           .catch(error => {
              console.log(error);
           })
        }else{
           alert('Please fill all fields')

        }    
      };
  return (
        <ScrollView style={{ flex: 1, backgroundColor:"white" }}>
         <View style={styles.container}>
            <View style={styles.form}>
                {/* Food Name Input */}
                <View style={styles.inputGroup}>
                <Text style={styles.label}>Food Name</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                    onChangeText={(text) => setFoodName(text)}
                    value={foodName}
                    style={styles.input}  
                    placeholder="Enter food name"
                    placeholderTextColor={colors.gray[400]}
                    />
                </View>
                </View>
        
                {/* Description Input */}
                <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                    onChangeText={(text) => setDescription(text)}
                    value={description}
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter food description"
                    placeholderTextColor={colors.gray[400]}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    />
                </View>
                </View>
        
                {/* Price Input */}
                <View style={styles.inputGroup}>
                <Text style={styles.label}>Price</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                    onChangeText={(text) => setPrice(text)}
                    value={price}
                    style={styles.input}
                    placeholder="Enter price"
                    placeholderTextColor={colors.gray[400]}
                    keyboardType="numeric"
                    />
                </View>
                </View>
        
                {/* Ingredients Section */}
                <View style={styles.inputGroup}>
                <Text style={styles.label}>Ingredients</Text>
                <View style={styles.ingredientsContainer}>
                    <View style={styles.ingredientRow}>
                    <TextInput
                        onChangeText={(text => setIngredients(text))}
                        value={ingredients}
                        style={styles.ingredientInput}
                        placeholder="Enter ingredient"
                        placeholderTextColor={colors.gray[400]}
                    />
                    </View>
                </View>
                </View>
        
                {/* Image Preview */}
            
                <View style={styles.inputGroup}>
                <Text style={styles.label}>Food Image</Text>
                {/* <Button title="Pick Image" onPress={pickImage} style={{paddingVertical:10}}/> */}
                <TouchableOpacity onPress={pickImage} style={{ paddingVertical: 14, backgroundColor: '#007BFF', borderRadius: 5 }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Pick Image</Text>
                    </TouchableOpacity>
                    {image?.uri && <Image source={{ uri: image.uri }}  style={styles.imagePreview} />}
                </View>
        
                {/* Submit Button */}
                <Pressable style={styles.submitButton} onPress={submitEditedProduct}>
                <Text style={styles.submitButtonText}>Edit Product</Text>
                </Pressable>
            </View>
            </View> 
        </ScrollView>
  )
}

export default ProductEdit


const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 13,
      marginBottom: 20,
    },
    form: {
      gap: 20,
      paddingHorizontal:15
    },
    inputGroup: {
      width: '100%',
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.gray[700],
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.gray[300],
      borderRadius: 8,
      backgroundColor: colors.white,
      overflow: 'hidden',
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      color: colors.gray[900],
    },
    textArea: {
      height: 100,
      paddingTop: 12,
    },
    currencySymbol: {
      fontSize: 16,
      color: colors.gray[700],
      paddingLeft: 16,
    },
    ingredientsContainer: {
      borderWidth: 1.5,
      borderColor: colors.gray[300],
      borderRadius: 8,
      backgroundColor: colors.white,
      padding: 16,
    },
    ingredientRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    ingredientInput: {
      flex: 1,
      fontSize: 16,
      color: colors.gray[900],
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
    },
 
    imagePreview: {
      width: '100%',
      height: 150,
      resizeMode: 'cover',
      borderRadius: 8,
      marginTop:10
    },
    submitButton: {
      height: 50,
      backgroundColor: colors.primary[500],
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
    },
  });