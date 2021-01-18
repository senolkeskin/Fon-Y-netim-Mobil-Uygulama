import React, { Component } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Dimensions,
    ScrollView,
    ListRenderItemInfo,
    Alert,
    ActivityIndicator,
} from "react-native";
import { NavigationScreenProp, NavigationState, } from "react-navigation";
import styles from "../styles";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { FonTurleri, GunSayisi } from "../constants/enums"
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryPie, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, } from "victory-native";
import { colors } from "../constants/colors";
import { Container, SwipeRow } from "native-base";
import Svg from "react-native-svg"

import { deleteFundInfo, deletePortfoy, fetchPortfoyDataFirebase, fetchPortfoyFundsDataFirebase } from "../firebaseRealtimeDatabase/firebaseRealtimeDatabase"
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { moderateScale, scale } from "react-native-size-matters";
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import firebaseJson from "../../firebase.json"


const screenWidth = Dimensions.get("window").width;


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
    AlinanFonlar?: FirebaseFonModel[];
    ortalamaMaliyet?: number;
    toplamAlinanLot?: number;
    fundIds: string[];
    portfoyId: string;
    toplamFiyat?: number;
    toplamOdenenPara?: number;
    toplamArtisYuzdesi?: number;
    toplamBugunkuDeger?: number;
    toplamDunkuDeger?: number;
}

interface Fund {
    Kodu: string,
    Adi: string,
    Tipi: string,
}

interface FirebaseFonModel {
    createdDate: Date,
    fundName: string,
    fundPurchaseValue: number,
    fundId: string,
    isActive: boolean,
    portfoyId: string,
    updatedDate: Date,
    userId: string,
    fundCount: number,
    dateView: string,
}

interface FirebasePortfoyModel {
    createdDate: Date,
    portfoyName: string,
    portfoyId: string,
    isActive: boolean,
    updatedDate: Date,
}

interface FonGenelBilgiState {
    isLoading: boolean,
    userInfo: any;
    portfoyler: FirebasePortfoyModel[];
    isAddPortfoy: boolean;
    portfoyName: string;
    defaultDropDownPickerItem: any;
    firebaseFonlar: FirebaseFonModel[];
    portfoylerDropDownPicker: any[],
    selectedPortfoy: FirebasePortfoyModel,
    fundItemToday: FonModel[],
    iconReverse: boolean,
    colorsPackage: string[],
    dataVictoryLineChart: any[];
    portfoyeToplamHarcananPara: number;
    portfoyunSuankiDegeri: number;
    portfoyunDunkuDegeri: number;
    portfoyunGunlukArtisYuzdesi: number;
    portfoyunGenelArtisYuzdesi: number;
    portfoyGunlukArtis: number;
    fundItemPortfoy: FonModel[],


}

