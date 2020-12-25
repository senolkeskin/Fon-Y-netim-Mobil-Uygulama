import React, { Component } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    FlatList,
    Dimensions,
    ScrollView
} from "react-native";
import { NavigationScreenProp, NavigationParams, NavigationState, NavigationLeafRoute } from "react-navigation";
// import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, VictoryPie } from "victory-native";
import Svg from "react-native-svg"
import { colors } from "../constants/colors";
import Icon from "react-native-vector-icons/Ionicons";
import DatePicker from 'react-native-datepicker'
import { TouchableOpacity } from "react-native-gesture-handler";
import { Tabs, Tab, TabHeading, Container } from 'native-base';
import styles from "../styles";
import database from '@react-native-firebase/database';




const screenWidth = Dimensions.get("window").width;


interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    route: any;
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
    ArtisMiktari?: number;
}

interface FonGenelBilgiState {
    fundItems?: FonModel[];
    labelsView?: string[];
    dataView?: number[];
    isVisibleLineChart: boolean;
    dataVictory: any[];
    dataVictoryForPieChart: any[];
    lastFundValue: FonModel;
    country?: any;
    baslangicDate: Date,
    bitisDate: Date,
    datePickerBitisDate: string,
    datePickerBaslangicDate: string,
    maxPickerBaslangicDate: string,
    minPickerBaslangicDate: string,
    inputDates: any[],
    analyzedDailyData: FonModel[],
    belirtilenAraliktakiArtisYuzdesi: number,
    belirtilenAraliktakiArtisMiktari: number,
    belirtilenAraliktakiSonFiyat: number,
    belirtilenAraliktakiBaslangicFiyat: number,
}

export default class FonDetayBilgi extends Component<Props, FonGenelBilgiState> {
    static navigationOptions = {
        headerShown: false,
    };


    constructor(props: Props) {
        super(props);
        this.state = {
            labelsView: [],
            dataView: [],
            isVisibleLineChart: false,
            dataVictory: [],
            dataVictoryForPieChart: [],
            lastFundValue: null,
            baslangicDate: null,
            bitisDate: null,
            datePickerBitisDate: null,
            datePickerBaslangicDate: null,
            maxPickerBaslangicDate: null,
            minPickerBaslangicDate: null,
            inputDates: [],
            analyzedDailyData: [],
            belirtilenAraliktakiArtisYuzdesi: null,
            belirtilenAraliktakiArtisMiktari: null,
            belirtilenAraliktakiSonFiyat: null,
            belirtilenAraliktakiBaslangicFiyat: null,
        };
    }

    componentDidMount = async () => {

        var inputDates: any[] = [];

        var bitisDate = new Date();
        var baslangicDate = new Date();
        var oneWeekAgo = new Date();
        var oneMonthAgo = new Date();
        var threeMonthAgo = new Date();
        var sixMonthAgo = new Date();
        var oneYearAgo = new Date();
        var threeYearAgo = new Date();
        baslangicDate.setDate(bitisDate.getDate() - 7);
        oneWeekAgo.setDate(bitisDate.getDate() - 7);
        oneMonthAgo.setDate(bitisDate.getDate() - 30);
        threeMonthAgo.setDate(bitisDate.getDate() - 60);
        sixMonthAgo.setDate(bitisDate.getDate() - 120);
        oneYearAgo.setDate(bitisDate.getDate() - 365);
        threeYearAgo.setDate(bitisDate.getDate() - 1095);

        inputDates.push({ date: oneWeekAgo, label: "Hafta", selected: true });
        inputDates.push({ date: oneMonthAgo, label: "1 Ay", selected: false });
        inputDates.push({ date: threeMonthAgo, label: "3 Ay", selected: false });
        inputDates.push({ date: sixMonthAgo, label: "6 Ay", selected: false });
        inputDates.push({ date: oneYearAgo, label: "1 Yıl", selected: false });
        inputDates.push({ date: threeYearAgo, label: "3 Yıl", selected: false });


        var datePickerBitisDate = this.getFormattedDateForView(bitisDate);
        var datePickerBaslangicDate = this.getFormattedDateForView(baslangicDate);
        var maxPickerBaslangicDate = this.getFormattedDateForView(bitisDate);
        var minPickerBaslangicDate = this.getFormattedDateForView(threeYearAgo);

        this.setState({
            baslangicDate: baslangicDate,
            bitisDate: bitisDate,
            datePickerBitisDate: datePickerBitisDate,
            datePickerBaslangicDate: datePickerBaslangicDate,
            maxPickerBaslangicDate: maxPickerBaslangicDate,
            minPickerBaslangicDate: minPickerBaslangicDate,
            inputDates: inputDates,
        }, () => this.fetchData(this.state.baslangicDate, this.state.bitisDate));




    }


