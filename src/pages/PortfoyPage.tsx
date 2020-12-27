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
                fetchPortfoyDataFirebase(user.uid).then(result => {
                    var portfoyler: any[] = []
                    result.forEach(element => {
                        portfoyler.push({ value: element._snapshot.key, label: element._snapshot.value.portfoyName });
                    })
                    this.setState({
                        portfoyler: portfoyler,
                        defaultDropDownPickerItem: portfoyler[portfoyler.length - 1].value,
                    })


                    fetchPortfoyFundsDataFirebase(this.state.userInfo.uid, portfoyler[portfoyler.length - 1].value).then(result => {
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

    addFund() {
        if(this.state.fonKodu != "" || this.state.fonKodu != null || this.state.fonAdet != "" || this.state.fonAdet != null || this.state.fonDegeri != "" || this.state.fonDegeri != null)
        addFunInfo(null, this.state.fonKodu, Number(this.state.fonDegeri), Number(this.state.fonAdet), this.state.userInfo.uid, this.state.defaultDropDownPickerItem, new Date(), new Date(), true);
    }

    showAddPortfoy() {

    }

    addPortfoy() {
        addPortfoy(this.state.userInfo.uid, null, this.state.portfoyName, new Date(), new Date(), true);
        this.setState({ portfoyName: null })
        fetchPortfoyDataFirebase(this.state.userInfo.uid).then(result => {
            var portfoyler: any[] = []
            result.forEach(element => {
                portfoyler.push({ value: element._snapshot.key, label: element._snapshot.value.portfoyName });
            })
            this.setState({
                portfoyler: portfoyler,
                defaultDropDownPickerItem: portfoyler[portfoyler.length - 1].value,
            })
        });
    }

    dropDownItemSelect(value: any) {
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
            this.setState({
                firebaseFonlar: firebaseFonlar,
                defaultDropDownPickerItem: value,
            })
        })
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
        debugger
        const fundResponse = await axios.get("https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/" + fonKodu + "/1/" + this.getFormattedDateForApi(baslangicDate) + "/" + this.getFormattedDateForApi(bitisDate));
        debugger
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
                <Container>
                    <Tabs tabBarPosition='bottom' tabContainerStyle={{ height: 1 }}
                        tabBarUnderlineStyle={{
                            backgroundColor: colors.backgroundColor,
                            height: 2,
                        }}>
                        <Tab heading={<TabHeading></TabHeading>}>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ backgroundColor: colors.backgroundColor }}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ flexDirection: "row", borderRadius: 5, }}>
                                        <TouchableOpacity style={{ flexDirection: "row", backgroundColor: "gray", padding: 9 }} onPress={() => this.setState({ isAddPortfoy: !this.state.isAddPortfoy })}>
                                            <Ionicons name={"add-sharp"} size={30} color={colors.White} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <DropDownPicker
                                            items={this.state.portfoyler}
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
                                {!this.state.isLoading ?
                                    <ScrollView style={{ backgroundColor: colors.backgroundColor, height: "100%" }} >
                                        {this.state.isAddPortfoy ?
                                            <View style={{ margin: 10, flexDirection: "row" }}>
                                                <View style={styles.inputPortfoy}>
                                                    <Input
                                                        inputStyle={{ color: 'black' }}
                                                        placeholder="Portföy Adı"
                                                        placeholderTextColor="gray"
                                                        value={this.state.portfoyName}
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                        onChangeText={(text) => this.setState({ portfoyName: text })}
                                                    />
                                                </View>
                                                <View style={{ alignItems: "center", justifyContent: "center", margin: 4, marginTop: 12 }}>
                                                    {this.state.portfoyName != null && this.state.portfoyName != "" ? <TouchableOpacity style={{ backgroundColor: "#566573", padding: 6 }} onPress={() => this.addPortfoy()}>
                                                        <Text style={{ color: colors.White, fontSize: 20 }}>Oluştur</Text>
                                                    </TouchableOpacity> : <TouchableOpacity style={{ backgroundColor: "#566573", padding: 6 }} onPress={() => null}>
                                                            <Text style={{ color: colors.White, fontSize: 20 }}>Oluştur</Text>
                                                        </TouchableOpacity>}
                                                </View>
                                            </View>
                                            : <View>
                                                <View style={{ alignItems: "flex-start", justifyContent: "flex-start", margin: 4, marginTop: 12 }}>
                                                    <TouchableOpacity style={{ backgroundColor: "#566573", padding: 6 }} onPress={() => this.setState({ isAddFund: !this.state.isAddFund, isSelectedFund: false, selectedFund: null, listingData: [] })}>
                                                        <Text style={{ color: colors.White, fontSize: 20 }}>Fon Ekle</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                {this.state.isAddFund ?
                                                    <View>
                                                        {this.state.isSelectedFund ?
                                                            <View>
                                                                <View style={styles.inputPortfoy}>
                                                                    <Input
                                                                        inputStyle={{ color: 'black' }}
                                                                        placeholder="Kodu"
                                                                        placeholderTextColor="gray"
                                                                        value={this.state.fonKodu}
                                                                        autoCapitalize="none"
                                                                        autoCorrect={false}
                                                                        onChangeText={(text) => this.setState({ fonKodu: text })}
                                                                    />
                                                                </View>
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

                                                                <View style={{ margin: 5, flexDirection: "row" }}>
                                                                    <Text style={{ color: colors.White, fontSize: 20, flex: 1 }}>
                                                                        {Number(this.state.fonDegeri) * Number(this.state.fonAdet) + " TL"}
                                                                    </Text>
                                                                    <View style={{ flex: 1, justifyContent: "center" }}>
                                                                        <TouchableOpacity onPress={() => this.addFund()} style={{ backgroundColor: colors.Eurobond, flex: 1, alignItems: "center", padding: 5 }}>
                                                                            <Text style={{ color: colors.White, fontSize: 20 }}> Ekle</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>


                                                            </View>
                                                            :
                                                            <View>
                                                                <View style={{ height: 55 }}>
                                                                    <Input
                                                                        autoCapitalize='none'
                                                                        autoCorrect={false}
                                                                        onChangeText={this.searchText}
                                                                        placeholder='Fon Ara'
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

                                                    </View> :
                                                    <View>
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
                                                    </View>}
                                            </View>}



                                    </ScrollView> : null}
                            </KeyboardAvoidingView>
                        </Tab>
                        <Tab heading={<TabHeading></TabHeading>}>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                {!this.state.isLoading ?
                                    <ScrollView style={{ backgroundColor: colors.backgroundColor }}>
                                        <FlatList
                                            style={{ backgroundColor: "#363E58" }}
                                            contentContainerStyle={{ paddingBottom: 195 }}
                                            data={this.state.portfoyler}
                                            renderItem={({ item }) => (
                                                <View style={{ backgroundColor: "#363E58" }}>
                                                    <TouchableOpacity >
                                                        <View style={styles.container}>
                                                            <View>
                                                                <Text style={{ color: "white" }}>{item.key + " " + item.value}</Text>
                                                            </View>

                                                        </View>

                                                    </TouchableOpacity>
                                                </View>)}
                                            keyExtractor={(item, index) => String(index)}
                                        />
                                    </ScrollView> : null}
                            </KeyboardAvoidingView>
                        </Tab>


                    </Tabs>
                </Container>
            </View >
        );
    }

}

