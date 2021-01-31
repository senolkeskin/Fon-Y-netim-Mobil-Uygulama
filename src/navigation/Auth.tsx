import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import { Alert } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage"

export const AuthContext = createContext({} as any);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email: string, password: string) => {
          try {
            await auth().signInWithEmailAndPassword(email, password)
              .then(async result => {
                if (result.user != undefined) {
                  try {
                    const jsonValue = JSON.stringify(result.user)
                    await AsyncStorage.setItem("user", jsonValue);
                  } catch (error) {
                    console.log(error);
                  }
                  Alert.alert(
                    //title
                    'Giriş Başarılı',
                    //body
                    String(result.user.email + "\n" + " Hoşgeldiniz"),
                    [
                      { text: "Tamam" },
                    ],
                    { cancelable: true }
                  );
                }
              })
              .catch(error => {
                var errorCode = error.code;
                var errorMessage = error.message;
                Alert.alert(
                  //title
                  'Giriş Hatası',
                  //body
                  String(error.message),
                  [
                    { text: "Tamam" },
                  ],
                  { cancelable: true }
                );
              })
          } catch (e) {
            console.log(e);
          }
        },
        googleLogin: async () => {
          try {
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            await auth().signInWithCredential(googleCredential);
          } catch (error) {
            console.log({ error });
          }
        },
        register: async (email: string, password: string) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password).then(async result => {
              if (result.user != undefined) {
                try {
                  const jsonValue = JSON.stringify(result.user)
                  await AsyncStorage.setItem("user", jsonValue);
                } catch (error) {
                  console.log(error);
                }
                Alert.alert(
                  //title
                  'Kayıt Başarılı',
                  //body
                  //body
                  String(result.user.email + "\n" + "Hoşgeldiniz"),
                  [
                    { text: "Tamam" },
                  ],
                  { cancelable: true }
                );
              }
            }).catch(error => {
              console.log(error);
            });
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {

            Alert.alert(
              //title
              'Çıkış Yapılıyor',
              //body
              String("Uygulamadan çıkış yapmak istiyor musunuz?"),
              [
                { text: "Evet", onPress: async () => await auth().signOut() },
                { text: "Hayır" },

              ],
              { cancelable: true }
            );

            
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};