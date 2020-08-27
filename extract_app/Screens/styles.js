import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
      backgroundColor: '#F5FCFF',
      height: '100%',
      justifyContent: 'flex-start'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    chatHeader: {
      backgroundColor:'lime',
      margin:5,
      padding:5,
      borderRadius:15
    },
    text: {
      fontSize: 15,
      fontWeight: 'bold',
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
     borderWidth: 1
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
  });

  export default styles
