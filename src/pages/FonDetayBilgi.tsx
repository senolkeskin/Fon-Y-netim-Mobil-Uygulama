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
import styles from "../styles";
import { Input } from "react-native-elements";
// import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { FonTurleri } from "../constants/enums"
import { TouchableOpacity } from "react-native-gesture-handler";
import { VictoryAxis, VictoryBrushContainer, VictoryChart, VictoryLabel, VictoryLine, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, VictoryZoomContainer } from "victory-native";
import { LineChart } from "react-native-chart-kit"



const screenWidth = Dimensions.get("window").width;

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
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

interface FonGenelBilgiState {
    fundItems?: FonModel[];
    labelsView?: string[];
    dataView?: number[];
    data: any;
    isVisibleLineChart: boolean;
    dataVictory: any[];
    FonAdi: string;
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
            data: {},
            isVisibleLineChart: false,
            dataVictory: [],
            FonAdi: null,
        };
    }

    componentDidMount = async () => {
        var dateNow = new Date();
        var oneYearAgoDate = new Date();
        oneYearAgoDate.setDate(dateNow.getDate() - 365);
        var fund: FonModel = this.props.route.params.fundItem;
        const fundResponse = await axios.get("https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/" + fund.FonKodu + "/01/" + this.getFormattedDateForApi(oneYearAgoDate) + "/" + this.getFormattedDateForApi(dateNow));
        if (fundResponse.status == 200 && fundResponse.data != null && fundResponse.data.length > 0) {
            var funds: FonModel[] = fundResponse.data;
            var labelsView: string[] = [];
            var dataView: number[] = [];
            var data: any = {};
            var dataVictory: any[] = [];
            this.setState({
                FonAdi: funds[0].FonUnvani,
            })
            funds.forEach((item: FonModel) => {
                var date = new Date(item.Tarih.toString());
                item.Tarih = date;
                labelsView.push(this.getFormattedDateForView(item.Tarih));
                dataView.push(item.BirimPayDegeri);
                dataVictory.push({ x: this.getFormattedDateForView(item.Tarih), y: item.BirimPayDegeri });
            })

            data = {
                labels: labelsView,
                datasets: [
                    {
                        data: dataView,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // optional
                        strokeWidth: 2 // optional
                    }
                ],
                legend: ["Anewliz"] // optional
            };


            this.setState({
                fundItems: funds,
                labelsView: labelsView,
                dataView: dataView,
                data: data,
                dataVictory: dataVictory,
            }, () => this.setState({ isVisibleLineChart: true }))

        }

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

    lineChart() {
        return (
            <View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold" }}>
                        {this.state.FonAdi}
                    </Text>
                </View>

                <VictoryChart height={200} width={screenWidth}
                    domainPadding={{ y: 10, }}
                    containerComponent={
                        <VictoryVoronoiContainer
                            voronoiDimension="x"
                            labels={({ datum }) => datum.y + "\n" + datum.x}
                            labelComponent={
                                <VictoryTooltip
                                    cornerRadius={0}
                                    flyoutStyle={{ fill: "black" }}
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
                    />
                    <VictoryAxis tickCount={5} style={{
                        axis: { stroke: '#000' },
                        axisLabel: { fontSize: 16 },
                        ticks: { stroke: '#000' },
                        tickLabels: { fontSize: 10, padding: 1, angle: 10, verticalAnchor: 'middle', textAnchor: 'start' }
                    }} />
                    <VictoryLine
                        data={this.state.dataVictory}
                        style={{
                            data: {
                                stroke: "white",
                                strokeWidth: ({ active }) => active ? 2 : 1,

                            },
                            labels: { fill: "white" }
                        }}

                    />

                    {/* <VictoryLine
                        data={[
                            { x: 1, y: -3, l: "red" },
                            { x: 2, y: 5, l: "green" },
                            { x: 3, y: 3, l: "blue" }
                        ]}
                        style={{
                            data: {
                                stroke: "blue",
                                strokeWidth: ({ active }) => active ? 4 : 2
                            },
                            labels: { fill: "blue" }
                        }}
                    />

                    <VictoryLine
                        data={[
                            { x: 1, y: 5, l: "cat" },
                            { x: 2, y: -4, l: "dog" },
                            { x: 3, y: -2, l: "bird" }
                        ]}
                        style={{
                            data: {
                                stroke: "black",
                                strokeWidth: ({ active }) => active ? 4 : 2
                            },
                            labels: { fill: "black" }
                        }}
                    /> */}
                </VictoryChart>



            </View>
        )
    }

    render() {


        return (
            <View style={{ backgroundColor: "#363E58", flex: 1 }}>
                <StatusBar backgroundColor="#363E58" />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={{ backgroundColor: "#3C435A" }}>
                        {this.state.isVisibleLineChart ? this.lineChart() : null}
                    </View>
                </KeyboardAvoidingView>
            </View >
        );
    }

}

