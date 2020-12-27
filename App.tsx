import React, { Component } from "react";
import AppContainer from "./src/navigation/AppNavigation";
import { View } from 'react-native';
import { AuthProvider } from "./src/navigation/Auth"

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AuthProvider>
          <AppContainer />
        </AuthProvider>
      </View>
    );
  }
}