import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';

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

debugger;
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
            debugger;
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
        firebase.app().database("https://fon-yonetimi-default-rtdb.europe-west1.firebasedatabase.app").ref("fundValues/" + key)
            .update(dataToSave).then((snapshot) => {
                resolve(snapshot);
            }).catch(err => {
                reject(err);
            });
    });
}
