import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Alert, Clipboard, Image } from 'react-native';
import { Button, Checkbox, Menu, Divider } from 'react-native-paper';  // For UI components
import { useNavigation } from '@react-navigation/native';
import { getAllProducts, updateStock, deleteProductById } from '../../../services/product.service';
import { useExpoRouter } from 'expo-router/build/global-state/router-store';
import { useRouter } from 'expo-router';

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
const ProductList = () => {
  const [data, setData] = useState<Product[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter()
  const navigation = useNavigation();
  const fetchData = async () => {
    console.log('Fetching products...');
    try {
      const response = await getAllProducts();
      setData(response?.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkStock = async (product: Product) => {
    try {
      await updateStock(product._id, { isAvailable: !product.isAvailable });
      fetchData();  // Refresh data after stock update
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    Alert.alert(
      "Are you sure?",
      "This action cannot be undone. Once deleted, you will not be able to recover this product.",
      [
        { text: "Cancel" },
        { text: "Confirm", onPress: async () => {
          try {
            await deleteProductById(product._id);
            fetchData();
          } catch (error) {
            console.error('Error deleting product:', error);
          }
        } },
      ]
    );
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.itemContainer}>
      {item.image.length > 0 && (
        <Image
          source={{ uri: item.image[0].path }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.sellingPrice}>Rs. {item.sellingPrice}</Text>
      <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
      <Text style={styles.category}>{item.category.name}</Text>
      <Text style={styles.stockStatus}>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</Text>
      <View style={styles.actions}>
        {/* <TouchableOpacity onPress={() => Clipboard.setString(item._id)}>
          <Button>Copy Product ID</Button>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => handleMarkStock(item)}>
          <Button><Text style={{ color: item.isAvailable ? 'red' : 'green' }}>{item.isAvailable ? 'Mark Out of Stock' : 'Mark In Stock'}</Text></Button>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}>
          <Button><Text style={{ color: 'blue', fontWeight: 'semibold' }}>View/Edit Product</Text></Button>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item)}>
          <Button><Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text></Button>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <Button mode="contained">
            Create New Product
          </Button>
        }
      />
    </View>
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
    marginBottom: 8,
  },
  itemContainer: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sellingPrice: {
    fontSize: 16,
    color: 'green',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  category: {
    fontSize: 14,
    color: '#777',
  },
  stockStatus: {
    fontSize: 14,
  },
  inStock: {
    color: 'green',
  },
  outOfStock: {
    color: 'red',
  },
  actions: {
    flexDirection: 'row',
    // padding: 12,
    borderColor: '#ccc',
    borderWidth: 2,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginTop: 12,
  },
});

export default ProductList;
