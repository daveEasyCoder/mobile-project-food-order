
import React,{useState,createContext, useContext, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios"


const RecipeFavorite = createContext()

export const useFavorite = () => useContext(RecipeFavorite)

 const FavoriteProvider = ({children}) => {

    const router = useRouter()
    const [product,setProduct] = useState([])
    const [favorite,setFavorite] = useState([])
    const [cart,setCart] = useState([])
    const [error,setError] = useState('')
    const [isLoggedIn,setIsLoggedIn] = useState(false)
    const [loading,setLoading] = useState(false)


    //useState for signup
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('') 
    const [password,setPassword] = useState('')
    const [account,setAccount] = useState([])
    const [role,setRole] = useState('USER')

    //useState for signin
    const[emailSignin,setEmailSignin] = useState('')
    const[passwordSignin,setPasswordSignin] = useState('')
    const [loginLoading,setLoginLoading] = useState(false)

    // useState for Create Product
    const [foodName,setFoodName] = useState('')
    const [description,setDescription] = useState('')
    const [price,setPrice] = useState(0)
    const [ingredients,setIngredients] = useState("")
    const [image,setImage] = useState(null)

    // usestate for edit profile
    const [editUsername,setEditUsername] = useState("")
    const [editPassword,setEditPassword] = useState("")
    const [editEmail,setEditEmail] = useState("")
    const [editImage,setEditImage] = useState(null)

    //useState for getFrofile
      const [getProfileEmail,setGetProfileEmail] = useState("")
      const [getProfilePassword,setGetProfilePassword] = useState("..............")
      const [getProfileUsername,setGetProfileUsername] = useState("")
      const [getProfileImage,setGetProfileImage] = useState(null)
      const [getProfileRole,setGetProfileRole] = useState("")

    useEffect(() => {
  
      //Load Logged use
      const loadLoggedUser = async() => {
         const storedUser = JSON.parse(await AsyncStorage.getItem('user'))
         if(storedUser){
            setIsLoggedIn(storedUser)
         }
      }

      const loadFavorites = async() => {
         const storedFavorite = await AsyncStorage.getItem('favorites')
         if(storedFavorite){
            setFavorite(JSON.parse(storedFavorite))
         }
      }

      const loadCart = async() => {
         const storedCart = await AsyncStorage.getItem('cart')
         if(storedCart){
            setCart(JSON.parse(storedCart))
         }
      }

      
      const loadAccount = async() => {
         const storedAccount = await AsyncStorage.getItem('account')
         if(storedAccount){
            setAccount(JSON.parse(storedAccount))
         }
      }

      // getProduct()
      loadFavorites()
      loadCart()
      loadAccount()
      loadLoggedUser()
    },[])


      const addToFavorite = async (item) => {
            const updatedFavorites = [...favorite, item];
            setFavorite(updatedFavorites)
            await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      }

      const removeFromFavorite = async (recipeId) => {
         const updatedFavorites = favorite.filter(item => item.id !== recipeId)
         setFavorite(updatedFavorites)
         await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      }

      const isFavorite = (recipeId) => {
         return favorite.some(fav => fav.id === recipeId)
      }

      const addToCart = async (item) => {
         const updatedCart = [...cart, item];
         setCart(updatedCart)
         await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    
    
    const removeFromCart = async (recipeId) => {
      const updatedCart = cart.filter(item => item.id !== recipeId)
      setCart(updatedCart)
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
   }

   const isInTheCart = (recipeId) => {
      return cart.some(c => c.id === recipeId)
   }

   //function to handle signup
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     const handleSignup = async () => {
       if(!username || !email || !password) {
         alert('Please fill all fields')
       }else if(!emailRegex.test(email)) {
         alert('Please enter a valid email')
       }else if(password.length < 6) {
         alert('Password must be at least 6 characters')
       }else {

        const data = {
         username:username,
         email:email,
         password:password,
         usertype:role
        }
        
        axios.post("http://localhost:5000/api/auth/signup",data)
         .then(res => { 
            alert('User registered successfully',res)
            setUsername('')
            setEmail('')
            setPassword('')
            // console.log(res);
            
         })
         .catch(error => {
            if(error.response){
               if (error.response.status === 400) {
                  alert(error)
               }
            }else{
               alert('Network error. Please check your connection and try again.');
            }
            setUsername('')
            setEmail('')
            setPassword('')
         })
       } 
      }



      //function to handle signin
      const handleSignin = async () => {
         if(!emailSignin || !passwordSignin) {
            alert('Please fill all fields')
         }else if(!emailRegex.test(emailSignin)) {
            alert('Please enter a valid email')
        } else {

            const data = {
            email:emailSignin,
            password:passwordSignin
         } 
         
        
            
            setLoginLoading(true)
            axios.post("http://localhost:5000/api/auth/login",data)
            .then(res => {
               setEmailSignin('')
               setPasswordSignin('') 
               setIsLoggedIn(true)
               console.log(res);
               
               AsyncStorage.setItem("user", JSON.stringify(true));
               AsyncStorage.setItem("token", res.data.token);
               setLoginLoading(false)
               
               if (res.data.role === "ADMIN") {
                  router.replace("/(adminTabs)/Admin")
               }else{
                   router.replace("/(tabs)/Home")
               }       
            })
            .catch(error => {
               if (error.response) {
                  if(error.response.status === 400){
                     alert("Invalid Credentials! please try again.") 
                     setEmailSignin('')
                     setPasswordSignin('') 
                     setLoginLoading(false)
                  }
               }
               else{
                  alert('Network error. Please check your connection and try again.');
                  setEmailSignin('')
                  setPasswordSignin('') 
                  setLoginLoading(false)
               }  
            
            })
         }
      }

      const base64ToBlob = (base64, mimeType) => {
         const byteCharacters = atob(base64.split(",")[1]); 
         const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
         const byteArray = new Uint8Array(byteNumbers);
         return new Blob([byteArray], { type: mimeType });
       };


       const handleSubmit = async () => {
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
        
            const mimeType = image.uri.match(/data:(.*?);base64/)[1]; 
            const blob = base64ToBlob(image.uri, mimeType);
            formData.append("img", blob, image.fileName || "photo.jpg");
       
        
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


       const saveProfile = async () => {

         if(getProfileEmail && getProfilePassword && getProfileUsername && getProfileImage){
            let formData = new FormData();
            formData.append("username", getProfileUsername);
            formData.append("password", getProfilePassword);
            formData.append("email", getProfileEmail);
        
            const mimeType = getProfileImage.uri.match(/data:(.*?);base64/)[1]; 
            const blob = base64ToBlob(getProfileImage.uri, mimeType);
            formData.append("img", blob, getProfileImage.fileName || "photo.jpg");

            const token = await AsyncStorage.getItem("token");
            axios.put("http://localhost:5000/api/users/me",formData,{headers: { Authorization: `Bearer ${token}`}})
           .then(res => {
                 console.log(res.data);
                  alert("Profile updated successfully")
                 
           })
           .catch(error => {
            if (error.response) {
               alert(error.response)
            }else{
               console.log("upload profile error:",error);
               alert("Network error!", error)
            }
          
           })
         
         }else{
            alert("All fields required")
         }
       }

    return <RecipeFavorite.Provider value={{
         addToFavorite,
         favorite,
         removeFromFavorite,
         isFavorite,
         addToCart,
         removeFromCart,
         isInTheCart,
         cart,
         setEmail,
         setPassword,
         handleSignup,
         email,
         password,
         username,
         setUsername,
         role,
         setRole,
         setPasswordSignin,
         setEmailSignin,
         emailSignin,
         passwordSignin,
         handleSignin,
         product,
         isLoggedIn,
         loading,
         setLoading,
         loginLoading,

         foodName,
         setFoodName,
         description,
         setDescription,
         price,
         setPrice,
         ingredients,
         setIngredients,
         image,
         setImage,
         handleSubmit,

         editPassword,
         setEditPassword,
         editUsername,
         setEditUsername,
         editEmail,
         setEditEmail,
         editImage,
         setEditImage,
         saveProfile,

         getProfileEmail,
         setGetProfileEmail,
         getProfilePassword,
         setGetProfilePassword,
         getProfileUsername,
         setGetProfileUsername,
         getProfileImage,
         setGetProfileImage,
         getProfileRole,
         setGetProfileRole,

         setProduct
        
      }}>
         {children}
    </RecipeFavorite.Provider>
}

export default FavoriteProvider
