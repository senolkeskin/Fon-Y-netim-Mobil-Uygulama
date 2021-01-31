import React, { Component } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { NavigationScreenProp, NavigationState, } from "react-navigation";
import styles from "../styles";
import { Input } from "react-native-elements";
import axios from "axios";
import { FonIcerikleri, FonTurleri, GunSayisi } from "../constants/enums"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-community/async-storage"
import { colors } from "../constants/colors";
import { moderateScale, scale } from "react-native-size-matters";
import admob, { BannerAd, BannerAdSize, InterstitialAd, TestIds, MaxAdContentRating, AdEventType } from '@react-native-firebase/admob';
import firebaseJson from "../../firebase.json"

interface Props {
    navigation: NavigationScreenProp<NavigationState>;
}



interface FonModel {
    BirimPayDegeri: number;
    DolasimdakiPaySayisi: number;
    FonKodu: string;
    FonTipi: string;
    FonTuru: string;
    FonUnvani: string;
    Tarih: Date
    ToplamDeger: number;
    YatirimciSayisi: number;
    GunlukArtisYuzdesi?: number;


    //fon içeriği
    DevletTahvili: number;
    BankaBonosu: number;
    Diger: number;
    DovizOdemeliBono: number;
    DovizOdemeliTahvil: number;
    Eurobond: number;
    FinansmanBonosu: number;
    FonKatilmaBelgesi: number;
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
    TersRepo: number;
    TurevAraci: number;
    VadeliMevduat: number;
    VarligaDayaliMenkulKiymet: number;
    YabanciBorclanmaAraci: number;
    YabanciHisseSenedi: number;
    YabanciMenkulKiymet: number;


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
    country?: any;
    isLoading?: boolean;
    dropDownPickerItems: any;
    dropDownPickerItemsForContains: any;
}