    fetchData = async (baslangicDate: Date, bitisDate: Date) => {
        const fundResponse = await axios.get("https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/" + this.props.route.params.fundItem.FonKodu + "/01/" + this.getFormattedDateForApi(baslangicDate) + "/" + this.getFormattedDateForApi(bitisDate));
        if (fundResponse.status == 200 && fundResponse.data != null && fundResponse.data.length > 0) {
            var funds: FonModel[] = fundResponse.data;
            var labelsView: string[] = [];
            var dataView: number[] = [];
            var dataVictory: any[] = [];
            var dataVictoryForPieChart: any[] = [];
            var lastFundValue: FonModel = null;
            var currDate = new Date();
            var currDateString = this.getFormattedDateForListing(currDate);
            var currIterator = 0;
            lastFundValue = funds.find((x: FonModel) => x.Tarih.toString() == currDateString);
            while (lastFundValue == undefined && currIterator < 365) {
                currDate.setDate(currDate.getDate() - 1);
                currDateString = this.getFormattedDateForListing(currDate);
                lastFundValue = funds.find((x: FonModel) => x.Tarih.toString() == currDateString);
                currIterator++;
            }
            if (lastFundValue != null || lastFundValue != undefined) {
                dataVictoryForPieChart.push({ x: "Devlet Tahvili", y: lastFundValue.DevletTahvili, l: colors.DevletTahvili });
                dataVictoryForPieChart.push({ x: "Banka Bonosu", y: lastFundValue.BankaBonosu, l: colors.BankaBonosu });
                dataVictoryForPieChart.push({ x: "Diğer", y: lastFundValue.Diger, l: colors.Diger });
                dataVictoryForPieChart.push({ x: "Döviz Ödemeli Bono", y: lastFundValue.DovizOdemeliBono, l: colors.DovizOdemeliBono });
                dataVictoryForPieChart.push({ x: "Döviz Ödemeli Tahvil", y: lastFundValue.DovizOdemeliTahvil, l: colors.DovizOdemeliTahvil });
                dataVictoryForPieChart.push({ x: "EuroBond", y: lastFundValue.Eurobond, l: colors.Eurobond });
                dataVictoryForPieChart.push({ x: "Finansman Bonosu", y: lastFundValue.FinansmanBonosu, l: colors.FinansmanBonosu });
                dataVictoryForPieChart.push({ x: "Fon Katılma Belgesi", y: lastFundValue.FonKatilmaBelgesi, l: colors.FonKatilmaBelgesi });
                dataVictoryForPieChart.push({ x: "Gayrimenkul Sertifikası", y: lastFundValue.GayrimenkulSertifikasi, l: colors.GayrimenkulSertifikasi });
                dataVictoryForPieChart.push({ x: "Hazine Bonosu", y: lastFundValue.HazineBonosu, l: colors.HazineBonosu });
                dataVictoryForPieChart.push({ x: "Hisse Senedi", y: lastFundValue.HisseSenedi, l: colors.HisseSenedi });
                dataVictoryForPieChart.push({ x: "Kamu Dış Borçlanma Aracı", y: lastFundValue.KamuDisBorclanmaAraci, l: colors.KamuDisBorclanmaAraci });
                dataVictoryForPieChart.push({ x: "Kamu Kira Sertifikası", y: lastFundValue.KamuKiraSertifikasi, l: colors.KamuKiraSertifikasi });
                dataVictoryForPieChart.push({ x: "Katılım Hesabı", y: lastFundValue.KatilimHesabi, l: colors.KatilimHesabi });
                dataVictoryForPieChart.push({ x: "Kıymetli Maden", y: lastFundValue.KiymetliMaden, l: colors.KiymetliMaden });
                dataVictoryForPieChart.push({ x: "Özel Sektör Kira Sertifikası", y: lastFundValue.OzelSektorKiraSertifikasi, l: colors.OzelSektorKiraSertifikasi });
                dataVictoryForPieChart.push({ x: "Özel Sektör Tahvili", y: lastFundValue.OzelSektorTahvili, l: colors.OzelSektorTahvili });
                dataVictoryForPieChart.push({ x: "TPP", y: lastFundValue.TPP, l: colors.TPP });
                dataVictoryForPieChart.push({ x: "Ters Repo", y: lastFundValue.TersRepo, l: colors.TersRepo });
                dataVictoryForPieChart.push({ x: "Türev Aracı", y: lastFundValue.TurevAraci, l: colors.TurevAraci });
                dataVictoryForPieChart.push({ x: "Vadeli Mevduat", y: lastFundValue.VadeliMevduat, l: colors.VadeliMevduat });
                dataVictoryForPieChart.push({ x: "Varlığa Dayalı Menkul Kıymet", y: lastFundValue.VarligaDayaliMenkulKiymet, l: colors.VarligaDayaliMenkulKiymet });
                dataVictoryForPieChart.push({ x: "Yabancı Borçlanma Aracı", y: lastFundValue.YabanciBorclanmaAraci, l: colors.YabanciBorclanmaAraci });
                dataVictoryForPieChart.push({ x: "Yabancı Hisse Senedi", y: lastFundValue.YabanciHisseSenedi, l: colors.YabanciHisseSenedi });
                dataVictoryForPieChart.push({ x: "Yabancı Menkul Kıymet", y: lastFundValue.YabanciMenkulKiymet, l: colors.YabanciMenkulKiymet });
            }
            var pieChartValues: any[] = []

            dataVictoryForPieChart.forEach((item) => {
                if (item.y > 0 && item.y != null && item.y != undefined) {
                    pieChartValues.push(item);
                }
            })
            funds.forEach((item: FonModel) => {
                var date = new Date(item.Tarih.toString());
                item.Tarih = date;
                labelsView.push(this.getFormattedDateForView(item.Tarih));
                dataView.push(item.BirimPayDegeri);
                dataVictory.push({ x: this.getFormattedDateForView(item.Tarih), y: item.BirimPayDegeri });

            })

            //analysis
            var analyzedDailyData: FonModel[] = []
            var iterator = 0;
            funds.forEach((item: FonModel) => {
                if (iterator == 0) {
                    item.GunlukArtisYuzdesi = 0;
                    item.ArtisMiktari = 0;
                    analyzedDailyData.push(item)
                }
                else {
                    item.GunlukArtisYuzdesi = ((item.BirimPayDegeri - funds[iterator - 1].BirimPayDegeri) * 100) / item.BirimPayDegeri;
                    item.ArtisMiktari = (item.BirimPayDegeri - funds[iterator - 1].BirimPayDegeri);
                    analyzedDailyData.push(item);
                }

                iterator++;
            })

            if (funds.length > 0) {
                var belirtilenAraliktakiBaslangicFiyat: number = funds[0].BirimPayDegeri;
                var belirtilenAraliktakiSonFiyat: number = funds[funds.length - 1].BirimPayDegeri;
                var belirtilenAraliktakiArtisYuzdesi: number = ((funds[funds.length - 1].BirimPayDegeri - funds[0].BirimPayDegeri) * 100) / funds[funds.length - 1].BirimPayDegeri;
                var belirtilenAraliktakiArtisMiktari: number = (funds[funds.length - 1].BirimPayDegeri - funds[0].BirimPayDegeri);

            }
            this.setState({
                fundItems: funds,
                labelsView: labelsView,
                dataView: dataView,
                dataVictory: dataVictory,
                dataVictoryForPieChart: pieChartValues,
                lastFundValue: lastFundValue,
                analyzedDailyData: analyzedDailyData,
                belirtilenAraliktakiArtisYuzdesi: belirtilenAraliktakiArtisYuzdesi,
                belirtilenAraliktakiArtisMiktari: belirtilenAraliktakiArtisMiktari,
                belirtilenAraliktakiSonFiyat: belirtilenAraliktakiSonFiyat,
                belirtilenAraliktakiBaslangicFiyat: belirtilenAraliktakiBaslangicFiyat,
            }, () => this.setState({ isVisibleLineChart: true }))

        }
    }