export default class Deneme extends Component<Props, FonGenelBilgiState> {
    static navigationOptions = {
        headerShown: false,
    };


    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            userInfo: {},
            portfoyler: [],
            isAddPortfoy: false,
            portfoyName: null,
            defaultDropDownPickerItem: null,
            firebaseFonlar: [],
            portfoylerDropDownPicker: [],
            selectedPortfoy: null,
            fundItemToday: [],
            iconReverse: false,
            colorsPackage: [],
            dataVictoryLineChart: [],
            portfoyeToplamHarcananPara: 0,
            portfoyunSuankiDegeri: 0,
            portfoyunDunkuDegeri: 0,
            portfoyunGunlukArtisYuzdesi: 0,
            portfoyunGenelArtisYuzdesi: 0,
            portfoyGunlukArtis: 0,
            fundItemPortfoy: [],
        };
    }


    componentDidMount = async () => {
        try {
            const userInfo = await AsyncStorage.getItem('user');
            if (userInfo != undefined) {
                var user = JSON.parse(userInfo);
                this.setState({
                    userInfo: user,
                })
                fetchPortfoyDataFirebase(user.uid).then(result => {
                    var portfoyler: FirebasePortfoyModel[] = [];
                    var portfoylerDropDownPicker: any[] = [];
                    result.forEach(element => {
                        var portfoy: FirebasePortfoyModel = {
                            portfoyName: element._snapshot.value.portfoyName,
                            portfoyId: element._snapshot.value.portfoyId,
                            isActive: element._snapshot.value.isActive,
                            createdDate: element._snapshot.value.createdDate,
                            updatedDate: element._snapshot.value.updatedDate,

                        };
                        portfoylerDropDownPicker.push({ value: element._snapshot.value.portfoyId, label: element._snapshot.value.portfoyName });
                        portfoyler.push(portfoy);
                    })

                    var colorsPackage: string[] = [];
                    colorsPackage.push(colors.DevletTahvili);
                    colorsPackage.push(colors.BankaBonosu);
                    colorsPackage.push(colors.Diger);
                    colorsPackage.push(colors.DovizOdemeliBono);
                    colorsPackage.push(colors.DovizOdemeliTahvil);
                    colorsPackage.push(colors.Eurobond);
                    colorsPackage.push(colors.FinansmanBonosu);
                    colorsPackage.push(colors.FonKatilmaBelgesi);
                    colorsPackage.push(colors.GayrimenkulSertifikasi);
                    colorsPackage.push(colors.HazineBonosu);
                    colorsPackage.push(colors.HisseSenedi);
                    colorsPackage.push(colors.KamuDisBorclanmaAraci);
                    colorsPackage.push(colors.KamuKiraSertifikasi);
                    colorsPackage.push(colors.KatilimHesabi);
                    colorsPackage.push(colors.KiymetliMaden);
                    colorsPackage.push(colors.OzelSektorKiraSertifikasi);
                    colorsPackage.push(colors.OzelSektorTahvili);
                    colorsPackage.push(colors.TPP);
                    colorsPackage.push(colors.TersRepo);
                    colorsPackage.push(colors.TurevAraci);
                    colorsPackage.push(colors.VadeliMevduat);
                    colorsPackage.push(colors.VarligaDayaliMenkulKiymet);
                    colorsPackage.push(colors.YabanciBorclanmaAraci);
                    colorsPackage.push(colors.YabanciHisseSenedi);
                    colorsPackage.push(colors.YabanciMenkulKiymet);


                    if (portfoyler[portfoyler.length - 1] != undefined || portfoyler[portfoyler.length - 1] != null) {
                        this.setState({
                            isLoading: false,
                            portfoyler: portfoyler,
                            portfoylerDropDownPicker: portfoylerDropDownPicker,
                            defaultDropDownPickerItem: portfoyler[portfoyler.length - 1].portfoyId,
                            selectedPortfoy: portfoyler[portfoyler.length - 1],
                            colorsPackage: colorsPackage,
                        })
                        fetchPortfoyFundsDataFirebase(this.state.userInfo.uid, portfoyler[portfoyler.length - 1].portfoyId).then(result => {
                            var firebaseFonlar: FirebaseFonModel[] = []
                            result.forEach(element => {
                                firebaseFonlar.push(element._snapshot.value);
                            })
                            //sondan beş eleman fon değil portföyün genel bilgileri
                            firebaseFonlar.pop();
                            firebaseFonlar.pop();
                            firebaseFonlar.pop();
                            firebaseFonlar.pop();
                            firebaseFonlar.pop();
    
                            this.fetchFunds(firebaseFonlar);
    
                            this.setState({
                                firebaseFonlar: firebaseFonlar,
                            })
                        })
                    }
                    else {
                        this.setState({
                            isLoading: false,
                        })
                    }

                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    swipeUpDownRef: any = null;


    fetchFunds = async (firebaseFonlar: FirebaseFonModel[]) => {
        var apiText = "";
        firebaseFonlar.forEach(item => {
            if (!apiText.includes(item.fundName)) {
                apiText += item.fundName + ",";
            }
        })
        if (apiText != "" && apiText != null && apiText != undefined) {

            var bitisDate = new Date();
            var baslangicDate = new Date();
            baslangicDate.setDate(bitisDate.getDate() - 60);
            var selectedPortfoyCreatedDate = new Date(this.state.selectedPortfoy.createdDate);
            baslangicDate = selectedPortfoyCreatedDate < baslangicDate ? selectedPortfoyCreatedDate : baslangicDate;

            const fundResponse = await axios.get("https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/" + apiText + "/1/" + this.getFormattedDateForApi(baslangicDate) + "/" + this.getFormattedDateForApi(bitisDate));


            var funds: any[] = [];
            var dataVictory: any[] = [];
            if (fundResponse.status == 200 && fundResponse.data != null && fundResponse.data.length > 0) {
                var fundItemToday: FonModel[] = [];
                var responseFunds: FonModel[] = fundResponse.data;
                responseFunds.forEach((item: FonModel) => {
                    if ((!funds.some(x => x == item.FonKodu) || funds.length == 0) && item.FonTuru != FonTurleri.KorumaAmacliFon && item.FonTuru != FonTurleri.GumusFonu) {
                        funds.push(item.FonKodu);

                        var currDate = new Date();
                        var currDateString = this.getFormattedDateForListing(currDate);
                        var currFundValue = responseFunds.find((x: FonModel) => x.Tarih.toString() == currDateString && x.FonKodu == item.FonKodu);
                        var currIterator = 0;
                        while (currFundValue == undefined && currIterator < GunSayisi.onBesGun) {
                            currDate.setDate(currDate.getDate() - 1);
                            currDateString = this.getFormattedDateForListing(currDate);
                            currFundValue = responseFunds.find((x: FonModel) => x.Tarih.toString() == currDateString && x.FonKodu == item.FonKodu);
                            currIterator++;
                        }

                        currDate.setDate(currDate.getDate() - 1);
                        var preDateString = this.getFormattedDateForListing(currDate);
                        var preFundValue = responseFunds.find((x: FonModel) => x.Tarih.toString() == preDateString && x.FonKodu == item.FonKodu);
                        var preIterator = 0;
                        while (preFundValue == undefined && preIterator < GunSayisi.onBesGun) {
                            currDate.setDate(currDate.getDate() - 1);
                            preDateString = this.getFormattedDateForListing(currDate);
                            preFundValue = responseFunds.find((x: FonModel) => x.Tarih.toString() == preDateString && x.FonKodu == item.FonKodu);
                            preIterator++;
                        }
                        if (currFundValue != undefined && preFundValue != undefined) {
                            if (currFundValue.BirimPayDegeri != undefined && preFundValue.BirimPayDegeri != undefined) {
                                if (currFundValue.BirimPayDegeri != null && preFundValue.BirimPayDegeri != null) {
                                    if (currFundValue.BirimPayDegeri != 0 && preFundValue.BirimPayDegeri != null) {
                                        currFundValue.GunlukArtisYuzdesi = ((currFundValue.BirimPayDegeri - preFundValue.BirimPayDegeri) * 100) / preFundValue.BirimPayDegeri;
                                    }
                                    else {

                                        currFundValue.GunlukArtisYuzdesi = 0;
                                    }
                                }
                                else {

                                    currFundValue.GunlukArtisYuzdesi = 0;
                                }
                            }
                            else {

                                currFundValue.GunlukArtisYuzdesi = 0;
                            }
                        }
                        else {

                            currFundValue.GunlukArtisYuzdesi = 0;
                        }

                        if (currFundValue != undefined) {
                            currFundValue.AlinanFonlar = [];
                            currFundValue.fundIds = [];
                            fundItemToday.push(currFundValue);
                        }
                    }
                })

                firebaseFonlar.forEach(item => {
                    var index = fundItemToday.findIndex(x => x.FonKodu == item.fundName);
                    if (index >= 0) {
                        item.createdDate = new Date(item.createdDate);
                        item.dateView = this.getFormattedDateForView(item.createdDate);
                        fundItemToday[index].AlinanFonlar.push(item);
                        fundItemToday[index].fundIds.push(item.fundId);
                        fundItemToday[index].portfoyId = item.portfoyId;
                    }
                })

                fundItemToday.forEach(fon => {
                    var toplamOdenenPara = 0;
                    var toplamAlinanAdet = 0;
                    fon.AlinanFonlar.forEach(item => {
                        toplamOdenenPara += item.fundPurchaseValue * item.fundCount;
                        toplamAlinanAdet += item.fundCount;
                    })
                    var ortalamaMaliyet = toplamOdenenPara / toplamAlinanAdet;
                    fon.ortalamaMaliyet = ortalamaMaliyet;
                    fon.toplamAlinanLot = toplamAlinanAdet;
                    fon.toplamOdenenPara = toplamOdenenPara;
                })

                responseFunds.forEach((item: FonModel) => {
                    var date = new Date(item.Tarih.toString());
                    var firebaseFon = firebaseFonlar.find(y => y.fundName == item.FonKodu);
                    if (selectedPortfoyCreatedDate <= date && firebaseFon.createdDate <= date) {
                        var gunlukFon = fundItemToday.find(x => x.FonKodu == item.FonKodu);
                        var gunlukParaHareketi = gunlukFon.toplamAlinanLot * item.BirimPayDegeri;



                        var dataVictoryIndex = dataVictory.findIndex(label => label.x == this.getFormattedDateForView(date));
                        if (dataVictoryIndex >= 0) {
                            dataVictory[dataVictoryIndex].y += gunlukParaHareketi;
                        }
                        else {
                            dataVictory.push({ x: this.getFormattedDateForView(date), y: gunlukParaHareketi });
                        }

                    }

                })

                var portfoyunDunkuDegeri = 0;
                var portfoyunSuankiDegeri = 0;
                var portfoyeToplamHarcananPara = 0;
                var portfoyGunlukArtis = 0;
                var portfoyKontrolFunds: any[] = [];
                var fundItemPortfoy: FonModel[] = [];
                responseFunds.forEach((item: FonModel) => {
                    if ((!portfoyKontrolFunds.some(x => x == item.FonKodu) || portfoyKontrolFunds.length == 0) && item.FonTuru != FonTurleri.KorumaAmacliFon && item.FonTuru != FonTurleri.GumusFonu) {
                        var firebaseFon = firebaseFonlar.find(y => y.fundName == item.FonKodu);
                        portfoyKontrolFunds.push(item.FonKodu);
                        var gecmisleOlanFarkHesaplanacaMi = true;
                        var currDate = new Date();
                        var currDateString = this.getFormattedDateForListing(currDate);
                        var currFundValue = responseFunds.find((x: FonModel) => x.Tarih.toString() == currDateString && x.FonKodu == item.FonKodu);
                        var currIterator = 0;
                        while (currFundValue == undefined && currIterator < GunSayisi.onBesGun) {
                            currDate.setDate(currDate.getDate() - 1);
                            if (currDate == firebaseFon.createdDate) {
                                gecmisleOlanFarkHesaplanacaMi = false;
                                break;
                            }
                            currDateString = this.getFormattedDateForListing(currDate);
                            currFundValue = responseFunds.find((x: FonModel) => x.Tarih.toString() == currDateString && x.FonKodu == item.FonKodu);
                            currIterator++;
                        }

                        if (currDate < firebaseFon.createdDate) {
                            gecmisleOlanFarkHesaplanacaMi = false;
                        }

                        currDate.setDate(currDate.getDate() - 1);
                        var preDateString = this.getFormattedDateForListing(currDate);
                        var preFundValue = responseFunds.find((x: FonModel) => x.Tarih.toString() == preDateString && x.FonKodu == item.FonKodu);
                        var preIterator = 0;
                        while (preFundValue == undefined && preIterator < GunSayisi.onBesGun) {
                            currDate.setDate(currDate.getDate() - 1);
                            if (currDate < firebaseFon.createdDate) {
                                gecmisleOlanFarkHesaplanacaMi = false;
                                break;
                            }
                            preDateString = this.getFormattedDateForListing(currDate);
                            preFundValue = responseFunds.find((x: FonModel) => x.Tarih.toString() == preDateString && x.FonKodu == item.FonKodu);
                            preIterator++;
                        }

                        if (gecmisleOlanFarkHesaplanacaMi) {
                            portfoyunSuankiDegeri += currFundValue.toplamAlinanLot * currFundValue.BirimPayDegeri;
                            portfoyunDunkuDegeri += currFundValue.toplamAlinanLot * preFundValue.BirimPayDegeri;
                            portfoyGunlukArtis += currFundValue.toplamAlinanLot * currFundValue.BirimPayDegeri - currFundValue.toplamAlinanLot * preFundValue.BirimPayDegeri;
                            currFundValue.toplamBugunkuDeger = currFundValue.toplamAlinanLot * currFundValue.BirimPayDegeri;
                            currFundValue.toplamDunkuDeger = currFundValue.toplamAlinanLot * preFundValue.BirimPayDegeri;
                            fundItemPortfoy.push(currFundValue);
                        }
                        else {
                            portfoyunSuankiDegeri += currFundValue.toplamAlinanLot * currFundValue.BirimPayDegeri;
                            currFundValue.toplamBugunkuDeger = currFundValue.toplamAlinanLot * currFundValue.BirimPayDegeri;
                            currFundValue.toplamDunkuDeger = 0;
                            fundItemPortfoy.push(currFundValue);
                        }
                        portfoyeToplamHarcananPara += currFundValue.toplamAlinanLot * currFundValue.ortalamaMaliyet;
                    }
                })


                var portfoyunGunlukArtisYuzdesi = 0;
                var dunkuFiyat = 0;
                var suankiFiyat = 0;
                fundItemPortfoy.forEach(item => {
                    if (item.toplamDunkuDeger != 0) {
                        dunkuFiyat += item.toplamDunkuDeger;
                        suankiFiyat += item.toplamBugunkuDeger;
                    }
                })

                var portfoyunGunlukArtisYuzdesi = dunkuFiyat != 0 ? ((suankiFiyat - dunkuFiyat) / dunkuFiyat) * 100 : 0;

                this.setState({
                    fundItemToday: fundItemToday,
                    dataVictoryLineChart: dataVictory,
                    portfoyunDunkuDegeri: portfoyunDunkuDegeri,
                    portfoyunSuankiDegeri: portfoyunSuankiDegeri,
                    portfoyGunlukArtis: portfoyGunlukArtis,
                    portfoyeToplamHarcananPara: portfoyeToplamHarcananPara,
                    fundItemPortfoy: fundItemPortfoy,
                    portfoyunGunlukArtisYuzdesi: portfoyunGunlukArtisYuzdesi,
                })
            }
        }
        else {
            this.setState({
                fundItemToday: [],
            })
        }
    }

    getFormattedDateForListing(date: Date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + "-" + day + "T00:00:00";
    }

    getFormattedDateForApi(date: Date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return month + '-' + day + "-" + year;
    }
    getFormattedDateForView(date: Date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return day + '-' + month + "-" + year;
    }

    addPortfoy() {
        fetchPortfoyDataFirebase(this.state.userInfo.uid).then(result => {
            var portfoyler: FirebasePortfoyModel[] = []
            var portfoylerDropDownPicker: any[] = []
            result.forEach(element => {
                var portfoy: FirebasePortfoyModel = {
                    portfoyName: element._snapshot.value.portfoyName,
                    portfoyId: element._snapshot.value.portfoyId,
                    isActive: element._snapshot.value.isActive,
                    createdDate: element._snapshot.value.createdDate,
                    updatedDate: element._snapshot.value.updatedDate,

                };
                portfoyler.push(portfoy);
                portfoylerDropDownPicker.push({ value: element._snapshot.value.portfoyId, label: element._snapshot.value.portfoyName });
            })
            this.setState({
                portfoyler: portfoyler,
                portfoylerDropDownPicker: portfoylerDropDownPicker,
                defaultDropDownPickerItem: portfoyler[portfoyler.length - 1].portfoyId,
                selectedPortfoy: portfoyler[portfoyler.length - 1],
                isLoading: false,
                fundItemToday: []
            })
        });
    }

    addFon = async () => {
        this.listeyiYenidenYukle();
    }

    deleteFon = async (portfoyId: string, fundIds: string[]) => {
        Alert.alert(
            "Silme İşlemi",
            "Fonu Silmek İstiyor Musunuz?",
            [
                {
                    text: "Vazgeç",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Sil", onPress: () => { deleteFundInfo(this.state.userInfo.uid, portfoyId, fundIds); this.listeyiYenidenYukle() } }
            ],
            { cancelable: false }
        );
    }

    deletePortfoy = async () => {
        Alert.alert(
            "Silme İşlemi",
            "Portföyü Silmek İstiyor Musunuz? \nPortföyü silerseniz içerisindeki fonlar da silinir.",
            [
                {
                    text: "Vazgeç",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Sil", onPress: () => { deletePortfoy(this.state.userInfo.uid, this.state.selectedPortfoy.portfoyId,); this.dropDownYenidenYukle() } }
            ],
            { cancelable: false }
        );
    }

    dropDownItemSelect = async (value: any) => {

        var portfoyIndex = this.state.portfoyler.findIndex(x => x.portfoyId == value);
        fetchPortfoyFundsDataFirebase(this.state.userInfo.uid, value).then(result => {
            var firebaseFonlar: FirebaseFonModel[] = []
            result.forEach(element => {
                firebaseFonlar.push(element._snapshot.value);
            })

            //sondan beş eleman fon değil portföyün genel bilgileri
            firebaseFonlar.pop();
            firebaseFonlar.pop();
            firebaseFonlar.pop();
            firebaseFonlar.pop();
            firebaseFonlar.pop();

            this.fetchFunds(firebaseFonlar);

            this.setState({
                firebaseFonlar: firebaseFonlar,
                defaultDropDownPickerItem: value,
                selectedPortfoy: this.state.portfoyler[portfoyIndex],
                isLoading: false,
            })
        })

    }

    swipeContainer(data: ListRenderItemInfo<FonModel>, rowMap: RowMap<FonModel>) {
        return (
            <View style={styles.containerPortfoySwipe}>

                <View style={{ flex: 1, alignContent: "flex-start" }}>
                    <TouchableOpacity style={{ width: "100%", height: "95%", backgroundColor: colors.greenAdd, justifyContent: "center" }}
                        onPress={() => { rowMap[data.index].closeRow(); this.props.navigation.navigate("Fon Detay", { fundItem: data.item }) }}>
                        <Ionicons name={"bar-chart-sharp"} size={moderateScale(30, 1)} color={colors.White} style={{ marginLeft: scale(27) }} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, alignContent: "flex-end" }}>
                    <TouchableOpacity style={{ width: "100%", height: "95%", backgroundColor: colors.deleteButtonColor, justifyContent: "center" }}
                        onPress={() => { rowMap[data.index].closeRow(); this.deleteFon(data.item.portfoyId, data.item.fundIds) }}>
                        <Ionicons name={"trash-sharp"} size={moderateScale(30, 1)} color={colors.White} style={{ marginLeft: scale(110) }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    listeyiYenidenYukle() {
        fetchPortfoyFundsDataFirebase(this.state.userInfo.uid, this.state.defaultDropDownPickerItem).then(result => {
            var firebaseFonlar: FirebaseFonModel[] = []
            result.forEach(element => {
                firebaseFonlar.push(element._snapshot.value);
            })

            //sondan beş eleman fon değil portföyün genel bilgileri
            firebaseFonlar.pop();
            firebaseFonlar.pop();
            firebaseFonlar.pop();
            firebaseFonlar.pop();
            firebaseFonlar.pop();

            this.fetchFunds(firebaseFonlar);

            this.setState({
                firebaseFonlar: firebaseFonlar,
                isLoading: false,
            })

            //this.fetchLineChartData(this.state.selectedPortfoy,firebaseFonlar);
        })
    }

    dropDownYenidenYukle() {
        fetchPortfoyDataFirebase(this.state.userInfo.uid).then(result => {
            var portfoyler: FirebasePortfoyModel[] = []
            var portfoylerDropDownPicker: any[] = []
            result.forEach(element => {
                var portfoy: FirebasePortfoyModel = {
                    portfoyName: element._snapshot.value.portfoyName,
                    portfoyId: element._snapshot.value.portfoyId,
                    isActive: element._snapshot.value.isActive,
                    createdDate: element._snapshot.value.createdDate,
                    updatedDate: element._snapshot.value.updatedDate,

                };
                portfoyler.push(portfoy);
                portfoylerDropDownPicker.push({ value: element._snapshot.value.portfoyId, label: element._snapshot.value.portfoyName });
            })
            this.setState({
                portfoyler: portfoyler,
                portfoylerDropDownPicker: portfoylerDropDownPicker,
                defaultDropDownPickerItem: portfoyler[portfoyler.length - 1] ? portfoyler[portfoyler.length - 1].portfoyId : null,
                selectedPortfoy: portfoyler[portfoyler.length - 1] ? portfoyler[portfoyler.length - 1] : null,
                isLoading: false,
                iconReverse: false,
            })
        });
        this.listeyiYenidenYukle();

    }


    pieChart(dataVictoryForPieChart: any[], baslik: string) {
        return (
            <View>
                <View style={{ alignItems: "center", justifyContent: "center", padding: scale(10), borderColor: "white", borderWidth: scale(1), marginBottom: scale(10) }}>
                    <Text style={{ fontSize: moderateScale(15, 1), textAlign: "center", color: "white" }}>{baslik}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 5 }}>
                        <Svg width={screenWidth} height={scale(220)} viewBox="80 0 400 400">
                            <VictoryPie
                                standalone={false}
                                labels={() => ''}
                                style={{
                                    labels: { fontSize: moderateScale(10, 1), fill: "white" },
                                    data: {
                                        fill: ({ datum }) => datum.l
                                    }
                                }}
                                data={dataVictoryForPieChart}
                            />
                        </Svg>
                    </View>
                    <View style={{ flex: 4 }}>
                        {dataVictoryForPieChart.sort((a, b) => b.y - a.y).map(r => <View style={{ margin: scale(5), flexDirection: "row" }}><View style={{ flex: 0.15 }}><Icon name="square" size={moderateScale(14, 1)} color={r.l} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.White, fontSize: moderateScale(9, 1) }}>{r.x + ": %" + r.y.toFixed(2)}</Text></View></View>)}
                    </View>
                </View>
            </View>
        )
    }

    lineChart(dataVictory: any[], baslik: string) {
        return (
            <View>
                <View style={{ alignItems: "center", justifyContent: "center", padding: scale(10), borderColor: "white", borderWidth: scale(1), marginBottom: scale(10) }}>
                    <Text style={{ fontSize: moderateScale(15, 1), textAlign: "center", color: "white" }}>{baslik}</Text>
                </View>
                <View>
                    <VictoryChart height={scale(300)} width={screenWidth}
                        containerComponent={
                            <VictoryVoronoiContainer
                                voronoiDimension="x"
                                labels={({ datum }) => Number(datum.y.toFixed(2)).toLocaleString() + "\n" + datum.x}
                                labelComponent={
                                    <VictoryTooltip
                                        cornerRadius={0}
                                        flyoutStyle={{ fill: colors.victoryTooltipFlyoutStyleColor }}
                                    />}
                                activateLabels={false}
                            />}
                    >
                        <VictoryAxis dependentAxis crossAxis
                            width={screenWidth}
                            height={scale(400)}
                            theme={VictoryTheme.material}
                            offsetX={scale(45)}
                            standalone={false}
                            style={{
                                axis: { stroke: colors.axisStrokeColor },
                                axisLabel: { fontSize: moderateScale(16, 1) },
                                ticks: { stroke: colors.axisStrokeColor },
                                tickLabels: { fontSize: moderateScale(10, 1), fill: colors.axisStrokeColor }
                            }}
                        />
                        <VictoryAxis tickCount={5} style={{
                            axis: { stroke: colors.axisStrokeColor },
                            axisLabel: { fontSize: moderateScale(16, 1) },
                            ticks: { stroke: colors.axisStrokeColor },
                            tickLabels: { fontSize: moderateScale(9, 1), padding: scale(5), angle: 340, verticalAnchor: 'middle', textAnchor: 'end', fill: colors.axisStrokeColor }
                        }} />
                        <VictoryLine
                            data={dataVictory}
                            style={{
                                data: {
                                    stroke: colors.VictoryLineStrokeColor,
                                    strokeWidth: ({ active }) => active ? 2 : 1,
                                },
                                labels: { fill: colors.VictoryLineStrokeColor }
                            }}
                        />
                    </VictoryChart>
                </View>
            </View>
        )
    }

    istatistikView() {
        return (
            <View style={{ padding: scale(10), marginBottom: scale(10) }}>
                <View style={{ alignItems: "flex-start", flexDirection: "row", borderBottomWidth: scale(1), borderBottomColor: colors.White }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{"Dünkü Değer"}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{"Bugünkü Değer"}</Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{"Günlük Artış"}</Text>
                    </View>

                </View>

                <View style={{ alignItems: "flex-start", flexDirection: "row", marginBottom: scale(10) }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{Number(this.state.portfoyunDunkuDegeri.toFixed(2)).toLocaleString() + " TL"}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{Number(this.state.portfoyunSuankiDegeri.toFixed(2)).toLocaleString() + " TL"}</Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{Number(this.state.portfoyGunlukArtis.toFixed(2)).toLocaleString() + " TL" + " (%" + Number(this.state.portfoyunGunlukArtisYuzdesi.toFixed(2)).toLocaleString() + ")"}</Text>
                    </View>

                </View>

                <View style={{ alignItems: "flex-start", flexDirection: "row", borderBottomWidth: scale(1), borderBottomColor: colors.White }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(11, 1) }}>{"Fon Kodu"}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(11, 1) }}>{"Günlük Artış"}</Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        <Text style={{ color: colors.White, fontSize: moderateScale(11, 1) }}>{"Genel Artış"}</Text>
                    </View>

                </View>

                {this.state.fundItemPortfoy.map(fon =>
                    <View style={{ alignItems: "flex-start", flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.White, fontSize: moderateScale(11, 1) }}>{fon.FonKodu}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.White, fontSize: moderateScale(11, 1) }}>{fon.toplamDunkuDeger != 0 ? Number((fon.toplamBugunkuDeger - fon.toplamDunkuDeger).toFixed(2)).toLocaleString() + " (%" + (Number((((fon.toplamBugunkuDeger - fon.toplamDunkuDeger) / fon.toplamDunkuDeger) * 100).toFixed(2))).toLocaleString() + ")" : "0 (%0)"}</Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <Text style={{ color: colors.White, fontSize: moderateScale(11, 1) }}>{Number((fon.toplamBugunkuDeger - fon.toplamOdenenPara).toFixed(2)).toLocaleString() + " (%" + (Number((((fon.toplamBugunkuDeger - fon.toplamOdenenPara) / fon.toplamOdenenPara) * 100).toFixed(2))).toLocaleString() + ")"}</Text>
                        </View>

                    </View>)}



                <View style={{ alignItems: "flex-start", flexDirection: "row", borderBottomWidth: scale(1), borderBottomColor: colors.White, marginTop: scale(10) }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{"Başlangıç Değer"}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{"Toplam Değer"}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{"Toplam Artış"}</Text>
                    </View>

                </View>

                <View style={{ alignItems: "flex-start", flexDirection: "row", marginBottom: scale(10) }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{Number(this.state.portfoyeToplamHarcananPara.toFixed(2)).toLocaleString() + " TL"}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{Number(this.state.portfoyunSuankiDegeri.toFixed(2)).toLocaleString() + " TL"}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.White, fontSize: moderateScale(14, 1) }}>{Number((this.state.portfoyunSuankiDegeri - this.state.portfoyeToplamHarcananPara).toFixed(2)).toLocaleString() + " TL" + " (%" + Number((((this.state.portfoyunSuankiDegeri - this.state.portfoyeToplamHarcananPara) / this.state.portfoyeToplamHarcananPara) * 100).toFixed(2)).toLocaleString() + ")"}</Text>
                    </View>
                </View>
            </View>
        );
    }


    swipeUpView() {

        var fonDagilim: FonModel[] = this.state.fundItemToday;
        var dataVictoryForPieChart: any[] = [];
        var dataVictoryForPieChartFonIcerik: any[] = [];
        var colorIndex = 0;
        var genelToplam = 0;
        var fonIcerikDagilim: FonModel = {
            BirimPayDegeri: 0,
            DolasimdakiPaySayisi: 0,
            FonKodu: "",
            FonTipi: "",
            FonTuru: "",
            FonUnvani: "",
            Tarih: null,
            ToplamDeger: 0,
            YatirimciSayisi: 0,
            GunlukArtisYuzdesi: 0,
            DevletTahvili: 0,
            BankaBonosu: 0,
            Diger: 0,
            DovizOdemeliBono: 0,
            DovizOdemeliTahvil: 0,
            Eurobond: 0,
            FinansmanBonosu: 0,
            FonKatilmaBelgesi: 0,
            GayrimenkulSertifikasi: 0,
            HazineBonosu: 0,
            HisseSenedi: 0,
            KamuDisBorclanmaAraci: 0,
            KamuKiraSertifikasi: 0,
            KatilimHesabi: 0,
            KiymetliMaden: 0,
            OzelSektorKiraSertifikasi: 0,
            OzelSektorTahvili: 0,
            TPP: 0,
            TersRepo: 0,
            TurevAraci: 0,
            VadeliMevduat: 0,
            VarligaDayaliMenkulKiymet: 0,
            YabanciBorclanmaAraci: 0,
            YabanciHisseSenedi: 0,
            YabanciMenkulKiymet: 0,
            fundIds: null,
            portfoyId: null
        };

        if (fonDagilim != null || fonDagilim != undefined || fonDagilim != []) {
            fonDagilim.forEach(fon => {
                var fonToplamFiyat = 0;
                fon.AlinanFonlar.forEach(item => {
                    fonToplamFiyat += item.fundCount * item.fundPurchaseValue;
                    genelToplam += item.fundCount * item.fundPurchaseValue;
                })

                dataVictoryForPieChart.push({ x: fon.FonKodu, y: fonToplamFiyat, l: this.state.colorsPackage[colorIndex] });
                colorIndex++;
            })
        }

        dataVictoryForPieChart.forEach(item => {
            item.y = (item.y / genelToplam);
            var fon = fonDagilim.find(k => k.FonKodu == item.x);

            fonIcerikDagilim.DevletTahvili += fon.DevletTahvili * item.y;
            fonIcerikDagilim.BankaBonosu += fon.BankaBonosu * item.y;
            fonIcerikDagilim.Diger += fon.Diger * item.y;
            fonIcerikDagilim.DovizOdemeliBono += fon.DovizOdemeliBono * item.y;
            fonIcerikDagilim.DovizOdemeliTahvil += fon.DovizOdemeliTahvil * item.y;
            fonIcerikDagilim.Eurobond += fon.Eurobond * item.y;
            fonIcerikDagilim.FinansmanBonosu += fon.FinansmanBonosu * item.y;
            fonIcerikDagilim.FonKatilmaBelgesi += fon.FonKatilmaBelgesi * item.y;
            fonIcerikDagilim.GayrimenkulSertifikasi += fon.GayrimenkulSertifikasi * item.y;
            fonIcerikDagilim.HazineBonosu += fon.HazineBonosu * item.y;
            fonIcerikDagilim.HisseSenedi += fon.HisseSenedi * item.y;
            fonIcerikDagilim.KamuDisBorclanmaAraci += fon.KamuDisBorclanmaAraci * item.y;
            fonIcerikDagilim.KamuKiraSertifikasi += fon.KamuKiraSertifikasi * item.y;
            fonIcerikDagilim.KatilimHesabi += fon.KatilimHesabi * item.y;
            fonIcerikDagilim.KiymetliMaden += fon.KiymetliMaden * item.y;
            fonIcerikDagilim.OzelSektorKiraSertifikasi += fon.OzelSektorKiraSertifikasi * item.y;
            fonIcerikDagilim.OzelSektorTahvili += fon.OzelSektorTahvili * item.y;
            fonIcerikDagilim.TPP += fon.TPP * item.y;
            fonIcerikDagilim.TersRepo += fon.TersRepo * item.y;
            fonIcerikDagilim.TurevAraci += fon.TurevAraci * item.y;
            fonIcerikDagilim.VadeliMevduat += fon.VadeliMevduat * item.y;
            fonIcerikDagilim.VarligaDayaliMenkulKiymet += fon.VarligaDayaliMenkulKiymet * item.y;
            fonIcerikDagilim.YabanciBorclanmaAraci += fon.YabanciBorclanmaAraci * item.y;
            fonIcerikDagilim.YabanciHisseSenedi += fon.YabanciHisseSenedi * item.y;
            fonIcerikDagilim.YabanciMenkulKiymet += fon.YabanciMenkulKiymet * item.y;
            item.y = item.y * 100;
        });

        fonIcerikDagilim.DevletTahvili != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Devlet Tahvili", y: fonIcerikDagilim.DevletTahvili, l: colors.DevletTahvili }) : null;
        fonIcerikDagilim.BankaBonosu != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Banka Bonosu", y: fonIcerikDagilim.BankaBonosu, l: colors.BankaBonosu }) : null;
        fonIcerikDagilim.Diger != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Diğer", y: fonIcerikDagilim.Diger, l: colors.Diger }) : null;
        fonIcerikDagilim.DovizOdemeliBono != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Döviz Ödemeli Bono", y: fonIcerikDagilim.DovizOdemeliBono, l: colors.DovizOdemeliBono }) : null;
        fonIcerikDagilim.DovizOdemeliTahvil != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Döviz Ödemeli Tahvil", y: fonIcerikDagilim.DovizOdemeliTahvil, l: colors.DovizOdemeliTahvil }) : null;
        fonIcerikDagilim.Eurobond != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "EuroBond", y: fonIcerikDagilim.Eurobond, l: colors.Eurobond }) : null;
        fonIcerikDagilim.FinansmanBonosu != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Finansman Bonosu", y: fonIcerikDagilim.FinansmanBonosu, l: colors.FinansmanBonosu }) : null;
        fonIcerikDagilim.FonKatilmaBelgesi != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Fon Katılma Belgesi", y: fonIcerikDagilim.FonKatilmaBelgesi, l: colors.FonKatilmaBelgesi }) : null;
        fonIcerikDagilim.GayrimenkulSertifikasi != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Gayrimenkul Sertifikası", y: fonIcerikDagilim.GayrimenkulSertifikasi, l: colors.GayrimenkulSertifikasi }) : null;
        fonIcerikDagilim.HazineBonosu != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Hazine Bonosu", y: fonIcerikDagilim.HazineBonosu, l: colors.HazineBonosu }) : null;
        fonIcerikDagilim.HisseSenedi != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Hisse Senedi", y: fonIcerikDagilim.HisseSenedi, l: colors.HisseSenedi }) : null;
        fonIcerikDagilim.KamuDisBorclanmaAraci != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Kamu Dış Borçlanma Aracı", y: fonIcerikDagilim.KamuDisBorclanmaAraci, l: colors.KamuDisBorclanmaAraci }) : null;
        fonIcerikDagilim.KamuKiraSertifikasi != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Kamu Kira Sertifikası", y: fonIcerikDagilim.KamuKiraSertifikasi, l: colors.KamuKiraSertifikasi }) : null;
        fonIcerikDagilim.KatilimHesabi != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Katılım Hesabı", y: fonIcerikDagilim.KatilimHesabi, l: colors.KatilimHesabi }) : null;
        fonIcerikDagilim.KiymetliMaden != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Kıymetli Maden", y: fonIcerikDagilim.KiymetliMaden, l: colors.KiymetliMaden }) : null;
        fonIcerikDagilim.OzelSektorKiraSertifikasi != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Özel Sektör Kira Sertifikası", y: fonIcerikDagilim.OzelSektorKiraSertifikasi, l: colors.OzelSektorKiraSertifikasi }) : null;
        fonIcerikDagilim.OzelSektorTahvili != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Özel Sektör Tahvili", y: fonIcerikDagilim.OzelSektorTahvili, l: colors.OzelSektorTahvili }) : null;
        fonIcerikDagilim.TPP != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "TPP", y: fonIcerikDagilim.TPP, l: colors.TPP }) : null;
        fonIcerikDagilim.TersRepo != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Ters Repo", y: fonIcerikDagilim.TersRepo, l: colors.TersRepo }) : null;
        fonIcerikDagilim.TersRepo != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Türev Aracı", y: fonIcerikDagilim.TersRepo, l: colors.TurevAraci }) : null;
        fonIcerikDagilim.VadeliMevduat != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Vadeli Mevduat", y: fonIcerikDagilim.VadeliMevduat, l: colors.VadeliMevduat }) : null;
        fonIcerikDagilim.VarligaDayaliMenkulKiymet != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Varlığa Dayalı Menkul Kıymet", y: fonIcerikDagilim.VarligaDayaliMenkulKiymet, l: colors.VarligaDayaliMenkulKiymet }) : null;
        fonIcerikDagilim.YabanciBorclanmaAraci != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Yabancı Borçlanma Aracı", y: fonIcerikDagilim.YabanciBorclanmaAraci, l: colors.YabanciBorclanmaAraci }) : null;
        fonIcerikDagilim.YabanciHisseSenedi != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Yabancı Hisse Senedi", y: fonIcerikDagilim.YabanciHisseSenedi, l: colors.YabanciHisseSenedi }) : null;
        fonIcerikDagilim.YabanciMenkulKiymet != 0 ? dataVictoryForPieChartFonIcerik.push({ x: "Yabancı Menkul Kıymet", y: fonIcerikDagilim.YabanciMenkulKiymet, l: colors.YabanciMenkulKiymet }) : null;

        return (
            <View style={{ paddingBottom: 60 }} >
                {this.renderBannerAd()}
                {this.istatistikView()}
                {this.lineChart(this.state.dataVictoryLineChart, "Portföy  Grafiği")}
                {this.pieChart(dataVictoryForPieChart, "Fon Genel Dağılım")}
                {this.pieChart(dataVictoryForPieChartFonIcerik, "Fon İçerik Dağılım")}
                {this.renderBannerAd()}
            </View>
        );
    }

    renderLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loadingStyle}>
                    <ActivityIndicator
                        size='large'
                        color="#7FB3D5"
                    />
                </View>
            )
        }
        else {
            return null;
        }
    }

    renderBannerAd() {
        const adUnitId = "ca-app-pub-2663317592266647/6786418943";
        return (
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.FULL_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                onAdClosed={() => null}
                onAdLoaded={() => null}
                onAdFailedToLoad={(error) => console.log(error)}
                onAdLeftApplication={() => null}
                onAdOpened={() => null}
            />
        )
    }

    render() {
        return (
            <View style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
                <StatusBar backgroundColor={"#1C212F"} />
                <Container style={{ backgroundColor: colors.backgroundColor }}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ backgroundColor: colors.backgroundColor }}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ flexDirection: "row", borderRadius: 5, }}>
                                <TouchableOpacity style={{ flexDirection: "row", backgroundColor: "gray", padding: scale(9) }} onPress={() => this.props.navigation.navigate("Portföy Ekle", { portfoyEkle: this.addPortfoy.bind(this) })}>
                                    <Ionicons name={"add-sharp"} size={moderateScale(30, 1)} color={colors.White} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <DropDownPicker
                                    items={this.state.portfoylerDropDownPicker}
                                    containerStyle={{ height: scale(50) }}
                                    style={{ backgroundColor: colors.backgroundColor }}
                                    itemStyle={{
                                        justifyContent: 'flex-start', backgroundColor: colors.backgroundColor
                                    }}
                                    dropDownStyle={{ backgroundColor: colors.backgroundColor, flexDirection: "column" }}
                                    onChangeItem={item => this.dropDownItemSelect(item.value)}
                                    placeholder={"Portföy Seçiniz"}
                                    labelStyle={{
                                        fontSize: moderateScale(14, 1),
                                        textAlign: 'left',
                                        color: colors.White
                                    }}
                                    dropDownMaxHeight={scale(460)}
                                    defaultValue={this.state.defaultDropDownPickerItem}
                                />
                            </View>
                        </View>

                        <ScrollView style={{ backgroundColor: colors.backgroundColor, height: "100%" }} >
                            {!this.state.isLoading ?
                                <View>
                                    {this.renderBannerAd()}
                                    {this.state.selectedPortfoy != null ?
                                        <View>
                                            <View style={{ margin: scale(5) }}>
                                                <SwipeRow rightOpenValue={-100} stopRightSwipe={-100} disableRightSwipe
                                                    body={
                                                        <View style={{ alignItems: "center", backgroundColor: colors.portfoyAdColor, width: "100%", height: "100%" }}>
                                                            <Text style={{ color: colors.White, fontSize: moderateScale(14, 1), fontWeight: "bold" }}>{"Portföy Adı: " + this.state.selectedPortfoy.portfoyName}</Text>
                                                        </View>
                                                    }
                                                    style={{ alignItems: "center", backgroundColor: colors.portfoyAdColor }}
                                                    right={
                                                        <TouchableOpacity style={{ alignItems: "center", backgroundColor: colors.deleteButtonColor, paddingVertical: scale(10) }}
                                                            onPress={() => this.deletePortfoy()}>
                                                            <Ionicons name={"trash-sharp"} size={moderateScale(25, 1)} color={colors.White} />
                                                        </TouchableOpacity>
                                                    }
                                                />
                                            </View>
                                            <View >
                                                <TouchableOpacity style={{ alignItems: "center", margin: scale(5), paddingVertical: scale(10), backgroundColor: colors.greenAdd }}
                                                    onPress={() => this.props.navigation.navigate("Fon Ekle", { fonEkle: this.addFon.bind(this), portfoyId: this.state.defaultDropDownPickerItem })}>
                                                    <Text style={{ color: colors.White, fontSize: moderateScale(15, 1), fontWeight: "bold" }}>{"Fon Ekle"}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View> : null}



                                    <SwipeListView
                                        style={{ backgroundColor: colors.backgroundColor }}
                                        data={this.state.fundItemToday}
                                        contentContainerStyle={{ paddingBottom: scale(60) }}
                                        renderItem={({ item }) => (
                                            <View style={{ backgroundColor: colors.backgroundColor }}>
                                                <View >
                                                    <View style={styles.containerPortfoy}>
                                                        <View style={{ flexDirection: "row", borderBottomWidth: scale(1), borderColor: "grey" }}>
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
                                                                            <Text style={styles.textStyle}>{"%" + item.GunlukArtisYuzdesi}</Text>)}
                                                                </View>
                                                                <View>
                                                                    <Text style={styles.textStyleBirimPayDeger}>{item.BirimPayDegeri}</Text>
                                                                </View>
                                                            </View>

                                                        </View>
                                                        {item.AlinanFonlar.map(alinanFon =>
                                                            <View style={{ alignItems: "flex-start" }}>
                                                                <View >
                                                                    <Text style={{ color: colors.White, fontSize: moderateScale(12, 1) }}>{"Alındığı Tarih: " + alinanFon.dateView + " - Fiyat: " + alinanFon.fundPurchaseValue + " - Adet: " + alinanFon.fundCount}</Text>
                                                                </View>
                                                            </View>)}
                                                        <View>
                                                            <Text style={{ color: colors.White, fontSize: moderateScale(12, 1) }}>{"Ortalama Maliyet: " + item.ortalamaMaliyet.toFixed(6)}</Text>

                                                        </View>
                                                    </View>

                                                </View>
                                            </View>)}
                                        keyExtractor={(item, index) => String(index)}
                                        leftOpenValue={100}
                                        rightOpenValue={-100}
                                        stopLeftSwipe={100}
                                        stopRightSwipe={-100}
                                        renderHiddenItem={(data, rowMap) => (
                                            this.swipeContainer(data, rowMap)
                                        )}
                                        swipeToClosePercent={10}
                                    />
                                    {this.state.iconReverse && this.state.selectedPortfoy != null && this.state.fundItemToday.length > 0 ? this.swipeUpView() : null}
                                </View>
                                : null}
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Container>
                {this.state.selectedPortfoy != null ? <View>
                    <TouchableOpacity style={styles.bottomView} onPress={() => this.setState({ iconReverse: !this.state.iconReverse })}>
                        <Ionicons name={!this.state.iconReverse ? "chevron-up-sharp" : "chevron-down-sharp"} size={moderateScale(45, 1)} color={colors.White} />
                    </TouchableOpacity>
                </View> : null}
                {this.renderLoading()}
            </View >
        );
    }

}

