import { StyleSheet } from "react-native";
import { colors } from "./constants/colors";
import {scale, verticalScale, moderateScale} from "react-native-size-matters"




const styles = StyleSheet.create({
    container: {
        elevation: scale(5),
        borderRadius: scale(3),
        borderColor:"white",
        backgroundColor: "#1C212F",
        flexDirection:"row",
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: scale(1),
        paddingBottom: scale(1),
        paddingLeft: scale(8),
        paddingRight: scale(8),
        marginLeft: scale(1),
        marginRight: scale(1),
        marginTop: scale(2),
        marginBottom: scale(2),
        height:scale(70),
        width:"100%",
    },
    row_cell1: {
        flex: 1,
        flexDirection: 'column',
        margin:scale(3)
      },
      row_cell2: {
        flex: 5,
        flexDirection: 'column',
        margin:scale(3),
      },
      row_cell3: {
        flex: 1.1,
        flexDirection: 'column',
        margin:scale(3)
      },
      textStyle: {
        textAlign:"center",
        color: "white",
        includeFontPadding: false,
        fontSize: moderateScale(12,1),
        fontWeight: "bold",
      },
      textStyleYuzdeDegisimPozitif:{
        textAlign:"center",
        color: "green",
        includeFontPadding: false,
        fontSize: moderateScale(12,1),
        fontWeight: "bold", 
      },
      textStyleYuzdeDegisimNegatif:{
        textAlign:"center",
        color: "red",
        includeFontPadding: false,
        fontSize: moderateScale(12,1),
        fontWeight: "bold", 
      },
      textStyleBirimPayDeger:{
        textAlign:"center",
        color: "white",
        includeFontPadding: false,
        fontSize: moderateScale(9,1),
        fontWeight: "bold",
      },
      input: {
        elevation: scale(2),
        backgroundColor: '#fff',
        color: 'black',
        paddingTop: scale(0),
        height: scale(50),
        marginTop: scale(10),
      },
      pickerSelectStyles: {
        fontSize: moderateScale(16,1),
        textAlign: 'center',
        borderWidth: scale(1),
        borderColor: 'gray',
        borderRadius: scale(4),
        color: 'black',
      },
      buttonContainer:{
        backgroundColor:'#AAB7B8',
        borderRadius: scale(5),
        marginHorizontal: scale(60),
        paddingVertical: scale(15),
        marginTop:scale(30),
        marginBottom:scale(10),
      },
      buttonText:{
        textAlign: "center",
        color: "#212F3D",
        fontWeight:"bold",
        fontSize: moderateScale(15,1)
      },
      headStyle: {
        justifyContent: "center",
        alignItems: "center",
      },
      logo:{
        width:scale(220),
        height:scale(220),
      },
      headText: {
        fontSize: moderateScale(30,1),
        fontWeight: "700",
        color: "white",
      },
      inputContainer: {
        justifyContent: "space-between",
        paddingHorizontal: scale(20),
        flex:4,
      },
      errorMessageText: {
        textAlign: "center",
        color: "white",
        fontWeight: "900",
        fontSize:moderateScale(15,1),
      },
      errorText: {
        marginLeft: scale(10),
        marginBottom: scale(10),
        textAlign: "justify",
        color: "#EA0808",
        fontSize: moderateScale(12,1),
      },
      inputPortfoy: {
        elevation: scale(2),
        backgroundColor: '#fff',
        color: 'black',
        paddingTop: scale(0),
        height: scale(50),
        marginTop: scale(10),
        marginRight:scale(10),
        marginLeft:scale(10),
      },
      containerPortfoy: {
        elevation: scale(5),
        borderRadius: scale(3),
        borderColor:"white",
        backgroundColor: "#1C212F",
        flexDirection:"column",
        justifyContent: 'flex-start',
        paddingTop: scale(1),
        paddingBottom: scale(1),
        paddingLeft: scale(8),
        paddingRight: scale(8),
        marginLeft: scale(1),
        marginRight: scale(1),
        marginTop: scale(2),
        marginBottom: scale(2),
        width:"100%",
    },
    containerPortfoySwipe: {
      flexDirection:"row",
      justifyContent: 'flex-start',
      paddingTop: scale(1),
      paddingBottom: scale(1),
      paddingLeft: scale(8),
      paddingRight: scale(8),
      marginLeft: scale(1),
      marginRight: scale(1),
      marginTop: scale(2),
      marginBottom: scale(2),
      height:"100%",
      width:"100%",
  },
  bottomView: {
    width: '100%',
    height: scale(45),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    bottom: scale(0),
    backgroundColor: "#AAB7B8",
  },
  loadingStyle: {
    zIndex: 1,
    position: 'absolute',
    left: scale(0),
    right: scale(0),
    top: scale(0),
    bottom: scale(0),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#F5FCFF88"
  },
  stacknavigatorStyle: {
    margin:scale(10),
    color:colors.White,
    marginTop:scale(15),
    fontSize:scale(10),
  }
});

export default styles;