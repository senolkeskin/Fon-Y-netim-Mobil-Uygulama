import React, { Component, useContext } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Dimensions,
    FlatList,
    ScrollView,
} from "react-native";
import { NavigationScreenProp, NavigationState, } from "react-navigation";
import styles from "../styles";
import Icon from "react-native-vector-icons/Ionicons";
import RNPickerSelect from 'react-native-picker-select';
import { Input, CheckBox, SearchBar } from "react-native-elements";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { FonIcerikleri, FonTurleri, Gunler, GunSayisi } from "../constants/enums"
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryLine, VictoryPie, VictoryTheme, } from "victory-native";
import { colors } from "../constants/colors";
import { Container, Tab, TabHeading, Tabs } from "native-base";
import Svg from "react-native-svg"

import { addFunInfo, addPortfoy, fetchPortfoyDataFirebase, fetchPortfoyFundsDataFirebase } from "../firebaseRealtimeDatabase/firebaseRealtimeDatabase"
import { AuthContext } from "../navigation/Auth";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { color } from "react-native-reanimated";

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
                    this.setState({
                        portfoyler: portfoyler,
                        portfoylerDropDownPicker: portfoylerDropDownPicker,
                        defaultDropDownPickerItem: portfoyler[portfoyler.length - 1].portfoyId,
                        selectedPortfoy: portfoyler[portfoyler.length - 1],
                        isLoading: false,
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


                });

            }
        } catch (e) {
            console.log(e);
        }
    }


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
            const fundResponse = await axios.get("https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/" + apiText + "/1/" + this.getFormattedDateForApi(baslangicDate) + "/" + this.getFormattedDateForApi(bitisDate));


            var funds: any[] = [];
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
                            fundItemToday.push(currFundValue);

                            //analiz için
                            // if (currFundValue.FonTuru == FonTurleri.KarmaFon || currFundValue.FonTuru == FonTurleri.DegiskenFon) {
                            //     KarmaVeDegiskenFonlarToday.push(currFundValue);
                            //     KarmaVeDegiskenFonlarOneMonthAgo.push(item);
                            // }
                        }
                    }
                })

                firebaseFonlar.forEach(item => {
                    var index = fundItemToday.findIndex(x => x.FonKodu == item.fundName);
                    if (index >= 0) {
                        item.createdDate = new Date(item.createdDate);
                        item.dateView = this.getFormattedDateForView(item.createdDate);
                        fundItemToday[index].AlinanFonlar.push(item);
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
                })
                this.setState({
                    fundItemToday: fundItemToday,
                })
            }
        }
        else{
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
            })
        });
    }

    addFon = async () => {
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
        })
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

    render() {
        return (
            <View style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
                <StatusBar backgroundColor="#363E58" />
                <Container style={{ backgroundColor: colors.backgroundColor }}>
                    <Tabs tabBarPosition='bottom' tabContainerStyle={{ height: 1 }}
                        tabBarUnderlineStyle={{
                            backgroundColor: colors.backgroundColor,
                            height: 2,
                        }}>
                        <Tab heading={<TabHeading></TabHeading>}>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ backgroundColor: colors.backgroundColor }}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ flexDirection: "row", borderRadius: 5, }}>
                                        <TouchableOpacity style={{ flexDirection: "row", backgroundColor: "gray", padding: 9 }} onPress={() => this.props.navigation.navigate("Portföy Ekle", { portfoyEkle: this.addPortfoy.bind(this) })}>
                                            <Ionicons name={"add-sharp"} size={30} color={colors.White} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <DropDownPicker
                                            items={this.state.portfoylerDropDownPicker}
                                            containerStyle={{ height: 50 }}
                                            style={{ backgroundColor: '#363E58' }}
                                            itemStyle={{
                                                justifyContent: 'flex-start', backgroundColor: '#363E58'
                                            }}
                                            dropDownStyle={{ backgroundColor: '#363E58', flexDirection: "column" }}
                                            onChangeItem={item => this.dropDownItemSelect(item.value)}
                                            placeholder={"Portföy Seçiniz"}
                                            labelStyle={{
                                                fontSize: 14,
                                                textAlign: 'left',
                                                color: 'white'
                                            }}
                                            dropDownMaxHeight={500}
                                            defaultValue={this.state.defaultDropDownPickerItem}
                                        />
                                    </View>
                                </View>

                                <ScrollView style={{ backgroundColor: colors.backgroundColor, height: "100%" }} >
                                    {!this.state.isLoading ?
                                        <View>
                                            <View style={{ alignItems: "center", borderWidth: 1, borderColor: colors.White, margin: 5, paddingVertical: 10 }}>
                                                <Text style={{ color: colors.White, fontSize: 15, fontWeight: "bold" }}>{"Portföy Adı: " + this.state.selectedPortfoy.portfoyName}</Text>
                                            </View>
                                            <View >
                                                <TouchableOpacity style={{ alignItems: "center", margin: 5, paddingVertical: 10, backgroundColor: colors.greenAdd }}
                                                    onPress={() => this.props.navigation.navigate("Fon Ekle", { fonEkle: this.addFon.bind(this), portfoyId: this.state.defaultDropDownPickerItem })}>
                                                    <Text style={{ color: colors.White, fontSize: 15, fontWeight: "bold" }}>{"Fon Ekle"}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <FlatList
                                                style={{ backgroundColor: "#363E58" }}
                                                data={this.state.fundItemToday}
                                                contentContainerStyle={{ paddingBottom: 60 }}
                                                renderItem={({ item }) => (
                                                    <View style={{ backgroundColor: "#363E58" }}>
                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Fon Detay", { fundItem: item })}>
                                                            <View style={styles.containerPortfoy}>
                                                                <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "grey" }}>
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
                                                                        {/* <View style={{ flex: 0.15 }}>
                                                                                <Icon name="square" size={15} />
                                                                            </View> */}
                                                                        <View >
                                                                            <Text style={{ color: colors.White, fontSize: 12 }}>{"Alındığı Tarih: " + alinanFon.dateView + " - Fiyat: " + alinanFon.fundPurchaseValue + " - Adet: " + alinanFon.fundCount}</Text>
                                                                        </View>
                                                                    </View>)}
                                                                <View>
                                                                    <Text style={{ color: colors.White, fontSize: 12 }}>{"Ortalama Maliyet: " + item.ortalamaMaliyet.toFixed(6)}</Text>

                                                                </View>
                                                            </View>

                                                        </TouchableOpacity>
                                                    </View>)}
                                                keyExtractor={(item, index) => String(index)}
                                            />
                                        </View>
                                        : null}
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </Tab>



                        <Tab heading={<TabHeading></TabHeading>} >
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ backgroundColor: colors.backgroundColor }}>

                                <ScrollView style={{ backgroundColor: colors.backgroundColor, height: "100%" }}>
                                    {!this.state.isLoading ?
                                        <View>
                                            <FlatList
                                                style={{ backgroundColor: "#363E58" }}
                                                contentContainerStyle={{ paddingBottom: 195 }}
                                                data={this.state.portfoyler}
                                                renderItem={({ item }) => (
                                                    <View style={{ backgroundColor: "#363E58" }}>
                                                        <TouchableOpacity >
                                                            <View style={styles.container}>
                                                                <View>
                                                                    <Text style={{ color: "white" }}>{item.portfoyName + " " + item.portfoyId}</Text>
                                                                </View>

                                                            </View>

                                                        </TouchableOpacity>
                                                    </View>)}
                                                keyExtractor={(item, index) => String(index)}
                                            />


                                            <FlatList
                                                style={{ backgroundColor: "#363E58" }}
                                                //contentContainerStyle={{ paddingBottom: 195 }}
                                                data={this.state.firebaseFonlar}
                                                renderItem={({ item }) => (
                                                    <View style={{ backgroundColor: "#363E58" }}>
                                                        <TouchableOpacity >
                                                            <View style={styles.container}>
                                                                <View>
                                                                    <Text style={{ color: "white" }}>{item.fundName + " " + item.fundId}</Text>
                                                                </View>

                                                            </View>

                                                        </TouchableOpacity>
                                                    </View>)}
                                                keyExtractor={(item, index) => String(index)}
                                            />
                                        </View>
                                        : null}
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </Tab>


                    </Tabs>
                </Container>
            </View >
        );
    }

}

