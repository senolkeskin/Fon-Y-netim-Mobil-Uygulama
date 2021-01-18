import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import { useRef } from 'react';
import { Alert } from 'react-native';

var firebaseConfig = {
    apiKey: "AIzaSyDZZTH3cB17E3weha4ufH1dzsmGDHYzyFQ",
    authDomain: "fon-yonetimi.firebaseapp.com",
    databaseURL: "https://fon-yonetimi-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fon-yonetimi",
    storageBucket: "fon-yonetimi.appspot.com",
    messagingSenderId: "23781540314",
    appId: "1:23781540314:web:a68bf7c405c2b157ed40e3",
    measurementId: "G-8H0MF5CLEX"
};

const db = "https://fon-yonetimi-default-rtdb.europe-west1.firebasedatabase.app";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const addFundInfo = (id: string, fundName: string, fundPurchaseValue: number, fundCount: number, userId: string, portfoyId: string, createdDate: Date, updatedDate: Date, isActive: Boolean) => {
    return new Promise(function (resolve, reject) {
        let key: string;
        if (id != null) {
            key = id;
        }
        else {
            key = database()
                .ref()
                .push()
                .key;
        }
        let dataToSave = {
            fundId: key + "-FUND",
            fundName: fundName,
            fundPurchaseValue: fundPurchaseValue,
            fundCount: fundCount,
            userId: userId,
            createdDate: createdDate.toISOString(),
            updatedDate: updatedDate.toISOString(),
            isActive: isActive,
            portfoyId: portfoyId,
        };
        firebase.app()
            .database(db)
            .ref("fundValues/" + userId + "/" + portfoyId + "/" + key + "-FUND")
            .update(dataToSave)
            .then((snapshot) => {
                resolve(snapshot);
            })
            .catch(error => {
                var errorCode = error.code;
                var errorMessage = error.message;
                Alert.alert(
                    //title
                    '',
                    //body
                    String(error.message),
                    [
                        { text: "Tamam" },
                    ],
                    { cancelable: true }
                );
                reject(error);
            });
    });
}

export const addPortfoy = (userId: string, portfoyId: string, portfoyName: string, createdDate: Date, updatedDate: Date, isActive: Boolean) => {
    return new Promise(function (resolve, reject) {
        let key: string;
        if (portfoyId != null) {
            key = portfoyId;
        }
        else {
            key = database()
                .ref()
                .push()
                .key;
        }
        let dataToSave = {
            portfoyId: key + "-PRTFY",
            portfoyName: portfoyName,
            createdDate: createdDate.toISOString(),
            updatedDate: updatedDate.toISOString(),
            isActive: isActive,
        };
        firebase.app()
            .database(db)
            .ref("fundValues/" + userId + "/" + key + "-PRTFY")
            .update(dataToSave)
            .then((snapshot) => {
                Alert.alert(
                    //title
                    '',
                    //body
                    String("Portföy Oluşturuldu."),
                    [
                        { text: "Tamam" },
                    ],
                    { cancelable: true }
                );
                resolve(snapshot);
            })
            .catch(error => {
                var errorCode = error.code;
                var errorMessage = error.message;
                Alert.alert(
                    //title
                    '',
                    //body
                    String(error.message),
                    [
                        { text: "Tamam" },
                    ],
                    { cancelable: true }
                );
                reject(error);
            });
    });
}

export const deletePortfoy = (userId: string, portfoyId: string) => {
    firebase.app().database(db)
        .ref("fundValues/" + userId + "/" + portfoyId)
        .remove()
        .then(() => {
            console.log("basarılı");
        })
        .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            Alert.alert(
                //title
                '',
                //body
                String(error.message),
                [
                    { text: "Tamam" },
                ],
                { cancelable: true }
            );
        });
}

export const deleteFundInfo = (userId: string, portfoyId: string, fundIds: string[]) => {
    fundIds.forEach(fundId => {
        firebase.app().database(db)
            .ref("fundValues/" + userId + "/" + portfoyId + "/" + fundId)
            .remove()
            .then(() => {
                console.log("basarılı");
            })
            .catch(error => {
                var errorCode = error.code;
                var errorMessage = error.message;
                Alert.alert(
                    //title
                    '',
                    //body
                    String(error.message),
                    [
                        { text: "Tamam" },
                    ],
                    { cancelable: true }
                );
            });
    })
}

export const fetchPortfoyDataFirebase = (userId: string) => {
    return firebase.app()
        .database(db).
        ref("/fundValues/" + userId)
        .once('value')
}

export const fetchPortfoyFundsDataFirebase = (userId: string, portfoyId: string) => {
    return firebase.app()
        .database(db).
        ref("/fundValues/" + userId + "/" + portfoyId)
        .once('value')
}


