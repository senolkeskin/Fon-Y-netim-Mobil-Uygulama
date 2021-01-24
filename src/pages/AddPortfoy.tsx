import React, { Component } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Dimensions,
} from "react-native";
import { NavigationScreenProp, NavigationState, } from "react-navigation";
import styles from "../styles";
import { Input } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { colors } from "../constants/colors";
import { addPortfoy } from "../firebaseRealtimeDatabase/firebaseRealtimeDatabase"
import { scale } from "react-native-size-matters";

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

export default class AddPortfoy extends Component<Props, FonGenelBilgiState> {
    static navigationOptions = {
        headerShown: false,
    };


    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
            userInfo: {},
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

    getFormattedDateForApi(date: Date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return month + '-' + day + "-" + year;
    }

    goBack() {
        const date: Date = new Date();
        addPortfoy(this.state.userInfo.uid, null, this.state.portfoyName, date, date, true);
        this.props.navigation.goBack();
        this.props.route.params.portfoyEkle();
    }

    render() {
        return (
            <View style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
                <StatusBar backgroundColor={"#1C212F"} />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ backgroundColor: colors.backgroundColor }}>
                    <View>
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
                        <View style={{ margin: scale(10), alignItems: "flex-end" }}>
                            <TouchableOpacity style={{ padding: scale(12), paddingHorizontal: scale(40), backgroundColor: colors.White }} onPress={() => this.goBack()}>
                                <Text style={{ color: "black", fontWeight: "bold" }}>{"Ekle"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View >
        );
    }

}

