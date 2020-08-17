/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useState, useEffect, useCallback} from 'react';
 import {StyleSheet, Text, View, Image, Platform, FlatList, Button, Alert, TouchableOpacity, AsyncStorage } from 'react-native';
 import ShareMenu from 'react-native-share-menu';
 import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
 import { MainBundlePath, DocumentDirectoryPath, TemporaryDirectoryPath, readFile, readDir, exists, stat, copyFile, unlink } from 'react-native-fs'
 import {returner} from "./parser.js";
 import 'react-native-gesture-handler';
 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
 import 'react-native-gesture-handler';


 function DetailsScreen() {
  const [filedat, setFile] = useState({});

  AsyncStorage.getItem("filedata")
  .then((file) => {
    console.log("async", file);
    setFile(file);
  })
  .catch((error) => {
    console.error("get async", error)
  });
  console.log("value:", filedat);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{JSON.stringify(filedat)}</Text>
    </View>
  );
}


 type SharedItem = {
   mimeType: string,
   data: string,
 };

 function Screen1({ navigation }) {
   const [sharedData, setSharedData] = useState('');
   const [sharedMimeType, setSharedMimeType] = useState('');
   const [sharedExtraData, setSharedExtraData] = useState(null);
   const [fileData, setFileData] = useState({});
   const [editData, setEditData] = useState([]);
   const [urls, setUrls] = useState([]);

   const handleShare = useCallback((item: ?SharedItem) => {
     if (!item) {
       return;
     }

     const {mimeType, data, extraData} = item;

     setSharedData(data);
     setSharedExtraData(extraData);
     setSharedMimeType(mimeType);
     setFileData({});
     setEditData([]);

     if (mimeType.startsWith('application/zip')){
       const sourcePath = data;
       //var n = Math.floor(Math.random() * 20);
       //const tempPath = `${TemporaryDirectoryPath}/tester${n}.zip`;
       console.log(sourcePath);
       var tempPath;
       if (Platform.OS === "android") {
         tempPath = `${DocumentDirectoryPath}/tester1.zip`;
         copyFile(sourcePath, tempPath)
         .then(() => {
           const targetPath = DocumentDirectoryPath
           const charset = 'UTF-8'
           unzip(tempPath, targetPath, charset)
            .then((path) => {

              unlink(tempPath);

              readDir(DocumentDirectoryPath)
              .then((result) => {
                var i = 0;
                while(result[i]["name"]!="_chat.txt"){
                  i = i+1;
                }
                console.log("result:" , result[i]["path"]);
                return readFile(result[i]["path"]);
              })
              .then((contents) => {
                // log the file contents
                //console.log(JSON.stringify(contents));
                //console.log(contents);
                //console.log(contents);
                setFileData(returner(0, contents));
                //console.log(fileData);
                setUrls(returner(1, contents));
              })
            })
            .catch((error) => {
              console.error("ERROR!", error)
            })
           })
         .catch((error) => {
         console.error(error)
         });

       }
       else if (Platform.OS === "ios") {
         tempPath = sourcePath;
         const targetPath = DocumentDirectoryPath
         const charset = 'UTF-8'
         unzip(tempPath, targetPath, charset)
          .then((path) => {

            unlink(tempPath);

            readDir(DocumentDirectoryPath)
            .then((result) => {
              var i = 0;
              while(result[i]["name"]!="_chat.txt"){
                i = i+1;
              }
              console.log("result:" , result[i]["path"]);
              return readFile(result[i]["path"]);
            })
            .then((contents) => {
              // log the file contents
              //console.log(JSON.stringify(contents));
              //console.log(contents);
              //console.log(contents);
              setFileData(returner(0, contents));
              let item = returner(0, contents);
              console.log("item:", item);
              AsyncStorage.setItem("filedata", JSON.stringify(item))
              .then((save)=>{
                console.log("async saved:", save)
                })
                .catch((error)=>{
                  console.error("set async", error)
                })
              setUrls(returner(1, contents));
            })
          })
          .catch((error) => {
            console.error("ERROR!", error)
          })
       }
     }
   }, []);

   useEffect(() => {
     ShareMenu.getInitialShare(handleShare);
   }, []);

   useEffect(() => {
     const listener = ShareMenu.addNewShareListener(handleShare);

     return () => {
       listener.remove();
     };
   }, []);



   function deleter (vals){
     let temp=urls;
     for(let i=0; i<vals.length; i++){
       temp=temp.filter(function (j){
         return j!=vals[i];
         });
     }
     setUrls(temp);
   }

   function itemPress (data){
     if(editData.includes(data)){
       let temp=editData;
       temp=temp.filter(function (i){
         return i!=data;
         });
       setEditData(temp);
     }
     else{
       setEditData(editData.concat(data))
     }
   }

   return (
     <View style={styles.container}>
      <Text style={styles.header}>WhatsApp Extractor</Text>
      <Button title="Delete selected" onPress={() => deleter(editData)}/>
      <Text style={styles.title}>
         URLs Extracted:
      </Text>
      <View>
      <FlatList data={urls}
      renderItem={({item}) =>
      <View style={styles.item}>
      <TouchableOpacity style={{backgroundColor: editData.includes(item) ? "grey" : "blue", padding: 10, margin: 5}}
      onPress={() => itemPress(item)}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
      </View>}
      />
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 36}}>
        <Button style={styles.nav}
          title="Transition"
          onPress={() => navigation.navigate('Details')}
        />
      </View>
    </View>
   );
 };

 const styles = StyleSheet.create({
   container: {
     paddingTop: 50,
     backgroundColor: '#F5FCFF',
     height: '100%',
     
   },
   header: {
     height: 60,
     backgroundColor: 'orange',
     alignItems: 'center',
     justifyContent: 'center',
   },
   text: {
     fontSize: 15,
     fontWeight: 'bold',
     color:"white"
   },
   title: {
     fontSize: 20,
     fontWeight: 'bold',
   },
   item: {
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
   },
   nav: {
    //flex: 1,
    //marginBottom: 36,
    //justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
  }
 });

 const Stack = createStackNavigator();

 function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

 export default App;