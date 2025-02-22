import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { View,Text } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import auth from "@react-native-firebase/auth"
import { AuthContext, AuthProvider } from "./Auth"

import FonGenelBilgi from "../pages/FonGenelBilgi"
import FonDetayBilgi from "../pages/FonDetayBilgi"
import AnalizPage from "../pages/AnalizPage"
import LoginPage from "../pages/LoginPage"
import SignUp from "../pages/SignUp"
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../constants/colors";
import PortfoyPage from "../pages/PortfoyPage";
import AddFund from "../pages/AddFund";
import AddPortfoy from "../pages/AddPortfoy";
import { scale } from "react-native-size-matters";
import styles from "../styles";

const HomeStack = createStackNavigator();
const AnalizStack = createStackNavigator();
const AuthStack = createStackNavigator();
const PortfoyStack = createStackNavigator();


//STACKLER
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Giriş Yap" component={LoginPage} options={{
      headerTitleStyle: { color: colors.backgroundColor },
      headerTintColor: colors.backgroundColor,
      headerBackground: () => (
        <View style={{ backgroundColor: colors.backgroundColor, flex: 1, }} />
      ),
    }} />
    <AuthStack.Screen name="Kayıt Ol" component={SignUp} options={{
      headerTitleStyle: { color: colors.backgroundColor },
      headerTintColor: "white",
      headerBackground: () => (
        <View style={{ backgroundColor: colors.backgroundColor, flex: 1, }} />
      ),
    }} />
  </AuthStack.Navigator>
);



const HomeStackScreen = () => {
  const { logout, user } = useContext(AuthContext);
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Fon Genel" component={FonGenelBilgi} options={{
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
        headerBackground: () => (
          <View style={{ backgroundColor: "#1C212F", flex: 1, }} />
        ),
        headerRight: () => (
          <View style={{flexDirection:"row"}}>
            <Text style={styles.stacknavigatorStyle}>
              {user.email}
            </Text>
            <TouchableOpacity style={{ padding: scale(10) }} onPress={() => logout()}>
              <Ionicons name={"log-out-outline"} size={25} color={"white"} />
            </TouchableOpacity>
          </View>
        ),
      }} />
      <HomeStack.Screen name="Fon Detay" component={FonDetayBilgi} options={{
        headerTintColor: "white",
        headerTitleStyle: { color: "white" },
        headerBackground: () => (
          <View style={{ backgroundColor: "#1C212F", flex: 1 }} />
        ),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 10 }} onPress={() => logout()}>
            <Ionicons name={"log-out-outline"} size={25} color={"white"} />
          </TouchableOpacity>
        )
      }} />
    </HomeStack.Navigator>
  );

}
const AnalizStackScreen = () => {
  const { logout, user } = useContext(AuthContext);
  return (
    <AnalizStack.Navigator>
      <AnalizStack.Screen name="Analiz" component={AnalizPage} options={{
        headerTitleStyle: { color: "white" },
        headerBackground: () => (
          <View style={{ backgroundColor: "#1C212F", flex: 1 }} />
        ),
        headerRight: () => (
          <View style={{flexDirection:"row"}}>
            <Text style={styles.stacknavigatorStyle}>
              {user.email}
            </Text>
            <TouchableOpacity style={{ padding: scale(10) }} onPress={() => logout()}>
              <Ionicons name={"log-out-outline"} size={25} color={"white"} />
            </TouchableOpacity>
          </View>
        )
      }} />
    </AnalizStack.Navigator>
  );

}

const PortfoyStackScreen = () => {
  const { logout, user } = useContext(AuthContext);
  return (
    <PortfoyStack.Navigator>
      <PortfoyStack.Screen name="Portföy" component={PortfoyPage} options={{
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
        headerBackground: () => (
          <View style={{ backgroundColor: "#1C212F", flex: 1 }} />
        ),
        headerRight: () => (
          <View style={{flexDirection:"row"}}>
            <Text style={styles.stacknavigatorStyle}>
              {user.email}
            </Text>
            <TouchableOpacity style={{ padding: scale(10) }} onPress={() => logout()}>
              <Ionicons name={"log-out-outline"} size={25} color={"white"} />
            </TouchableOpacity>
          </View>
        )
      }} />
      <PortfoyStack.Screen name="Fon Ekle" component={AddFund} options={{
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
        headerBackground: () => (
          <View style={{ backgroundColor: "#1C212F", flex: 1 }} />
        ),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 10 }} onPress={() => logout()}>
            <Ionicons name={"log-out-outline"} size={25} color={"white"} />
          </TouchableOpacity>
        )
      }} />
      <PortfoyStack.Screen name="Portföy Ekle" component={AddPortfoy} options={{
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
        headerBackground: () => (
          <View style={{ backgroundColor: "#1C212F", flex: 1 }} />
        ),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 10 }} onPress={() => logout()}>
            <Ionicons name={"log-out-outline"} size={25} color={"white"} />
          </TouchableOpacity>
        )
      }} />

      <PortfoyStack.Screen name="Fon Detay" component={FonDetayBilgi} options={{
        headerTintColor: "white",
        headerTitleStyle: { color: "white" },
        headerBackground: () => (
          <View style={{ backgroundColor: "#1C212F", flex: 1 }} />
        ),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 10 }} onPress={() => logout()}>
            <Ionicons name={"log-out-outline"} size={25} color={"white"} />
          </TouchableOpacity>
        )
      }} />

    </PortfoyStack.Navigator>
  );
}
//TAB
const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
  <Tabs.Navigator sceneContainerStyle={{ backgroundColor: "#202f39", flex: 1 }}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Fon Genel') {
          iconName = 'list-sharp'

        } else if (route.name === 'Analiz') {
          iconName = 'analytics-sharp';
        }
        else if (route.name === 'Porföy') {
          iconName = 'pie-chart-sharp';
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
      labelStyle: { fontSize: 12 }
    }}>
    <Tabs.Screen name="Fon Genel" component={HomeStackScreen} />
    <Tabs.Screen name="Analiz" component={AnalizStackScreen} />
    <Tabs.Screen name="Porföy" component={PortfoyStackScreen} />
  </Tabs.Navigator>
);

//DRAWER
const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="Fon Genel" drawerStyle={{ backgroundColor: "#202f39E6" }} drawerContentOptions={{ labelStyle: { color: "white", fontSize: 20 } }}>
    <Drawer.Screen name="Fonel Genel" component={TabsScreen} />
    <Drawer.Screen name="Analiz" component={AnalizStackScreen} />
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
  const { user, setUser } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  return (
    <NavigationContainer>
      {user ? <RootStackScreen /> : <AuthStackScreen />}
    </NavigationContainer>
  );
}