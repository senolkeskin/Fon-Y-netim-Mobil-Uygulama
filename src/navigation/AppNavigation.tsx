import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import FonGenelBilgi from "../pages/FonGenelBilgi"
import { View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';


const HomeStack = createStackNavigator();


//STACKLER
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Fon Genel" component={FonGenelBilgi} options={{
      headerTitleStyle: { color: "white" },
      headerBackground: () => (
        <View style={{ backgroundColor: "#202f39", flex: 1 }} />
      ),
    }} />
  </HomeStack.Navigator>
);

//TAB
const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
  <Tabs.Navigator sceneContainerStyle={{ backgroundColor: "#202f39", flex: 1 }}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Fon Genel') {
          iconName = focused
            ? 'list-outline'
            : 'list';

        } else if (route.name === 'Settings') {
          iconName = focused ? 'ios-list-box' : 'ios-list';
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },

    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      activeBackgroundColor: '#202f39',
      inactiveBackgroundColor: '#202f39',
      labelStyle:{fontSize:12}
    }}>
    <Tabs.Screen name="Fon Genel" component={HomeStackScreen} />
  </Tabs.Navigator>
);

//DRAWER
const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="Fon Genel" drawerStyle={{ backgroundColor: "#202f39E6" }} drawerContentOptions={{ labelStyle: { color: "white", fontSize: 20 } }}>
    <Drawer.Screen name="Fonel Genel" component={TabsScreen} />
  </Drawer.Navigator>
);

//ANA STACK
const RootStack = createStackNavigator();
const RootStackScreen = () => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen
      name="App"
      component={DrawerScreen}
      options={{
        animationEnabled: false
      }}
    />
  </RootStack.Navigator>
);

export default function AppContainer() {
  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>
  );
}