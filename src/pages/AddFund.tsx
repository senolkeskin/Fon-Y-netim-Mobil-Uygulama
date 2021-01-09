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
import { Formik } from "formik";
import * as Yup from "yup";
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
}

export default class Deneme extends Component<Props, FonGenelBilgiState> {
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
            addFunInfo(null, this.state.fonKodu, Number(this.state.fonDegeri), Number(this.state.fonAdet), this.state.userInfo.uid, this.props.route.params.portfoyId, new Date(), new Date(), true);
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

    render() {
        return (
            <View style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
                <StatusBar backgroundColor="#363E58" />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ backgroundColor: colors.backgroundColor }}>
                    {this.state.isSelectedFund ?
                        <View style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1, alignItems: "flex-end", marginLeft: 10 }}>
                                    <Text style={{ color: colors.White, marginTop: 20, fontSize: 20, }}>{"Kodu: "}</Text>
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
                                <View style={{ flex: 1, alignItems: "flex-end", marginLeft: 10 }}>
                                    <Text style={{ color: colors.White, marginTop: 20, fontSize: 20 }}>{"Fiyat: "}</Text>
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
                                <View style={{ flex: 1, alignItems: "flex-end", marginLeft: 10 }}>
                                    <Text style={{ color: colors.White, marginTop: 20, fontSize: 20 }}>{"Adet: "}</Text>
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

                            <View style={{ margin: 5, flexDirection: "row" }}>
                                <View style={{ flex: 1, alignItems: "center", margin: 5 }}>
                                    <Text style={{ color: colors.White, fontSize: 20 }}>
                                        {Number(Number(this.state.fonDegeri) * Number(this.state.fonAdet)).toFixed(2) + " TL"}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => this.addFund()} style={{ alignItems: "center", margin: 5, paddingVertical: 10, backgroundColor: colors.greenAdd, paddingHorizontal: 20 }}>
                                        <Text style={{ color: colors.White, fontSize: 15, fontWeight: "bold" }}> Ekle</Text>
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
                                style={{ backgroundColor: "#363E58" }}
                                contentContainerStyle={{ paddingBottom: 65 }}
                                data={this.state.listingData}
                                renderItem={({ item }) => (
                                    <View style={{ backgroundColor: "#363E58" }}>
                                        <TouchableOpacity onPress={() => this.getFundData(item.Kodu)}>
                                            <View style={styles.container}>
                                                <Text style={{ color: colors.White, fontSize: 12, fontWeight: "bold" }}>
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