    getDataBetweenDate(date: string, baslangicMi: boolean) {

        var convertToValidFormadForApi = this.convertToValidFormadForApi(date);
        if (baslangicMi) {
            this.setState({
                datePickerBaslangicDate: date,
                baslangicDate: convertToValidFormadForApi
            }, () => this.fetchData(this.state.baslangicDate, this.state.bitisDate))
        }
        else {
            this.setState({
                datePickerBitisDate: date,
                bitisDate: convertToValidFormadForApi,
            }, () => this.fetchData(this.state.baslangicDate, this.state.bitisDate))
        }
    }

    convertToValidFormadForApi(dateString: string) {
        let dateArr = dateString.split("-")
        let day = dateArr[0]
        let month = dateArr[1]
        let year = dateArr[2]
        return new Date(month + '-' + day + "-" + year)
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

    getFormattedDateForListing(date: Date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + "-" + day + "T00:00:00";
    }

    lineChart() {
        return (
            <View>
                <VictoryChart height={280} width={screenWidth}
                    containerComponent={
                        <VictoryVoronoiContainer
                            voronoiDimension="x"
                            labels={({ datum }) => datum.y + "\n" + datum.x}
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
                        height={400}
                        theme={VictoryTheme.material}
                        offsetX={50}
                        standalone={false}
                        style={{
                            axis: { stroke: colors.axisStrokeColor },
                            axisLabel: { fontSize: 16 },
                            ticks: { stroke: colors.axisStrokeColor },
                            tickLabels: { fontSize: 10, fill: colors.axisStrokeColor }
                        }}
                    />
                    <VictoryAxis tickCount={5} style={{
                        axis: { stroke: colors.axisStrokeColor },
                        axisLabel: { fontSize: 16 },
                        ticks: { stroke: colors.axisStrokeColor },
                        tickLabels: { fontSize: 10, padding: 5, angle: 340, verticalAnchor: 'middle', textAnchor: 'end', fill: colors.axisStrokeColor }
                    }} />
                    <VictoryLine
                        data={this.state.dataVictory}
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
        )
    }
    pieChart() {
        return (
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 5 }}>
                    <Svg width={screenWidth} height={230} viewBox="80 0 400 400">
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
                            data={this.state.dataVictoryForPieChart}
                        />
                    </Svg>
                </View>
                <View style={{ flex: 4 }}>
                    {this.state.dataVictoryForPieChart.map(r => <View style={{ margin: 5, flexDirection: "row" }}><View style={{ flex: 0.15 }}><Icon name="square" size={15} color={r.l} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.White, fontSize: 10 }}>{r.x + ": %" + r.y}</Text></View></View>)}
                </View>
            </View>
        )
    }

    dateChanged(dateInfo: any) {
        var inputDates = this.state.inputDates;
        var baslangicTarihi: Date = new Date();
        var bitisTarhi: Date = new Date();
        inputDates.forEach(item => {
            if (item.label == dateInfo.label) {
                baslangicTarihi = item.date;
                item.selected = true;
            }
            else {
                item.selected = false;
            }
        })

        var datePickerBitisDate = this.getFormattedDateForView(bitisTarhi);
        var datePickerBaslangicDate = this.getFormattedDateForView(baslangicTarihi);

        this.setState({
            baslangicDate: baslangicTarihi,
            bitisDate: bitisTarhi,
            inputDates: inputDates,
            datePickerBitisDate: datePickerBitisDate,
            datePickerBaslangicDate: datePickerBaslangicDate,
        }, () => this.fetchData(this.state.baslangicDate, this.state.bitisDate))
    }

    render() {
        const genelBilgi: FonModel = this.props.route.params.fundItem;

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
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                {this.state.isVisibleLineChart ?
                                    <ScrollView style={{ backgroundColor: colors.backgroundColor }}>
                                        <View style={{ alignItems: "center", justifyContent: "center", padding: 10, borderColor: "white", borderWidth: 1 }}>
                                            <View>
                                                <Text style={{ fontSize: 15, textAlign: "center", color: "white" }}>{genelBilgi.FonKodu}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 15, textAlign: "center", color: "white" }}>{genelBilgi.FonUnvani}</Text>
                                            </View>
                                            <View style={{padding:3}}>
                                                <Text style={{ fontSize: 15, textAlign: "center", color: "white" }}>{genelBilgi.FonTuru}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5,borderBottomWidth:1, borderBottomColor:"gray" }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 12, textAlign: "center", color: "white" }}>{"Yatırımcı Sayısı"}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 12, textAlign: "center", color: "white" }}>{"Fon Toplam Değeri"}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 12, textAlign: "center", color: "white" }}>{"Pay Sayısı"}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 12, textAlign: "center", color: "white" }}>{genelBilgi.YatirimciSayisi}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 12, textAlign: "center", color: "white" }}>{genelBilgi.ToplamDeger.toLocaleString()}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 12, textAlign: "center", color: "white" }}>{genelBilgi.DolasimdakiPaySayisi.toLocaleString()}</Text>
                                                </View>
                                            </View>

                                        </View>

                                        <View style={{ flexDirection: "row", marginTop: 2 }}>
                                            <DatePicker
                                                style={{ width: screenWidth / 2, backgroundColor: colors.backgroundColor }}
                                                date={this.state.datePickerBaslangicDate}
                                                mode="date"
                                                placeholder="select date"
                                                format="DD-MM-YYYY"
                                                minDate={this.state.minPickerBaslangicDate}
                                                maxDate={this.state.maxPickerBaslangicDate}
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: {
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 4,
                                                        marginLeft: 0,
                                                    },
                                                    dateInput: {
                                                        marginLeft: 36,

                                                    },
                                                    dateText: {
                                                        color: "white"
                                                    }
                                                    // ... You can check the source to find the other keys.
                                                }}
                                                onDateChange={(date) => { this.getDataBetweenDate(date, true) }}
                                            />
                                            <DatePicker
                                                style={{ width: screenWidth / 2, backgroundColor: colors.backgroundColor }}
                                                date={this.state.datePickerBitisDate}
                                                mode="date"
                                                placeholder="select date"
                                                format="DD-MM-YYYY"
                                                minDate={this.state.minPickerBaslangicDate}
                                                maxDate={this.state.maxPickerBaslangicDate}
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: {
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 4,
                                                        marginLeft: 0
                                                    },
                                                    dateInput: {
                                                        marginLeft: 36
                                                    },
                                                    dateText: {
                                                        color: "white"
                                                    }
                                                    // ... You can check the source to find the other keys.
                                                }}
                                                onDateChange={(date) => { this.getDataBetweenDate(date, false) }}
                                            />
                                        </View>

                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 5 }}>
                                            {this.state.inputDates.map(r =>
                                                <TouchableOpacity style={{ backgroundColor: r.selected ? "#D35400" : "#808B96", borderRadius: 2, elevation: 2, padding: 10, paddingLeft: 15, paddingRight: 15, shadowColor: "#E74C3C" }}
                                                    onPress={() => this.dateChanged(r)}>
                                                    <View style={{}}><Text style={{ color: colors.White }}>{r.label}</Text></View>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <View style={{ borderWidth: 1, borderColor: "gray" }}>
                                            <View style={{ padding: 2, flexDirection: "row", paddingHorizontal: 10, justifyContent: "center", alignItems: "center", }}>
                                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ flex: 1, fontSize: 13, fontWeight: "bold", color: colors.White }}>{"Başlangıç Fiyat"}</Text>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ flex: 1, fontSize: 13, fontWeight: "bold", color: colors.White }}>{"Son Fiyat"}</Text>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ flex: 1, fontSize: 13, fontWeight: "bold", color: colors.White }}>{"Getiri"}</Text>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ flex: 1, fontSize: 13, fontWeight: "bold", color: colors.White }}>{"Yüzdelik Artış"}</Text>
                                                </View>
                                            </View>
                                            <View style={{ padding: 2, flexDirection: "row", paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }}>
                                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ flex: 1, fontSize: 13, fontWeight: "bold", color: colors.White }}>{this.state.belirtilenAraliktakiBaslangicFiyat}</Text>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ flex: 1, fontSize: 13, fontWeight: "bold", color: colors.White }}>{this.state.belirtilenAraliktakiSonFiyat}</Text>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ flex: 1, fontSize: 13, fontWeight: "bold", color: colors.White }}>{this.state.belirtilenAraliktakiArtisMiktari.toFixed(6)}</Text>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                                    {this.state.belirtilenAraliktakiArtisYuzdesi > 0 ? <Text style={styles.textStyleYuzdeDegisimPozitif}>{"%" + this.state.belirtilenAraliktakiArtisYuzdesi.toFixed(2)}</Text> :
                                                        (this.state.belirtilenAraliktakiArtisYuzdesi < 0 ? <Text style={styles.textStyleYuzdeDegisimNegatif}>{"%" + this.state.belirtilenAraliktakiArtisYuzdesi.toFixed(2)}</Text> :
                                                            <Text style={styles.textStyle}>{"%" + this.state.belirtilenAraliktakiArtisYuzdesi}</Text>)}
                                                </View>
                                            </View>
                                        </View>
                                        <View>{this.lineChart()}</View>
                                        <View>{this.pieChart()}</View>
                                    </ScrollView> : null}
                            </KeyboardAvoidingView>
                        </Tab>
                        <Tab heading={<TabHeading></TabHeading>}>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                {this.state.isVisibleLineChart ?

                                    <ScrollView style={{ backgroundColor: colors.backgroundColor, height: "100%" }} >
                                        <View style={{ alignItems: "center", justifyContent: "center", padding: 10, borderColor: "white", borderWidth: 1 }}>
                                            <Text style={{ fontSize: 15, textAlign: "center", color: "white" }}>{this.state.lastFundValue.FonUnvani}</Text>
                                        </View>
                                        <View style={{ justifyContent: "center", alignItems: "center", padding: 10 }}><Text style={{ textAlign: "center", fontSize: 12, color: colors.White }}>{"Günlük Artış Yüzdeleri (Başlangıç Günü %0)"}</Text></View>
                                        <View style={{ margin: 5 }}>
                                            <View style={{ margin: 5, flexDirection: "row", borderBottomWidth: 2, borderBottomColor: colors.White }}>
                                                <Text style={{ flex: 1, fontSize: 15, fontWeight: "bold", color: colors.White }}>
                                                    {"Tarih"}
                                                </Text>
                                                <Text style={{ flex: 1.4, fontSize: 15, fontWeight: "bold", color: colors.White }}>
                                                    {"Fiyat (Artış Miktarı)"}
                                                </Text>
                                                <Text style={{ flex: 1, fontSize: 15, fontWeight: "bold", color: colors.White }}>
                                                    {"Yüzdelik Artış"}
                                                </Text>
                                            </View>
                                            {this.state.analyzedDailyData.map(data =>
                                                <View style={{ padding: 5, flexDirection: "row", borderColor: "gray", borderWidth: 1 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: colors.White }} >
                                                            {this.getFormattedDateForView(data.Tarih)}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flex: 1.4 }}>
                                                        <Text style={{ color: colors.White }} >
                                                            {data.BirimPayDegeri + "(" + data.ArtisMiktari.toFixed(6) + ")"}
                                                        </Text>
                                                    </View>

                                                    <View style={{ flex: 0.8 }}>
                                                        {data.GunlukArtisYuzdesi > 0 ? <Text style={styles.textStyleYuzdeDegisimPozitif}>{"%" + data.GunlukArtisYuzdesi.toFixed(2)}</Text> :
                                                            (data.GunlukArtisYuzdesi < 0 ? <Text style={styles.textStyleYuzdeDegisimNegatif}>{"%" + data.GunlukArtisYuzdesi.toFixed(2)}</Text> :
                                                                <Text style={styles.textStyle}>{"%" + data.GunlukArtisYuzdesi}</Text>)}
                                                    </View>
                                                </View>)}
                                        </View>
                                    </ScrollView> : null}
                            </KeyboardAvoidingView>
                        </Tab>

                    </Tabs>
                </Container>




            </View >
        );
    }

}

