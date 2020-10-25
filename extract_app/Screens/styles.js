import { StyleSheet, Dimensions } from 'react-native';

let ScreenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    container: {
      // backgroundColor: '#F5FCFF',
      // height: '100%',
      // justifyContent: 'flex-start',
      flex: 1,
      backgroundColor: '#F3F4F8',
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      ...Platform.select({
        android: {
          marginTop: 10,
        }
      })
    },
    headerText: {
      fontFamily: 'Montserrat-Bold',
      color: "#298978",
      fontSize: 16,
    },
    header2: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    chatHeader: {
      backgroundColor:'#298978',
      margin:5,
      padding:5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius:15
    },
    text: {
      fontSize: 15,
      fontWeight: 'bold',
      color: 'white'
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop:15
    },
    item: {
      flexDirection:'row',
      justifyContent:'space-between',
      padding: 10,
      alignItems: 'center'
    },
    list: {

    },
    nav: {
     //flex: 1,
     //marginBottom: 36,
     //justifyContent: 'space-between',
     position: 'absolute',
     bottom: 0,
   },
   input: {
     margin: 15,
     borderColor: 'black',
     borderWidth: 2,
     height: 29,
   },
   checkBox: {
    flexDirection: 'row',
    alignItems: 'center'
   },
   chatSect: {
     fontSize: 20,
     fontWeight: 'bold',
   },
   chatText: {
     fontSize: 20,
   },
   button: {
   	height: 60,
   	width: ScreenWidth*.8,
   	backgroundColor: '#298978',
     alignSelf: 'center',
     alignItems: 'center',
     justifyContent: 'center',
   	borderRadius: 10,
   	elevation: 7, // for android
     shadowOpacity: 0.4,
     shadowRadius: 5,
     shadowColor: '#8a8a8a',
     shadowOffset: { height: 4, width: 0 },
     position: "absolute",
     bottom: 30,
   },
   buttonText: {
   	fontFamily: 'Montserrat-Bold',
     fontSize: 20,
   	color: "white",
   },
   body: {
     fontFamily: 'Montserrat-Medium',
     fontSize: 14,
     width: ScreenWidth*.8,
     lineHeight: 23,
   },
   title: {
     fontFamily: 'Montserrat-Bold',
     fontSize: 18,
     width: ScreenWidth*.8,
     marginTop: "5%",
     marginBottom: "5%",
   },
   divider: {
     height: 2,
     width: "60%",
     backgroundColor: "#D2D2D2",
     marginTop: "6%",
     marginBottom: "6%",
   },
   fullScreenImage: {
     width: "100%",
     height: 350,
     resizeMode: 'contain',
   },
   fsImageContainer: {
     width: "70%",
     height: "auto",
     paddingTop: 20
   },
   contentContainer: {
   	width: "94%",
   	height: "90%",
   	alignItems: 'center',
   	backgroundColor: '#FFF',
   	borderRadius: 30,
   },
  });

  export default styles
