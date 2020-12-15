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
import { Input, CheckBox } from "react-native-elements";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { Gunler } from "../constants/enums"
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
    navigation: NavigationScreenProp<NavigationState>;
    isSuccees: boolean;
    customerAdd: (nameSurname: string, companyName: string, dayOfWeek: number, fountainCount: string, dayOfWeeks: string) => void;
    CustomerAddMessage: string;
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
    responseItemsToday: FonModel[];
    responseItemsYesterday: FonModel[];
    page: number;
    fundItems: FonModel[];
}

export default class FonGenelBilgi extends Component<Props, FonGenelBilgiState> {
    static navigationOptions = {
        headerShown: false,
    };


    constructor(props: Props) {
        super(props);
        this.state = {
            responseItemsToday: [],
            responseItemsYesterday: [],
            page: 0,
            fundItems: [],
        };
    }

    componentDidMount = async () => {
        var date = new Date();
        var dateBefore = new Date();
        //cumartesi
        if (date.getDay() == Gunler.cumartesi) {
            date.setDate(date.getDate() - 1);
            dateBefore.setDate(date.getDate() - 1);
        }
        //pazar
        else if (date.getDay() == Gunler.pazar) {
            date.setDate(date.getDate() - 2);
            dateBefore.setDate(date.getDate() - 2);
        }
        else if(date.getDay() == Gunler.pazartesi){
            dateBefore.setDate(date.getDate ()- 2);
        }
        //Son hesap tarihinden bir önceki gün
        dateBefore.setDate(date.getDate() - 1);

        //günün verileri
        const fundResponseToday = await axios.get("https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/01/" + this.getFormattedDate(date) + "/" + this.getFormattedDate(date));
        const fundResponseYesterday = await axios.get("https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/01/" + this.getFormattedDate(dateBefore) + "/" + this.getFormattedDate(dateBefore));

        if (fundResponseToday.status == 200 && fundResponseYesterday.status == 200 && fundResponseToday.data != null && fundResponseToday.data.length > 0 && fundResponseYesterday.data != null && fundResponseYesterday.data.length > 0) {
            var responseItemsToday: FonModel[] = fundResponseToday.data
            var responseItemsYesterday: FonModel[] = fundResponseYesterday.data

            responseItemsToday.forEach((todayItem: FonModel) => {
                var yesterdayItem = responseItemsYesterday.find((x: FonModel) => x.FonKodu == todayItem.FonKodu);
                if (yesterdayItem != null || yesterdayItem != undefined) {
                    todayItem.GunlukArtisYuzdesi = ((todayItem.BirimPayDegeri - yesterdayItem.BirimPayDegeri) * 100) / todayItem.BirimPayDegeri;
                }
            })

            this.setState({
                responseItemsToday: responseItemsToday,
                responseItemsYesterday: responseItemsYesterday
            }, () => this.addRecords(0))

        }



    }

    getFormattedDate(date: Date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return month + '-' + day + "-" + year;
    }

    addRecords = (page) => {
        // assuming this.state.dataPosts hold all the records
        const newRecords = []
        for (var i = page * 12, il = i + 12; i < il && i <
            this.state.responseItemsToday.length; i++) {
            newRecords.push(this.state.responseItemsToday[i]);
        }
        this.setState({
            fundItems: [...this.state.fundItems, ...newRecords]
        });
    }

    onScrollHandler = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            this.addRecords(this.state.page);
        });
    }

    render() {
        return (
            <View >
                <StatusBar backgroundColor="#363E58" />
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <FlatList
                        style={{ backgroundColor: "#363E58" }}
                        data={this.state.fundItems.sort((a, b) => a.GunlukArtisYuzdesi - b.GunlukArtisYuzdesi)}
                        renderItem={({ item }) => (
                            <View>
                                <TouchableOpacity >
                                    <View style={styles.container}>
                                        <View style={styles.row_cell1}>
                                            <Text style={styles.textStyle}>{item.FonKodu}</Text>
                                        </View>
                                        <View style={styles.row_cell2}>
                                            <Text style={styles.textStyle}>{item.FonUnvani}</Text>
                                        </View>
                                        <View style={styles.row_cell3}>
                                            <View>
                                                {item.GunlukArtisYuzdesi > 0 ? <Text style={styles.textStyleYuzdeDegisimPozitif}>{"%" + item.GunlukArtisYuzdesi.toFixed(2)}</Text> :
                                                    (item.GunlukArtisYuzdesi < 0 ? <Text style={styles.textStyleYuzdeDegisimNegatif}>{"%" + item.GunlukArtisYuzdesi.toFixed(2)}</Text> :
                                                        <Text style={styles.textStyle}>{"%" + item.GunlukArtisYuzdesi.toFixed(2)}</Text>)}
                                            </View>
                                            <View>
                                                <Text style={styles.textStyleBirimPayDeger}>{item.BirimPayDegeri}</Text>
                                            </View>
                                        </View>

                                    </View>

                                </TouchableOpacity>
                            </View>)}
                        keyExtractor={(item, index) => String(index)}
                        onEndReached={this.onScrollHandler}
                        onEndReachedThreshold={0.5}
                    />
                </KeyboardAvoidingView>
            </View>
        );
    }
    
}

