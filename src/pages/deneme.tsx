import React, { Component } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Dimensions,
    FlatList,
} from "react-native";
import { NavigationScreenProp, NavigationState, } from "react-navigation";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "../styles";
import Icon from "react-native-vector-icons/Ionicons";
import RNPickerSelect from 'react-native-picker-select';
import { Input, CheckBox, SearchBar } from "react-native-elements";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { FonTurleri, Gunler, GunSayisi } from "../constants/enums"
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";

interface Props {
    navigation: NavigationScreenProp<NavigationState>;
}



interface FonModel {
    BankaBonosu: number;
    BirimPayDegeri: number;
    DevletTahvili: number;
    Diger: number;
    DolasimdakiPaySayisi: number;
    DovizOdemeliBono: number;
    DovizOdemeliTahvil: number;
    Eurobond: number;
    FinansmanBonosu: number;
    FonKatilmaBelgesi: number;
    FonKodu: string;
    FonTipi: string;
    FonTuru: string;
    FonUnvani: string;
    GayrimenkulSertifikasi: number;
    HazineBonosu: number;
    HisseSenedi: number;
    KamuDisBorclanmaAraci: number;
    KamuKiraSertifikasi: number;
    KatilimHesabi: number;
    KiymetliMaden: number;
    OzelSektorKiraSertifikasi: number;
    OzelSektorTahvili: number;
    TPP: number;
    Tarih: Date
    TersRepo: number;
    ToplamDeger: number;
    TurevAraci: number;
    VadeliMevduat: number;
    VarligaDayaliMenkulKiymet: number;
    YabanciBorclanmaAraci: number;
    YabanciHisseSenedi: number;
    YabanciMenkulKiymet: number;
    YatirimciSayisi: number;
    GunlukArtisYuzdesi?: number;
}

interface FonGenelBilgiState {
    responseItems: FonModel[];
    page: number;
    fundItems: FonModel[];
    fundItemToday: FonModel[];
    //fonlar
    DegiskenFon: FonModel[];
    BorclanmaAraclariFonu: FonModel[];
    HisseSenediFonu: FonModel[];
    ParaPiyasasiFonu: FonModel[];
    AltinFonu: FonModel[];
    FonSepetiFonu: FonModel[];
    KatilimFonu: FonModel[];
    KorumaAmacliFon: FonModel[];
    AltinVeDigerKiymetliMadenlerFonu: FonModel[];
    HisseSenediYogunFon: FonModel[];
    BosFon: FonModel[];
    KiraSertifikasıFonu: FonModel[];
    KarmaFon: FonModel[];
    GumusFonu: FonModel[];
    listingData: FonModel[];
    noData?: boolean;
}

export default class Deneme extends Component<Props, FonGenelBilgiState> {
    static navigationOptions = {
        headerShown: false,
    };


    constructor(props: Props) {
        super(props);
        this.state = {
            responseItems: [],
            page: 0,
            fundItems: [],
            fundItemToday: [],
            DegiskenFon: [],
            BorclanmaAraclariFonu: [],
            HisseSenediFonu: [],
            ParaPiyasasiFonu: [],
            AltinFonu: [],
            FonSepetiFonu: [],
            KatilimFonu: [],
            KorumaAmacliFon: [],
            AltinVeDigerKiymetliMadenlerFonu: [],
            HisseSenediYogunFon: [],
            BosFon: [],
            KiraSertifikasıFonu: [],
            KarmaFon: [],
            GumusFonu: [],
            listingData: [],
        };
    }

    componentDidMount = async () => {
        try {
            const fonModelStatistics = await AsyncStorage.getItem('fonModelStatistics')
            if (fonModelStatistics != null) {
                var fonModels = JSON.parse(fonModelStatistics);
                debugger;
            }
        } catch (e) {
            // error reading value
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: "#363E58", flex: 1 }}>
                <StatusBar backgroundColor="#363E58" />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} >
                    <View style={{ backgroundColor: "#3C435A" }}>


                    </View>
                </KeyboardAvoidingView>
            </View >
        );
    }

}

