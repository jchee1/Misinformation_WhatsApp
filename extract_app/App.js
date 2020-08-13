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
 import {returner} from "./parser.js";

 type SharedItem = {
   mimeType: string,
   data: string,
 };

 const App: () => React$Node = () => {
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


   if (sharedMimeType.startsWith('application/zip')){
     const sourcePath = sharedData;
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
          console.log(contents);
          setFileData(returner(0, contents));
          console.log(fileData);
          setUrls(returner(1, contents));
        })
      })
      .catch((error) => {
        console.error("ERROR!", error)
      })
   }

   function deleter (vals){
     let temp=urls;
     for(let i=0; i<vals.length; i++){
       temp=temp.filter(function (j){
         return j!=vals[i];
         });
     }
     setUrls(temp);
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
      <Button title={item} onPress={() => setEditData(editData.concat(item))}/>
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