export default class FonGenelBilgi extends Component<Props, FonGenelBilgiState> {
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
            isLoading: false,
            dropDownPickerItems: [],
            dropDownPickerItemsForContains: [],
        };
    }

    componentDidMount = async () => {
        var dateNow = new Date();
        var oneMonthAgoDate = new Date();
        oneMonthAgoDate.setDate(dateNow.getDate() - GunSayisi.onBesGun);
        admob()
            .setRequestConfiguration({
                // Update all future requests suitable for parental guidance
                maxAdContentRating: MaxAdContentRating.PG,

                // Indicates that you want your content treated as child-directed for purposes of COPPA.
                tagForChildDirectedTreatment: true,

                // Indicates that you want the ad request to be handled in a
                // manner suitable for users under the age of consent.
                tagForUnderAgeOfConsent: true,
            })
            .then(() => {
                // Request config successfully set!
            });
        this.fetchData(oneMonthAgoDate, dateNow).then(() => {
        });

    }

    fetchData = async (baslangicDate: Date, bitisDate: Date) => {

        //günün verileri
        const fundResponse = await axios.get("https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/01/" + this.getFormattedDateForApi(baslangicDate) + "/" + this.getFormattedDateForApi(bitisDate));
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
            var KarmaVeDegiskenFonlarToday: FonModel[] = [];
            var KarmaVeDegiskenFonlarOneMonthAgo: FonModel[] = [];
            fundValues.forEach((item: FonModel) => {
                if ((!funds.some(x => x == item.FonKodu) || funds.length == 0) && item.FonTuru != FonTurleri.KorumaAmacliFon && item.FonTuru != FonTurleri.GumusFonu) {
                    funds.push(item.FonKodu);

                    var currDate = new Date();
                    var currDateString = this.getFormattedDateForListing(currDate);
                    var currFundValue = fundValues.find((x: FonModel) => x.Tarih.toString() == currDateString && x.FonKodu == item.FonKodu);
                    var currIterator = 0;
                    while (currFundValue == undefined && currIterator < GunSayisi.onBesGun) {
                        currDate.setDate(currDate.getDate() - 1);
                        currDateString = this.getFormattedDateForListing(currDate);
                        currFundValue = fundValues.find((x: FonModel) => x.Tarih.toString() == currDateString && x.FonKodu == item.FonKodu);
                        currIterator++;
                    }

                    currDate.setDate(currDate.getDate() - 1);
                    var preDateString = this.getFormattedDateForListing(currDate);
                    var preFundValue = fundValues.find((x: FonModel) => x.Tarih.toString() == preDateString && x.FonKodu == item.FonKodu);
                    var preIterator = 0;
                    while (preFundValue == undefined && preIterator < GunSayisi.onBesGun) {
                        currDate.setDate(currDate.getDate() - 1);
                        preDateString = this.getFormattedDateForListing(currDate);
                        preFundValue = fundValues.find((x: FonModel) => x.Tarih.toString() == preDateString && x.FonKodu == item.FonKodu);
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

                        //analiz için
                        if (currFundValue.FonTuru == FonTurleri.KarmaFon || currFundValue.FonTuru == FonTurleri.DegiskenFon) {
                            KarmaVeDegiskenFonlarToday.push(currFundValue);
                            KarmaVeDegiskenFonlarOneMonthAgo.push(item);
                        }
                    }
                }
            })

            var dropDownPickerItems = [
                { label: "Tüm Fonlar", value: "Tüm Fonlar" },
                { label: FonTurleri.DegiskenFon, value: FonTurleri.DegiskenFon },
                { label: FonTurleri.BorclanmaAraclariFonu, value: FonTurleri.BorclanmaAraclariFonu },
                { label: FonTurleri.HisseSenediFonu, value: FonTurleri.HisseSenediFonu },
                { label: FonTurleri.ParaPiyasasiFonu, value: FonTurleri.ParaPiyasasiFonu },
                { label: FonTurleri.AltinFonu, value: FonTurleri.AltinFonu },
                { label: FonTurleri.FonSepetiFonu, value: FonTurleri.FonSepetiFonu },
                { label: FonTurleri.AltinVeDigerKiymetliMadenlerFonu, value: FonTurleri.AltinVeDigerKiymetliMadenlerFonu },
                { label: FonTurleri.KatilimFonu, value: FonTurleri.KatilimFonu },
                { label: FonTurleri.HisseSenediYogunFon, value: FonTurleri.HisseSenediYogunFon },
                { label: FonTurleri.BosFon, value: FonTurleri.BosFon },
                { label: FonTurleri.KiraSertifikasıFonu, value: FonTurleri.KiraSertifikasıFonu },
                { label: FonTurleri.KarmaFon, value: FonTurleri.KarmaFon },
                { label: FonTurleri.GumusFonu, value: FonTurleri.GumusFonu },]

            var dropDownPickerItemsForContains = [
                { label: "Tümü", value: "Tümü" },
                { label: FonIcerikleri.DevletTahvili, value: FonIcerikleri.DevletTahvili },
                { label: FonIcerikleri.BankaBonosu, value: FonIcerikleri.BankaBonosu },
                { label: FonIcerikleri.Diger, value: FonIcerikleri.Diger },
                { label: FonIcerikleri.DovizOdemeliBono, value: FonIcerikleri.DovizOdemeliBono },
                { label: FonIcerikleri.DovizOdemeliTahvil, value: FonIcerikleri.DovizOdemeliTahvil },
                { label: FonIcerikleri.Eurobond, value: FonIcerikleri.Eurobond },
                { label: FonIcerikleri.FinansmanBonosu, value: FonIcerikleri.FinansmanBonosu },
                { label: FonIcerikleri.FonKatilmaBelgesi, value: FonIcerikleri.FonKatilmaBelgesi },
                { label: FonIcerikleri.GayrimenkulSertifikasi, value: FonIcerikleri.GayrimenkulSertifikasi },
                { label: FonIcerikleri.HazineBonosu, value: FonIcerikleri.HazineBonosu },
                { label: FonIcerikleri.HisseSenedi, value: FonIcerikleri.HisseSenedi },
                { label: FonIcerikleri.KamuDisBorclanmaAraci, value: FonIcerikleri.KamuDisBorclanmaAraci },
                { label: FonIcerikleri.KamuKiraSertifikasi, value: FonIcerikleri.KamuKiraSertifikasi },
                { label: FonIcerikleri.OzelSektorKiraSertifikasi, value: FonIcerikleri.OzelSektorKiraSertifikasi },
                { label: FonIcerikleri.KatilimHesabi, value: FonIcerikleri.KatilimHesabi },
                { label: FonIcerikleri.KiymetliMaden, value: FonIcerikleri.KiymetliMaden },
                { label: FonIcerikleri.OzelSektorTahvili, value: FonIcerikleri.OzelSektorTahvili },
                { label: FonIcerikleri.TPP, value: FonIcerikleri.TPP },
                { label: FonIcerikleri.TersRepo, value: FonIcerikleri.TersRepo },
                { label: FonIcerikleri.TurevAraci, value: FonIcerikleri.TurevAraci },
                { label: FonIcerikleri.VarligaDayaliMenkulKiymet, value: FonIcerikleri.VarligaDayaliMenkulKiymet },
                { label: FonIcerikleri.YabanciBorclanmaAraci, value: FonIcerikleri.YabanciBorclanmaAraci },
                { label: FonIcerikleri.YabanciHisseSenedi, value: FonIcerikleri.YabanciHisseSenedi },
                { label: FonIcerikleri.YabanciMenkulKiymet, value: FonIcerikleri.YabanciMenkulKiymet },]


            this.allFundTypeDistribution(KarmaVeDegiskenFonlarToday, KarmaVeDegiskenFonlarOneMonthAgo);

            this.setState({
                fundItemToday: fundItemToday.sort((a, b) => b.GunlukArtisYuzdesi - a.GunlukArtisYuzdesi),
                listingData: fundItemToday.sort((a, b) => b.GunlukArtisYuzdesi - a.GunlukArtisYuzdesi),
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
                dropDownPickerItems: dropDownPickerItems,
                dropDownPickerItemsForContains: dropDownPickerItemsForContains,
            }, () => this.setState({ isLoading: true }))
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
                listingData: this.state.fundItemToday.sort((a, b) => b.GunlukArtisYuzdesi - a.GunlukArtisYuzdesi)
            })
        } else if (!Array.isArray(filteredName) && filteredName == null && filteredName) {
            // set no data flag to true so as to render flatlist conditionally
            this.setState({
                noData: true
            })
        } else if (Array.isArray(filteredName)) {
            this.setState({
                noData: false,
                listingData: filteredName.sort((a, b) => b.GunlukArtisYuzdesi - a.GunlukArtisYuzdesi)
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
    addRecords = (page: number) => {
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
    dropDownItemSelect(value: string) {
        var listData: FonModel[] = [];
        if (value == "Tüm Fonlar") {
            listData = this.state.fundItemToday.sort((a, b) => b.GunlukArtisYuzdesi - a.GunlukArtisYuzdesi);
        }
        else {
            listData = this.state.fundItemToday.filter(x => x.FonTuru == value).sort((a, b) => b.GunlukArtisYuzdesi - a.GunlukArtisYuzdesi);
        }
        this.setState({
            listingData: listData,
        })
    }

    dropDownItemSelectForContains(value: string) {
        var listData: FonModel[] = [];
        if (value == "Tümü") {
            listData = this.state.fundItemToday.sort((a, b) => b.GunlukArtisYuzdesi - a.GunlukArtisYuzdesi);
        }
        else if (value == FonIcerikleri.DevletTahvili) {
            listData = this.state.fundItemToday.sort((a, b) => b.DevletTahvili - a.DevletTahvili);
        }
        else if (value == FonIcerikleri.BankaBonosu) {
            listData = this.state.fundItemToday.sort((a, b) => b.BankaBonosu - a.BankaBonosu);
        }
        else if (value == FonIcerikleri.Diger) {
            listData = this.state.fundItemToday.sort((a, b) => b.Diger - a.Diger);
        }
        else if (value == FonIcerikleri.DovizOdemeliBono) {
            listData = this.state.fundItemToday.sort((a, b) => b.DovizOdemeliBono - a.DovizOdemeliBono);
        }
        else if (value == FonIcerikleri.Eurobond) {
            listData = this.state.fundItemToday.sort((a, b) => b.Eurobond - a.Eurobond);
        }
        else if (value == FonIcerikleri.FinansmanBonosu) {
            listData = this.state.fundItemToday.sort((a, b) => b.FinansmanBonosu - a.FinansmanBonosu);
        }
        else if (value == FonIcerikleri.FonKatilmaBelgesi) {
            listData = this.state.fundItemToday.sort((a, b) => b.FonKatilmaBelgesi - a.FonKatilmaBelgesi);
        }
        else if (value == FonIcerikleri.GayrimenkulSertifikasi) {
            listData = this.state.fundItemToday.sort((a, b) => b.GayrimenkulSertifikasi - a.GayrimenkulSertifikasi);
        }
        else if (value == FonIcerikleri.HazineBonosu) {
            listData = this.state.fundItemToday.sort((a, b) => b.HazineBonosu - a.HazineBonosu);
        }
        else if (value == FonIcerikleri.HisseSenedi) {
            listData = this.state.fundItemToday.sort((a, b) => b.HisseSenedi - a.HisseSenedi);
        }
        else if (value == FonIcerikleri.KamuDisBorclanmaAraci) {
            listData = this.state.fundItemToday.sort((a, b) => b.KamuDisBorclanmaAraci - a.KamuDisBorclanmaAraci);
        }
        else if (value == FonIcerikleri.KamuKiraSertifikasi) {
            listData = this.state.fundItemToday.sort((a, b) => b.KamuKiraSertifikasi - a.KamuKiraSertifikasi);
        }
        else if (value == FonIcerikleri.KiymetliMaden) {
            listData = this.state.fundItemToday.sort((a, b) => b.KiymetliMaden - a.KiymetliMaden);
        }
        else if (value == FonIcerikleri.OzelSektorKiraSertifikasi) {
            listData = this.state.fundItemToday.sort((a, b) => b.OzelSektorKiraSertifikasi - a.OzelSektorKiraSertifikasi);
        }
        else if (value == FonIcerikleri.OzelSektorTahvili) {
            listData = this.state.fundItemToday.sort((a, b) => b.OzelSektorTahvili - a.OzelSektorTahvili);
        }
        else if (value == FonIcerikleri.TPP) {
            listData = this.state.fundItemToday.sort((a, b) => b.TPP - a.TPP);
        }
        else if (value == FonIcerikleri.TersRepo) {
            listData = this.state.fundItemToday.sort((a, b) => b.TersRepo - a.TersRepo);
        }
        else if (value == FonIcerikleri.TurevAraci) {
            listData = this.state.fundItemToday.sort((a, b) => b.TurevAraci - a.TurevAraci);
        }
        else if (value == FonIcerikleri.VadeliMevduat) {
            listData = this.state.fundItemToday.sort((a, b) => b.VadeliMevduat - a.VadeliMevduat);
        }
        else if (value == FonIcerikleri.VarligaDayaliMenkulKiymet) {
            listData = this.state.fundItemToday.sort((a, b) => b.VarligaDayaliMenkulKiymet - a.VarligaDayaliMenkulKiymet);
        }
        else if (value == FonIcerikleri.YabanciBorclanmaAraci) {
            listData = this.state.fundItemToday.sort((a, b) => b.YabanciBorclanmaAraci - a.YabanciBorclanmaAraci);
        }
        else if (value == FonIcerikleri.YabanciHisseSenedi) {
            listData = this.state.fundItemToday.sort((a, b) => b.YabanciHisseSenedi - a.YabanciHisseSenedi);
        }
        else if (value == FonIcerikleri.YabanciMenkulKiymet) {
            listData = this.state.fundItemToday.sort((a, b) => b.YabanciMenkulKiymet - a.YabanciMenkulKiymet);
        }
        this.setState({
            listingData: listData,
        })
    }

    allFundTypeDistribution = async (KarmaVeDegiskenFonlarToday: FonModel[], KarmaVeDegiskenFonlarOneMonthAgo: FonModel[]) => {
        var fonDetayListMonthlyStatistic: FonModel = {
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
        }
        var fonDetayDistributionToday: FonModel = {
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
        }

        //karma ve değişken fonlarda 30 gün önceki duruma göre olan değişim
        KarmaVeDegiskenFonlarToday.forEach(item => {
            var oneMonthAgoItem = KarmaVeDegiskenFonlarOneMonthAgo.find(x => x.FonKodu == item.FonKodu);
            if (oneMonthAgoItem != undefined && oneMonthAgoItem != null) {
                //aylık artış azalış
                fonDetayListMonthlyStatistic.DevletTahvili += item.DevletTahvili - oneMonthAgoItem.DevletTahvili;
                fonDetayListMonthlyStatistic.BankaBonosu += item.BankaBonosu - oneMonthAgoItem.BankaBonosu;
                fonDetayListMonthlyStatistic.Diger += item.Diger - oneMonthAgoItem.Diger;
                fonDetayListMonthlyStatistic.DovizOdemeliBono += item.DovizOdemeliBono - oneMonthAgoItem.DovizOdemeliBono;
                fonDetayListMonthlyStatistic.DovizOdemeliTahvil += item.DovizOdemeliTahvil - oneMonthAgoItem.DovizOdemeliTahvil;
                fonDetayListMonthlyStatistic.Eurobond += item.Eurobond - oneMonthAgoItem.Eurobond;
                fonDetayListMonthlyStatistic.FinansmanBonosu += item.FinansmanBonosu - oneMonthAgoItem.FinansmanBonosu;
                fonDetayListMonthlyStatistic.FonKatilmaBelgesi += item.FonKatilmaBelgesi - oneMonthAgoItem.FonKatilmaBelgesi;
                fonDetayListMonthlyStatistic.GayrimenkulSertifikasi += item.GayrimenkulSertifikasi - oneMonthAgoItem.GayrimenkulSertifikasi;
                fonDetayListMonthlyStatistic.HazineBonosu += item.HazineBonosu - oneMonthAgoItem.HazineBonosu;
                fonDetayListMonthlyStatistic.HisseSenedi += item.HisseSenedi - oneMonthAgoItem.HisseSenedi;
                fonDetayListMonthlyStatistic.KamuDisBorclanmaAraci += item.KamuDisBorclanmaAraci - oneMonthAgoItem.KamuDisBorclanmaAraci;
                fonDetayListMonthlyStatistic.KamuKiraSertifikasi += item.KamuKiraSertifikasi - oneMonthAgoItem.KamuKiraSertifikasi;
                fonDetayListMonthlyStatistic.KiymetliMaden += item.KiymetliMaden - oneMonthAgoItem.KiymetliMaden;
                fonDetayListMonthlyStatistic.OzelSektorKiraSertifikasi += item.OzelSektorKiraSertifikasi - oneMonthAgoItem.OzelSektorKiraSertifikasi;
                fonDetayListMonthlyStatistic.OzelSektorTahvili += item.OzelSektorTahvili - oneMonthAgoItem.OzelSektorTahvili;
                fonDetayListMonthlyStatistic.TPP += item.TPP - oneMonthAgoItem.TPP;
                fonDetayListMonthlyStatistic.TersRepo += item.TersRepo - oneMonthAgoItem.TersRepo;
                fonDetayListMonthlyStatistic.TurevAraci += item.TurevAraci - oneMonthAgoItem.TurevAraci;
                fonDetayListMonthlyStatistic.VadeliMevduat += item.VadeliMevduat - oneMonthAgoItem.VadeliMevduat;
                fonDetayListMonthlyStatistic.VarligaDayaliMenkulKiymet += item.VarligaDayaliMenkulKiymet - oneMonthAgoItem.VarligaDayaliMenkulKiymet;
                fonDetayListMonthlyStatistic.YabanciBorclanmaAraci += item.YabanciBorclanmaAraci - oneMonthAgoItem.YabanciBorclanmaAraci;
                fonDetayListMonthlyStatistic.YabanciHisseSenedi += item.YabanciHisseSenedi - oneMonthAgoItem.YabanciHisseSenedi;
                fonDetayListMonthlyStatistic.YabanciMenkulKiymet += item.YabanciMenkulKiymet - oneMonthAgoItem.YabanciMenkulKiymet;

                //günlük dağılımı
                fonDetayDistributionToday.DevletTahvili += item.DevletTahvili / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.BankaBonosu += item.BankaBonosu / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.Diger += item.Diger / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.DovizOdemeliBono += item.DovizOdemeliBono / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.DovizOdemeliTahvil += item.DovizOdemeliTahvil / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.Eurobond += item.Eurobond / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.FinansmanBonosu += item.FinansmanBonosu / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.FonKatilmaBelgesi += item.FonKatilmaBelgesi / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.GayrimenkulSertifikasi += item.GayrimenkulSertifikasi / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.HazineBonosu += item.HazineBonosu / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.HisseSenedi += item.HisseSenedi / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.KamuDisBorclanmaAraci += item.KamuDisBorclanmaAraci / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.KamuKiraSertifikasi += item.KamuKiraSertifikasi / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.KiymetliMaden += item.KiymetliMaden / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.OzelSektorKiraSertifikasi += item.OzelSektorKiraSertifikasi / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.OzelSektorTahvili += item.OzelSektorTahvili / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.TPP += item.TPP / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.TersRepo += item.TersRepo / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.TurevAraci += item.TurevAraci / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.VadeliMevduat += item.VadeliMevduat / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.VarligaDayaliMenkulKiymet += item.VarligaDayaliMenkulKiymet / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.YabanciBorclanmaAraci += item.YabanciBorclanmaAraci / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.YabanciHisseSenedi += item.YabanciHisseSenedi / KarmaVeDegiskenFonlarToday.length;
                fonDetayDistributionToday.YabanciMenkulKiymet += item.YabanciMenkulKiymet / KarmaVeDegiskenFonlarToday.length;
            }
        })

        try {
            const arr: FonModel[] = []
            arr.push(fonDetayListMonthlyStatistic)
            arr.push(fonDetayDistributionToday)
            const jsonValue = JSON.stringify(arr)
            await AsyncStorage.setItem("fonModelStatistics", jsonValue);
        } catch (error) {
            console.log(error);
        }
    }

    renderLoading() {
        if (!this.state.isLoading) {
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
                size={BannerAdSize.SMART_BANNER}
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
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} >
                    <View style={{ backgroundColor: colors.backgroundColor }}>
                        <View style={{ height: scale(55) }}>
                            <Input
                                autoCapitalize='none'
                                autoCorrect={false}
                                onChangeText={this.searchText}
                                placeholder='Arama'
                                placeholderTextColor='#B3B6B7'
                                style={{
                                    borderColor: colors.backgroundColor,
                                    backgroundColor: colors.backgroundColor,
                                    color: colors.White
                                }}
                            />
                        </View>

                        <View>
                            <DropDownPicker
                                items={this.state.dropDownPickerItems}
                                containerStyle={{ height: scale(40) }}
                                style={{ backgroundColor: colors.backgroundColor }}
                                itemStyle={{
                                    justifyContent: 'flex-start', backgroundColor: colors.backgroundColor
                                }}
                                dropDownStyle={{ backgroundColor: colors.backgroundColor }}
                                onChangeItem={item => this.dropDownItemSelect(item.value)}
                                placeholder={"Fon Türü Seçiniz (SPK'dan alınan fon türleri)"}
                                labelStyle={{
                                    fontSize: moderateScale(13, 1),
                                    textAlign: 'left',
                                    color: 'white'
                                }}
                                dropDownMaxHeight={scale(460)}
                            />
                        </View>

                        <View>
                            <DropDownPicker
                                items={this.state.dropDownPickerItemsForContains}
                                containerStyle={{ height: scale(40) }}
                                style={{ backgroundColor: colors.backgroundColor }}
                                itemStyle={{
                                    justifyContent: 'flex-start', backgroundColor: colors.backgroundColor
                                }}
                                dropDownStyle={{ backgroundColor: colors.backgroundColor }}
                                onChangeItem={item => this.dropDownItemSelectForContains(item.value)}
                                placeholder={"Fon İçeriği Seçiniz"}
                                labelStyle={{
                                    fontSize: moderateScale(13, 1),
                                    textAlign: 'left',
                                    color: 'white'
                                }}
                                dropDownMaxHeight={scale(460)}
                            />
                        </View>

                        {this.state.isLoading ?
                            <View>
                                < FlatList
                                    style={{ backgroundColor: colors.backgroundColor }}
                                    contentContainerStyle={{ paddingBottom: scale(195) }}
                                    data={this.state.listingData}
                                    renderItem={({ item, index }) => (
                                        <View style={{ backgroundColor: colors.backgroundColor }}>
                                            {index % 10 == 9 ? this.renderBannerAd() : null}
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
                                />
                            </View> : null}
                    </View>
                </KeyboardAvoidingView>
                {this.renderLoading()}
            </View >
        );
    }

}

