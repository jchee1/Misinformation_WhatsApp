
import { StyleSheet, Dimensions } from "react-native"

let ScreenWidth = Dimensions.get('window').width;

export const s = StyleSheet.create({
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
})
