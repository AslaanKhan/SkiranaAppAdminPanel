import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, View, StyleSheet, Image, Alert } from 'react-native';
import { Button } from 'react-native-paper'; // For UI components
import { useRoute, useNavigation } from '@react-navigation/native';
import { getProductById, updateProduct } from '../../../../services/product.service'; // Your service functions
import { useLocalSearchParams } from 'expo-router';

export type Product = {
  _id: string;
  title: string;
  price: number;
  sellingPrice: number;
  description: string;
  image: { path: string; _id: string }[];
  category: { name: string; id: string };
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const ProductDetail = (props: any) => {
  const route = useRoute();
  const navigation = useNavigation();
  const productId = props.route.params.productId;

  const [product, setProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProduct = async () => {
    console.log('Fetching product...');
    try {
      const response = await getProductById(productId);
      setProduct(response?.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Error', 'Failed to fetch product details.');
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleSave = async () => {
    if (!product) return;

    try {
      await updateProduct(product._id, product);
      Alert.alert('Success', 'Product updated successfully.');
      setIsEditing(false);
      fetchProduct(); // Refresh the product data after update
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update the product.');
    }
  };

  const handleFieldChange = (field: keyof Product, value: string | number | boolean) => {
    if (product) {
      setProduct({ ...product, [field]: value });
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {product?.image?.length > 0 && (
        <Image
          source={{ uri: product.image[0].path }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Title:</Text>
        <TextInput
          style={styles.input}
          value={product?.title}
          editable={isEditing}
          onChangeText={(value) => handleFieldChange('title', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Price:</Text>
        <TextInput
          style={styles.input}
          value={product?.price?.toString()}
          editable={isEditing}
          keyboardType="numeric"
          onChangeText={(value) => handleFieldChange('price', parseFloat(value))}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Selling Price:</Text>
        <TextInput
          style={styles.input}
          value={product?.sellingPrice?.toString()}
          editable={isEditing}
          keyboardType="numeric"
          onChangeText={(value) => handleFieldChange('sellingPrice', parseFloat(value))}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={product?.description}
          editable={isEditing}
          multiline
          onChangeText={(value) => handleFieldChange('description', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Category:</Text>
        <Text>{product?.category?.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Availability:</Text>
        <Text>{product?.isAvailable ? 'In Stock' : 'Out of Stock'}</Text>
      </View>

      <View style={styles.buttons}>
        {isEditing ? (
          <>
            <Button mode="contained" onPress={handleSave}>
              Save
            </Button>
            <Button
              mode="outlined"
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button mode="contained" onPress={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Back
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttons: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    marginLeft: 8,
  },
  backButton: {
    marginTop: 16,
  },
});

export default ProductDetail;
