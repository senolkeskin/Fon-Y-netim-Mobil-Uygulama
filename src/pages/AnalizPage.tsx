import React, { Component } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Dimensions,
    FlatList,
    ScrollView,
    ActivityIndicator,
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

interface FonGenelBilgiState {
    fonDetayListMonthlyStatistic: any[],
    fonDetayDistributionToday: any[],
    isLoading: boolean,
}

export default class Deneme extends Component<Props, FonGenelBilgiState> {
    static navigationOptions = {
        headerShown: false,
    };


    constructor(props: Props) {
        super(props);
        this.state = {
            fonDetayListMonthlyStatistic: [],
            fonDetayDistributionToday: [],
            isLoading: true,
        };
    }

    componentDidMount = async () => {
        try {
            const fonModelStatistics = await AsyncStorage.getItem('fonModelStatistics')
            if (fonModelStatistics != null) {
                var fonModels = JSON.parse(fonModelStatistics);
                var fonDetayListMonthlyStatistic: FonModel = fonModels[0];
                var fonDetayDistributionToday: FonModel = fonModels[1];
                var fonDetayListMonthlyStatisticarr: any[] = [];
                var fonDetayDistributionTodayarr: any[] = [];

                //aylık istatistik
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.DevletTahvili, x: FonIcerikleri.DevletTahvili, l: colors.DevletTahvili })

                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.BankaBonosu, x: FonIcerikleri.BankaBonosu, l: colors.BankaBonosu })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.Diger, x: FonIcerikleri.Diger, l: colors.Diger })


                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.DovizOdemeliBono, x: FonIcerikleri.DovizOdemeliBono, l: colors.DovizOdemeliBono })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.DovizOdemeliTahvil, x: FonIcerikleri.DovizOdemeliTahvil, l: colors.DovizOdemeliTahvil })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.Eurobond, x: FonIcerikleri.Eurobond, l: colors.Eurobond })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.FinansmanBonosu, x: FonIcerikleri.FinansmanBonosu, l: colors.FinansmanBonosu })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.FonKatilmaBelgesi, x: FonIcerikleri.FonKatilmaBelgesi, l: colors.FonKatilmaBelgesi })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.GayrimenkulSertifikasi, x: FonIcerikleri.GayrimenkulSertifikasi, l: colors.GayrimenkulSertifikasi })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.HazineBonosu, x: FonIcerikleri.HazineBonosu, l: colors.HazineBonosu })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.HisseSenedi, x: FonIcerikleri.HisseSenedi, l: colors.HisseSenedi })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.KamuDisBorclanmaAraci, x: FonIcerikleri.KamuDisBorclanmaAraci, l: colors.KamuDisBorclanmaAraci })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.KamuKiraSertifikasi, x: FonIcerikleri.KamuKiraSertifikasi, l: colors.KamuKiraSertifikasi })

                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.KatilimHesabi, x: FonIcerikleri.KatilimHesabi, l: colors.KatilimHesabi })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.KiymetliMaden, x: FonIcerikleri.KiymetliMaden, l: colors.KiymetliMaden })


                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.OzelSektorKiraSertifikasi, x: FonIcerikleri.OzelSektorKiraSertifikasi, l: colors.OzelSektorKiraSertifikasi })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.OzelSektorTahvili, x: FonIcerikleri.OzelSektorTahvili, l: colors.OzelSektorTahvili })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.TPP, x: FonIcerikleri.TPP, l: colors.TPP })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.TersRepo, x: FonIcerikleri.TersRepo, l: colors.TersRepo })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.TurevAraci, x: FonIcerikleri.TurevAraci, l: colors.TurevAraci })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.VadeliMevduat, x: FonIcerikleri.VadeliMevduat, l: colors.VadeliMevduat })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.VarligaDayaliMenkulKiymet, x: FonIcerikleri.VarligaDayaliMenkulKiymet, l: colors.VarligaDayaliMenkulKiymet })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.YabanciBorclanmaAraci, x: FonIcerikleri.YabanciBorclanmaAraci, l: colors.YabanciBorclanmaAraci })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.YabanciHisseSenedi, x: FonIcerikleri.YabanciHisseSenedi, l: colors.YabanciHisseSenedi })
                fonDetayListMonthlyStatisticarr.push({ y: fonDetayListMonthlyStatistic.YabanciMenkulKiymet, x: FonIcerikleri.YabanciMenkulKiymet, l: colors.YabanciMenkulKiymet })

                //günlük dağılım
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.DevletTahvili, x: FonIcerikleri.DevletTahvili, l: colors.DevletTahvili })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.BankaBonosu, x: FonIcerikleri.BankaBonosu, l: colors.BankaBonosu })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.Diger, x: FonIcerikleri.Diger, l: colors.Diger })

                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.DovizOdemeliBono, x: FonIcerikleri.DovizOdemeliBono, l: colors.DovizOdemeliBono })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.DovizOdemeliTahvil, x: FonIcerikleri.DovizOdemeliTahvil, l: colors.DovizOdemeliTahvil })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.Eurobond, x: FonIcerikleri.Eurobond, l: colors.Eurobond })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.FinansmanBonosu, x: FonIcerikleri.FinansmanBonosu, l: colors.FinansmanBonosu })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.FonKatilmaBelgesi, x: FonIcerikleri.FonKatilmaBelgesi, l: colors.FonKatilmaBelgesi })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.GayrimenkulSertifikasi, x: FonIcerikleri.GayrimenkulSertifikasi, l: colors.GayrimenkulSertifikasi })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.HazineBonosu, x: FonIcerikleri.HazineBonosu, l: colors.HazineBonosu })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.HisseSenedi, x: FonIcerikleri.HisseSenedi, l: colors.HisseSenedi })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.KamuDisBorclanmaAraci, x: FonIcerikleri.KamuDisBorclanmaAraci, l: colors.KamuDisBorclanmaAraci })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.KamuKiraSertifikasi, x: FonIcerikleri.KamuKiraSertifikasi, l: colors.KamuKiraSertifikasi })

                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.KatilimHesabi, x: FonIcerikleri.KatilimHesabi, l: colors.KatilimHesabi })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.KiymetliMaden, x: FonIcerikleri.KiymetliMaden, l: colors.KiymetliMaden })

                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.OzelSektorKiraSertifikasi, x: FonIcerikleri.OzelSektorKiraSertifikasi, l: colors.OzelSektorKiraSertifikasi })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.OzelSektorTahvili, x: FonIcerikleri.OzelSektorTahvili, l: colors.OzelSektorTahvili })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.TPP, x: FonIcerikleri.TPP, l: colors.TPP })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.TersRepo, x: FonIcerikleri.TersRepo, l: colors.TersRepo })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.TurevAraci, x: FonIcerikleri.TurevAraci, l: colors.TurevAraci })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.VadeliMevduat, x: FonIcerikleri.VadeliMevduat, l: colors.VadeliMevduat })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.VarligaDayaliMenkulKiymet, x: FonIcerikleri.VarligaDayaliMenkulKiymet, l: colors.VarligaDayaliMenkulKiymet })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.YabanciBorclanmaAraci, x: FonIcerikleri.YabanciBorclanmaAraci, l: colors.YabanciBorclanmaAraci })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.YabanciHisseSenedi, x: FonIcerikleri.YabanciHisseSenedi, l: colors.YabanciHisseSenedi })
                fonDetayDistributionTodayarr.push({ y: fonDetayDistributionToday.YabanciMenkulKiymet, x: FonIcerikleri.YabanciMenkulKiymet, l: colors.YabanciMenkulKiymet })

                this.setState({
                    fonDetayListMonthlyStatistic: fonDetayListMonthlyStatisticarr,
                    fonDetayDistributionToday: fonDetayDistributionTodayarr
                }, () => this.setState({
                    isLoading: false,
                }))
            }
        } catch (e) {
            console.log(e);
        }
    }

    degiskenVeKarmaFonBarChart() {
        return (
            <View>
                {!this.state.isLoading ?
                    <VictoryChart
                        theme={VictoryTheme.material} width={screenWidth} height={600}>
                        <VictoryBar horizontal
                            style={{
                                data: {
                                    fill: ({ datum }) => datum.l,
                                    fillOpacity: 0.6,
                                    strokeWidth: 2
                                },
                                labels: {
                                    fontSize: 10,
                                    fill: colors.White,
                                    textAlign: "center",
                                    alignItems: "center",
                                    textAnchor: ({ datum }) => Math.abs(datum.y) > 120 ? "start" : "end"
                                },

                            }}
                            data={this.state.fonDetayListMonthlyStatistic}
                            barRatio={1}
                            labels={({ datum }) => datum.x + ": %" + datum.y.toFixed(2)}
                        />
                        <VictoryAxis
                            dependentAxis={true}
                            style={{
                                ticks: { strokeWidth: 0 },
                                tickLabels: { fill: colors.White },
                                axis: { stroke: "transparent" },
                                grid: { strokeWidth: 0 }


                            }}
                            tickLabelComponent={
                                <VictoryLabel
                                    textAnchor="middle"
                                />}

                        />
                    </VictoryChart> : null}
            </View>
        )
    }

    degiskenVeKarmaFonPieChart() {
        return (
            <View style={{ flexDirection: "column" }}>
                <View style={{ flex: 5 }}>
                    <Svg width={screenWidth} height={300} viewBox="0 0 400 400">
                        <VictoryPie
                            standalone={false}
                            //labelRadius={150}
                            labels={({ datum }) => ''}
                            style={{
                                labels: { fontSize: 10, fill: "white" },
                                data: {
                                    fill: ({ datum }) => datum.l
                                }
                            }}
                            data={this.state.fonDetayDistributionToday}
                        />
                    </Svg>
                </View>
                <View style={{ flex: 4 }}>
                    {this.state.fonDetayDistributionToday.sort((a, b) => b.y - a.y).map(r => <View style={{ margin: 5, flexDirection: "row", alignItems: "center", justifyContent: "center" }}><View style={{ flex: 0.2, alignItems: "flex-end", justifyContent: "flex-end" }}><Icon name="square" size={20} color={r.l} /></View><View style={{ flex: 1, alignItems: "flex-start", justifyContent: "flex-start" }}><Text style={{ color: colors.White, fontSize: 12 }}>{r.x + ": %" + r.y.toFixed(2)}</Text></View></View>)}
                </View>
            </View>
        )
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

    render() {
        return (
            <View style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
                <StatusBar backgroundColor={"#1C212F"} />
                {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} >
                    <View style={{ backgroundColor: "#3C435A" }}>
                        {this.degiskenVeKarmaFonBarChart()}
                    </View>
                </KeyboardAvoidingView> */}
                <Container>
                    <Tabs tabBarPosition='bottom' tabContainerStyle={{ height: 1 }}
                        tabBarUnderlineStyle={{
                            backgroundColor: colors.backgroundColor,
                            height: 2,
                        }}>
                        <Tab heading={<TabHeading></TabHeading>}>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                {!this.state.isLoading ?
                                    <ScrollView style={{ backgroundColor: colors.backgroundColor, height: "100%" }} >
                                        <View style={{ alignItems: "center", justifyContent: "center", padding: 10, borderColor: "white", borderWidth: 1 }}>
                                            <Text style={{ fontSize: 15, textAlign: "center", color: "white" }}>{"Değişken ve Karma Fonların Günlük İçerik Dağılımı"}</Text>
                                        </View>
                                        {this.degiskenVeKarmaFonPieChart()}
                                    </ScrollView> : null}
                            </KeyboardAvoidingView>
                        </Tab>
                        <Tab heading={<TabHeading></TabHeading>}>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                {!this.state.isLoading ?
                                    <ScrollView style={{ backgroundColor: colors.backgroundColor }}>
                                        <View style={{ alignItems: "center", justifyContent: "center", padding: 10, borderColor: "white", borderWidth: 1 }}>
                                            <Text style={{ fontSize: 15, textAlign: "center", color: "white" }}>{"Değişken ve Karma Fonların Aylık İçerik Değişimi"}</Text>
                                        </View>
                                        {this.degiskenVeKarmaFonBarChart()}
                                    </ScrollView> : null}
                            </KeyboardAvoidingView>
                        </Tab>


                    </Tabs>
                </Container>
                {this.renderLoading()}
            </View >
        );
    }

}

