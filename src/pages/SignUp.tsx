import React, { Component, useContext } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "../styles";
import { Input } from "react-native-elements";
import { AuthContext } from "../navigation/Auth"
import { colors } from "../constants/colors";

const logo = require("../images/fundLogo.png");

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  isFinished: boolean;
  isSucceed: boolean;
  isLoading: boolean;
  loginErrorMessage: string;
  loginUserService: (email: string, password: string) => void;
}

interface userData {
  username: string;
  password: string;
}

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "example@senolkeskin.com")
    .required("Zorunlu Alan"),
  password: Yup.string()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .min(6)
    .max(16)
    .required("Zorunlu Alan")
});

export default class Login extends Component<Props, {}> {

  //buton disable durumunu burada yapabilirsin
  handleLogin = (values: userData) => { };

  renderLoginButton(userData: userData) {
    const { register } = useContext(AuthContext);
    return (
      <TouchableOpacity style={styles.buttonContainer} disabled={userData.password == "" || userData.username == "" || userData.password == null || userData.username == null}>
        <Text style={styles.buttonText}
          onPress={() => register(userData.username, userData.password)}>{"Kayıt Ol"}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
        <StatusBar backgroundColor={colors.backgroundColor} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView bounces={false}>
            <Formik
              initialValues={{ username: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={values => this.handleLogin(values)}
            >
              {({ values, errors, handleChange, handleBlur }) => {
                return (
                  <View>
                    <View style={styles.headStyle}>
                      <Text style={styles.headText}>{"Kayıt Ol"}</Text>
                    </View>

                    <View style={styles.inputContainer}>
                      <View style={styles.input}>
                        <Input
                          inputStyle={{ color: 'black' }}
                          placeholder="E-posta"
                          placeholderTextColor="gray"
                          value={values.username}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          onChangeText={handleChange("username")}
                          onBlur={handleBlur("username")}
                        />
                      </View>
                      <View style={styles.input}>
                        <Input
                          inputStyle={{ color: 'black' }}
                          autoCapitalize="none"
                          placeholder="Şifre"
                          placeholderTextColor="gray"
                          value={values.password}
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          secureTextEntry
                        />
                      </View>
                      {this.renderLoginButton(values)}

                      <Text style={styles.errorMessageText}>{this.props.loginErrorMessage}</Text>
                    </View>
                  </View>
                );
              }}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>

      </View>
    );
  }
}