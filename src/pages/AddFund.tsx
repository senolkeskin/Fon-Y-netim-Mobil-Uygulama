import React, { Component } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Dimensions,
    FlatList
} from "react-native";
import { NavigationScreenProp, NavigationState, } from "react-navigation";
import styles from "../styles";
import { Input } from "react-native-elements";
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { colors } from "../constants/colors";
import { addFundInfo } from "../firebaseRealtimeDatabase/firebaseRealtimeDatabase"
import { moderateScale, scale } from "react-native-size-matters";
import DatePicker from 'react-native-datepicker'

const screenWidth = Dimensions.get("window").width;

interface Props {
    navigation: NavigationScreenProp<NavigationState>;
    route: any;
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
}

interface FonGenelBilgiState {
    isLoading: boolean,
    userInfo: any;
    portfoyler: any[];
    isAddPortfoy: boolean;
    portfoyName: string;
    defaultDropDownPickerItem: any;
    firebaseFonlar: FirebaseFonModel[];
    funds: Fund[],
    listingData: Fund[],
    isAddFund: boolean,
    selectedFund: FonModel;
    isSelectedFund: boolean,
    fonKodu: string,
    fonDegeri: string,
    fonAdet: string,
    datePickerBaslangicDate: Date,
    datePickerMaxDate: Date,
}

