import { View, Text,ScrollView } from "react-native";
import React from "react";
import ProductItemForm from '../ProductItemForm'
const AddProduct = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "white", marginBottom: 100 }}
    >
      <ProductItemForm />
    </ScrollView>
  );
};

export default AddProduct;
