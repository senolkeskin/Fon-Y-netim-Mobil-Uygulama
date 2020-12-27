import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import { useRef } from 'react';

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

export const addFunInfo = (id: string, fundName: string, fundPurchaseValue: number, userId: string, portfoyId: string, createdDate: Date, updatedDate: Date, isActive: Boolean) => {
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
            id: key,
            fundName: fundName,
            fundPurchaseValue: fundPurchaseValue,
            userId: userId,
            createdDate: createdDate,
            updatedDate: updatedDate,
            isActive: isActive,
            portfoyId: portfoyId
        };
        firebase.app().database(db).ref("fundValues/" + key)
            .update(dataToSave).then((snapshot) => {
                resolve(snapshot);
            }).catch(err => {
                reject(err);
            });
    });
}

export const deleteAllFundsInfo = (portfoyId: string) => {
    firebase.app().database(db)
        .ref()
        .remove()
        .then(() => {
            console.log("basarılı");
        })
        .catch(error => {
            console.log(error);
        })
}

export const fetchDataFirebase = () => {
    const fundRef = firebase.app()
        .database(db).
        ref("/fundValues")
        .once('value')
        .then(snapshot => {
            //datalar burada
            console.log('User data: ', snapshot.val());
        });
}


