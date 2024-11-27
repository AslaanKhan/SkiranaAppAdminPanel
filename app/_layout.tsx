import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import your screens
import HomeScreen from './(tabs)/index';
import ProductScreen from './(tabs)/product/index';
import ProductDetailsScreen from './(tabs)/product/[productId]/index'
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
  {/* <NavigationContainer> */}
    <Stack.Navigator>
      <Stack.Screen name="Drawer" component={DrawerNavigation} options={{ headerShown: false }} />
      <Stack.Screen name="AnotherScreen" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  {/* </NavigationContainer> */}
    </GestureHandlerRootView>
  );
}


const DrawerNavigation = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Products" component={ProductScreen} />
  </Drawer.Navigator>
);