export default class AddFund extends Component<Props, FonGenelBilgiState> {
    static navigationOptions = {
        headerShown: false,
    };


    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
            userInfo: {},
            portfoyler: [],
            isAddPortfoy: false,
            portfoyName: null,
            defaultDropDownPickerItem: null,
            firebaseFonlar: [],
            funds: [],
            listingData: [],
            isAddFund: false,
            selectedFund: null,
            isSelectedFund: false,
            fonKodu: null,
            fonDegeri: null,
            fonAdet: null,
            datePickerBaslangicDate: new Date(),
            datePickerMaxDate: new Date(),
        };
    }


    componentDidMount = async () => {
        const fundResponse = await axios.get("https://ws.spk.gov.tr/PortfolioValues/api/Funds/1");
        if (fundResponse.status == 200 && fundResponse.data != null && fundResponse.data.length > 0) {
            var funds: Fund[] = fundResponse.data;
            this.setState({
                funds: funds,
            })
        }
        try {
            const userInfo = await AsyncStorage.getItem('user');
            if (userInfo != undefined) {
                var user = JSON.parse(userInfo);
                this.setState({
                    userInfo: user,
                })
            }
        } catch (e) {
            console.log(e);
        }
    }

    addFund() {
        if (this.state.fonKodu != "" || this.state.fonKodu != null || this.state.fonAdet != "" || this.state.fonAdet != null || this.state.fonDegeri != "" || this.state.fonDegeri != null) {
            addFundInfo(null, this.state.fonKodu, Number(this.state.fonDegeri), Number(this.state.fonAdet), this.state.userInfo.uid, this.props.route.params.portfoyId, this.state.datePickerBaslangicDate, new Date(), true);
        }
        this.props.navigation.goBack();
        this.props.route.params.fonEkle();
    }

    searchText = (e: string) => {
        let text = e.toLowerCase()
        let trucks = this.state.funds
        let filteredName = trucks.filter((item) => {
            return item.Kodu.toLowerCase().concat(item.Adi.toLowerCase()).match(text)
        })
        if (!text || text === '') {
            this.setState({
                listingData: []
            })
        } else if (!Array.isArray(filteredName) && filteredName == null && filteredName) {
            // set no data flag to true so as to render flatlist conditionally
            this.setState({
                listingData: []
            })
        } else if (Array.isArray(filteredName)) {
            this.setState({
                listingData: filteredName,
            })
        }
    }

    getFundData = async (fonKodu: string) => {
        var bitisDate = new Date();
        var baslangicDate = new Date();
        baslangicDate.setDate(bitisDate.getDate() - 365);
        const fundResponse = await axios.get("https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/" + fonKodu + "/1/" + this.getFormattedDateForApi(baslangicDate) + "/" + this.getFormattedDateForApi(bitisDate));
        if (fundResponse.status == 200 && fundResponse.data != null && fundResponse.data.length > 0) {
            var fund: FonModel = fundResponse.data[fundResponse.data.length - 1];
            this.setState({
                selectedFund: fund,
                isSelectedFund: true,
                fonDegeri: String(fund.BirimPayDegeri),
                fonKodu: fund.FonKodu
            });
        }
    }

    getFormattedDateForApi(date: Date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return month + '-' + day + "-" + year;
    }


    convertToValidFormadForApi(dateString: string) {
        let dateArr = dateString.split("-")
        let day = Number(dateArr[0])
        let month = Number(dateArr[1]) - 1;
        let year = Number(dateArr[2])
        return new Date(year, month, day)
    }

    changeDate(date: string) {

        var convertToValidFormadForApi = this.convertToValidFormadForApi(date);
        this.setState({
            datePickerBaslangicDate: convertToValidFormadForApi,
        })
    }


    render() {
        return (
            <View style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
                <StatusBar backgroundColor={"#1C212F"} />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ backgroundColor: colors.backgroundColor }}>
                    {this.state.isSelectedFund ?
                        <View style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1, alignItems: "flex-end", marginLeft: scale(10) }}>
                                    <Text style={{ color: colors.White, marginTop: scale(20), fontSize: moderateScale(20, 1), }}>{"Kodu: "}</Text>
                                </View>
                                <View style={{ flex: 5 }}>
                                    <View style={styles.inputPortfoy}>
                                        <Input
                                            inputStyle={{ color: 'black' }}
                                            placeholder="Kodu"
                                            placeholderTextColor="gray"
                                            value={this.state.fonKodu}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            onChangeText={(text) => this.setState({ fonKodu: text })}
                                            disabled={true}
                                        />
                                    </View>
                                </View>
                            </View>


                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1, alignItems: "flex-end", marginLeft: scale(10) }}>
                                    <Text style={{ color: colors.White, marginTop: scale(20), fontSize: moderateScale(20, 1) }}>{"Fiyat: "}</Text>
                                </View>
                                <View style={{ flex: 5 }}>
                                    <View style={styles.inputPortfoy}>
                                        <Input
                                            inputStyle={{ color: 'black' }}
                                            placeholder="Birim Pay Değeri"
                                            placeholderTextColor="gray"
                                            value={this.state.fonDegeri}
                                            autoCapitalize="none"
                                            keyboardType="number-pad"
                                            autoCorrect={false}
                                            onChangeText={(text) => this.setState({ fonDegeri: text })}
                                        />
                                    </View>
                                </View>
                            </View>


                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1, alignItems: "flex-end", marginLeft: scale(10) }}>
                                    <Text style={{ color: colors.White, marginTop: scale(20), fontSize: moderateScale(20) }}>{"Adet: "}</Text>
                                </View>
                                <View style={{ flex: 5 }}>
                                    <View style={styles.inputPortfoy}>
                                        <Input
                                            inputStyle={{ color: 'black' }}
                                            placeholder="Adet"
                                            placeholderTextColor="gray"
                                            value={this.state.fonAdet}
                                            autoCapitalize="none"
                                            keyboardType="number-pad"
                                            autoCorrect={false}
                                            onChangeText={(text) => this.setState({ fonAdet: text })}
                                        />
                                    </View>
                                </View>
                            </View>


                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1, alignItems: "flex-end", marginLeft: scale(10) }}>
                                    <Text style={{ color: colors.White, marginTop: scale(20), fontSize: moderateScale(20) }}>{"Tarih: "}</Text>
                                </View>
                                <View style={{ flex: 5 }}>
                                    <View style={{ marginTop: scale(10), marginLeft: scale(10) }} >
                                        <View style={{ flexDirection: "row", marginTop: scale(2) }}>
                                            <DatePicker
                                                style={{ width: screenWidth / 2, backgroundColor: colors.White }}
                                                date={this.state.datePickerBaslangicDate}
                                                mode="date"
                                                placeholder="select date"
                                                format="DD-MM-YYYY"
                                                maxDate={this.state.datePickerMaxDate}
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: {
                                                        position: 'absolute',
                                                        left: scale(0),
                                                        top: scale(4),
                                                        marginLeft: scale(0),
                                                    },
                                                    dateInput: {
                                                        marginLeft: scale(36),

                                                    },
                                                    dateText: {
                                                        color: "black"
                                                    }
                                                }}
                                                onDateChange={(date: string) => { this.changeDate(date) }}
                                            />
                                        </View>

                                    </View>
                                </View>
                            </View>

                            <View style={{ margin: scale(5), flexDirection: "row" }}>
                                <View style={{ flex: 1, alignItems: "center", margin: scale(5) }}>
                                    <Text style={{ color: colors.White, fontSize: moderateScale(20, 1) }}>
                                        {Number(Number(this.state.fonDegeri) * Number(this.state.fonAdet)).toFixed(2) + " TL"}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => this.addFund()} style={{ alignItems: "center", margin: scale(5), paddingVertical: scale(10), backgroundColor: colors.greenAdd, paddingHorizontal: scale(20) }}>
                                        <Text style={{ color: colors.White, fontSize: moderateScale(15), fontWeight: "bold" }}> Ekle</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        :
                        <View>
                            <View style={styles.inputPortfoy}>
                                <Input
                                    inputStyle={{ color: 'black' }}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    onChangeText={this.searchText}
                                    placeholder='Fon Ara'
                                    placeholderTextColor='gray'
                                />
                            </View>
                            <FlatList
                                style={{ backgroundColor: colors.backgroundColor }}
                                contentContainerStyle={{ paddingBottom: scale(125) }}
                                data={this.state.listingData}
                                renderItem={({ item }) => (
                                    <View style={{ backgroundColor: colors.backgroundColor }}>
                                        <TouchableOpacity onPress={() => this.getFundData(item.Kodu)}>
                                            <View style={styles.container}>
                                                <Text style={{ color: colors.White, fontSize: moderateScale(11, 1), fontWeight: "bold" }}>
                                                    {item.Kodu + " - " + item.Adi}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>)}
                                keyExtractor={(item, index) => String(index)}
                            />
                        </View>}
                </KeyboardAvoidingView>
            </View >
        );
    }

}

