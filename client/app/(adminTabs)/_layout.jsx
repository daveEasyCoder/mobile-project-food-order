import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '../../components/TabBar'

const _layout = () => {
  return (
    <Tabs screenOptions={{headerShown:false}} 
        tabBar={props => <TabBar {...props} />}
       >
         <Tabs.Screen name="Admin" options={{ title: "Home"}} />
         <Tabs.Screen name="Products" options={{ title: "Item" }} />
         <Tabs.Screen name="AddProduct" options={{ title: "Add" }} />
       </Tabs>
  )
}

export default _layout