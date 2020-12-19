import { StyleSheet } from "react-native";
import { colors } from "./constants/colors";
const styles = StyleSheet.create({
    container: {
        elevation: 5,
        borderRadius: 3,
        borderColor:"white",
        backgroundColor: "#1C212F",
        flex: 1,
        flexDirection:"row",
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 8,
        paddingRight: 8,
        marginLeft: 1,
        marginRight: 1,
        marginTop: 2,
        marginBottom: 2,
        height:70,
        width:"100%",
    },
    row_cell1: {
        flex: 1,
        flexDirection: 'column',
        margin:3
      },
      row_cell2: {
        flex: 5,
        flexDirection: 'column',
        margin:3
      },
      row_cell3: {
        flex: 1.1,
        flexDirection: 'column',
        margin:3
      },
      textStyle: {
        textAlign:"left",
        color: "white",
        includeFontPadding: false,
        fontSize: 13,
        fontWeight: "bold",
      },
      textStyleYuzdeDegisimPozitif:{
        textAlign:"left",
        color: "green",
        includeFontPadding: false,
        fontSize: 13,
        fontWeight: "bold", 
      },
      textStyleYuzdeDegisimNegatif:{
        textAlign:"left",
        color: "red",
        includeFontPadding: false,
        fontSize: 13,
        fontWeight: "bold", 
      },
      textStyleBirimPayDeger:{
        textAlign:"left",
        color: "white",
        includeFontPadding: false,
        fontSize: 11,
        fontWeight: "bold",
      },
      input: {
        elevation: 2,
        backgroundColor: '#fff',
        color: 'black',
        paddingTop: 0,
        height: 50,
        marginTop: 10,
      },
      pickerSelectStyles: {
        fontSize: 16,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
    
      },
});

export default styles;