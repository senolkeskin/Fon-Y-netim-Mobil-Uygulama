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
        var dateNow = new Date();
        var oneMonthAgoDate = new Date();
        oneMonthAgoDate.setDate(dateNow.getDate() - GunSayisi.onBesGun);

        //günün verileri
        const fundResponse = await axios.get("https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/01/" + this.getFormattedDateForApi(oneMonthAgoDate) + "/" + this.getFormattedDateForApi(dateNow));
        var funds: any[] = [];
        if (fundResponse.status == 200 && fundResponse.data != null && fundResponse.data.length > 0) {
            var fundValues: FonModel[] = fundResponse.data;
            //7 gün içinde işlem görmüş bütün fonları bul
            var fundItemToday: FonModel[] = [];
            var DegiskenFon: FonModel[] = [];
            var BorclanmaAraclariFonu: FonModel[] = [];
            var HisseSenediFonu: FonModel[] = [];
            var ParaPiyasasiFonu: FonModel[] = [];
            var AltinFonu: FonModel[] = [];
            var FonSepetiFonu: FonModel[] = [];
            var KatilimFonu: FonModel[] = [];
            var KorumaAmacliFon: FonModel[] = [];
            var AltinVeDigerKiymetliMadenlerFonu: FonModel[] = [];
            var HisseSenediYogunFon: FonModel[] = [];
            var BosFon: FonModel[] = [];
            var KiraSertifikasıFonu: FonModel[] = [];
            var KarmaFon: FonModel[] = [];
            var GumusFonu: FonModel[] = [];
            fundValues.forEach((item: FonModel) => {
                if ((!funds.some(x => x == item.FonKodu) || funds.length == 0) && item.FonTuru != FonTurleri.KorumaAmacliFon && item.FonTuru != FonTurleri.GumusFonu) {
                    funds.push(item.FonKodu);
                    
                    var currDate = new Date();
                    var currDateString = this.getFormattedDateForListing(currDate);
                    var currFundValue = fundValues.find((x: FonModel) => x.Tarih.toString() == currDateString && x.FonKodu == item.FonKodu);
                    var currIterator = 0;
                    while (currFundValue == undefined && currIterator < GunSayisi.onBesGun) {
                        currDate.setDate(currDate.getDay() + 1);
                        currDateString = this.getFormattedDateForListing(currDate);
                        currFundValue = fundValues.find((x: FonModel) => x.Tarih.toString() == currDateString && x.FonKodu == item.FonKodu);
                        currIterator++;
                    }

                    var preDate = new Date();
                    preDate.setDate(currDate.getDate() - 1);
                    var preDateString = this.getFormattedDateForListing(preDate);
                    var preFundValue = fundValues.find((x: FonModel) => x.Tarih.toString() == preDateString && x.FonKodu == item.FonKodu);
                    var preIterator = 0;
                    while (preFundValue == undefined && preIterator < GunSayisi.onBesGun) {
                        preDate.setDate(preDate.getDate() - 1);
                        preDateString = this.getFormattedDateForListing(preDate);
                        preFundValue = fundValues.find((x: FonModel) => x.Tarih.toString() == preDateString && x.FonKodu == item.FonKodu);
                        preIterator++;
                    }

                    if (currFundValue != undefined && preFundValue != undefined) {
                        if (currFundValue.BirimPayDegeri != undefined && preFundValue.BirimPayDegeri != undefined) {
                            if (currFundValue.BirimPayDegeri != null && preFundValue.BirimPayDegeri != null) {
                                if (currFundValue.BirimPayDegeri != 0 && preFundValue.BirimPayDegeri != null) {
                                    currFundValue.GunlukArtisYuzdesi = ((currFundValue.BirimPayDegeri - preFundValue.BirimPayDegeri) * 100) / currFundValue.BirimPayDegeri;
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
                        fundItemToday.push(currFundValue);
                        if (currFundValue.FonTuru == FonTurleri.AltinFonu) {
                            AltinFonu.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.AltinVeDigerKiymetliMadenlerFonu) {
                            AltinVeDigerKiymetliMadenlerFonu.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.BorclanmaAraclariFonu) {
                            BorclanmaAraclariFonu.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.BosFon) {
                            BosFon.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.DegiskenFon) {
                            DegiskenFon.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.ParaPiyasasiFonu) {
                            ParaPiyasasiFonu.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.GumusFonu) {
                            GumusFonu.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.HisseSenediFonu) {
                            HisseSenediFonu.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.HisseSenediYogunFon) {
                            HisseSenediYogunFon.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.KarmaFon) {
                            KarmaFon.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.KatilimFonu) {
                            KatilimFonu.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.KiraSertifikasıFonu) {
                            KiraSertifikasıFonu.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.FonSepetiFonu) {
                            FonSepetiFonu.push(currFundValue);
                        }
                        else if (currFundValue.FonTuru == FonTurleri.KorumaAmacliFon) {
                            KorumaAmacliFon.push(currFundValue);
                        }
                    }


                }
            })

            this.setState({
                fundItemToday: fundItemToday,
                listingData: fundItemToday,
                DegiskenFon: DegiskenFon,
                BorclanmaAraclariFonu: BorclanmaAraclariFonu,
                HisseSenediFonu: HisseSenediFonu,
                ParaPiyasasiFonu: ParaPiyasasiFonu,
                AltinFonu: AltinFonu,
                FonSepetiFonu: FonSepetiFonu,
                KatilimFonu: KatilimFonu,
                KorumaAmacliFon: KorumaAmacliFon,
                AltinVeDigerKiymetliMadenlerFonu: AltinVeDigerKiymetliMadenlerFonu,
                HisseSenediYogunFon: HisseSenediYogunFon,
                BosFon: BosFon,
                KiraSertifikasıFonu: KiraSertifikasıFonu,
                KarmaFon: KarmaFon,
                GumusFonu: GumusFonu,

            }, () => this.addRecords(0))
        }
    }

    searchText = (e: string) => {
        let text = e.toLowerCase()
        let trucks = this.state.fundItemToday
        let filteredName = trucks.filter((item) => {
            return item.FonKodu.toLowerCase().concat(item.FonUnvani.toLowerCase()).match(text)
        })
        if (!text || text === '') {
            this.setState({
                listingData: this.state.fundItemToday
            })
        } else if (!Array.isArray(filteredName) && filteredName == null && filteredName) {
            // set no data flag to true so as to render flatlist conditionally
            this.setState({
                noData: true
            })
        } else if (Array.isArray(filteredName)) {
            this.setState({
                noData: false,
                listingData: filteredName
            })
        }
    }


    getFormattedDateForApi(date: Date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return month + '-' + day + "-" + year;
    }

    getFormattedDateForListing(date: Date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + "-" + day + "T00:00:00";
    }

    addRecords = (page) => {
        // assuming this.state.dataPosts hold all the records
        const newRecords = []
        for (var i = page * 12, il = i + 12; i < il && i <
            this.state.fundItemToday.length; i++) {
            newRecords.push(this.state.fundItemToday[i]);
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
            <View style={{ backgroundColor: "#363E58", flex: 1 }}>
                <StatusBar backgroundColor="#363E58" />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} >
                    <View style={{ backgroundColor: "#3C435A" }}>
                        <View style={{ height: 55 }}>
                            <Input
                                autoCapitalize='none'
                                autoCorrect={false}
                                onChangeText={this.searchText}
                                placeholder='Arama'
                                placeholderTextColor='gray'
                                style={{
                                    borderColor: '#3C435A',
                                    backgroundColor: '#3C435A',
                                    color: '#CFD5E8'
                                }}
                            />
                        </View>



                        <FlatList
                            style={{ backgroundColor: "#363E58" }}
                            data={this.state.listingData.sort((a, b) => b.GunlukArtisYuzdesi - a.GunlukArtisYuzdesi)}
                            renderItem={({ item }) => (
                                <View style={{ backgroundColor: "#363E58" }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Fon Detay", { fundItem: item })}>
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
                                                            <Text style={styles.textStyle}>{"%" + item.GunlukArtisYuzdesi}</Text>)}
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
                            onEndReachedThreshold={0.01}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View >
        );
    }

}

