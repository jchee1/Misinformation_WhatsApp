/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useState, useEffect, useCallback} from 'react';
 import {StyleSheet, Text, View, Image, Platform, FlatList, Button, Alert } from 'react-native';
 import ShareMenu from 'react-native-share-menu';
 import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
 import { MainBundlePath, DocumentDirectoryPath, TemporaryDirectoryPath, readFile, readDir, stat, copyFile, unlink } from 'react-native-fs'
 import {readData} from "./parser.js";

 type SharedItem = {
   mimeType: string,
   data: string,
 };

 const App: () => React$Node = () => {
   const [sharedData, setSharedData] = useState('');
   const [sharedMimeType, setSharedMimeType] = useState('');
   const [sharedExtraData, setSharedExtraData] = useState(null);


   const handleShare = useCallback((item: ?SharedItem) => {
     if (!item) {
       return;
     }

     const {mimeType, data, extraData} = item;

     setSharedData(data);
     setSharedExtraData(extraData);
     setSharedMimeType(mimeType);
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

   const [fileData, setFileData] = useState([]);
   const [editData, setEditData] = useState([]);
   if (sharedMimeType.startsWith('application/zip')){
     const sourcePath = sharedData;
     console.log(sourcePath);
     //var n = Math.floor(Math.random() * 20);
     //const tempPath = `${TemporaryDirectoryPath}/tester${n}.zip`;

     var tempPath;
     if (Platform.OS === "android") {
       tempPath = `${TemporaryDirectoryPath}/tester1.zip`;
       copyFile(sourcePath, tempPath)
       .catch((error) => {
       console.error(error)
       });
     }
     else if (Platform.OS === "ios") {
       tempPath = sourcePath;
     }

     console.log("tempPath:", tempPath);
     const targetPath = DocumentDirectoryPath
     const charset = 'UTF-8'
     unzip(tempPath, targetPath, charset)
      .then((path) => {
        console.log(`unzip completed at ${path}`)

        unlink(tempPath);

        readDir(DocumentDirectoryPath)
        .then((result) => {
          console.log('test readdir', result);
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
          setFileData(readData(contents));
          console.log(fileData)
        })
      })
      .catch((error) => {
        console.error("ERROR!", error)
      })
   }
   const [urls, setUrls] = useState([{msg: "https"}, {msg: "url2"}, {msg: "url3"}, {msg: "url4"}, {msg: "url5"}, {msg: "url6"}, {msg: "url7"}, {msg: "url8"}, {msg: "url9"}, {msg: "url10"}, {msg: "url1"}, {msg: "url2"}, {msg: "url3"}, {msg: "url4"}, {msg: "url5"}, {msg: "url6"}, {msg: "url7"}, {msg: "url8"}, {msg: "url9"}, {msg: "url10"}]);

   function deleter (vals){
     let temp=urls;
     for(let i=0; i<vals.length; i++){
       temp=temp.filter(function (j){
         return j.msg!=vals[i];
         });
     }
     setUrls(temp);
     console.log(vals);
     console.log(urls);
   }

   return (
     <View style={styles.container}>
      <Text style={styles.header}>React Native Share Menu</Text>
      <Button title="Delete selected" onPress={() => deleter(editData)}/>
      <Text> {JSON.stringify(editData)} </Text>
      <Text>
         File data:
      </Text>
      <View>
      <FlatList data={urls}
      renderItem={({item}) =>
      <View style={styles.item}>
      <Button title={item.msg} onPress={() => setEditData(editData.concat(item.msg))}/>
      </View>}
      />
      </View>
    </View>
   );
 };

 const styles = StyleSheet.create({
   container: {
     flexGrow: 1,
     paddingTop: 50,
     backgroundColor: '#F5FCFF',
   },
   header: {
     height: 60,
     backgroundColor: 'orange',
     alignItems: 'center',
     justifyContent: 'center',
   },
   text: {
     marginVertical: 30,
     fontSize: 20,
     fontWeight: 'bold',
     marginLeft: 10
   },
   item: {
     flexDirection: 'row',
     alignItems: 'center',
   }
 });

 export default App;
