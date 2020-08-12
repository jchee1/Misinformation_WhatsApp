/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useState, useEffect, useCallback} from 'react';
 import {StyleSheet, Text, View, Image, Platform, ScrollView } from 'react-native';
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


   return (
     <ScrollView contentContainerStyle={styles.container}>
       <Text style={styles.welcome}>WhatsApp Extract</Text>
       <Text style={styles.instructions}>Shared type: {sharedMimeType}</Text>
       <Text style={styles.instructions}>
         Shared text: {sharedMimeType === 'text/plain' ? sharedData : ''}
       </Text>
       <Text style={styles.instructions}>Shared image:</Text>
       {sharedMimeType.startsWith('image/') && (
         <Image
           style={styles.image}
           source={{uri: sharedData}}
           resizeMode="contain"
         />
       )}
       <Text style={styles.instructions}>
         Shared file:{' '}
         {sharedMimeType === 'application/zip'
           ? sharedData
           : ''}
       </Text>
       <Text style={styles.instructions}>
         Extra data: {sharedExtraData ? JSON.stringify(sharedExtraData) : ''}
       </Text>
       <Text>
          File data: {JSON.stringify(fileData, null, 2)}
       </Text>
     </ScrollView>
   );
 };

 const styles = StyleSheet.create({
   container: {
     flexGrow: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F5FCFF',
   },
   welcome: {
     fontSize: 20,
     textAlign: 'center',
     margin: 10,
   },
   instructions: {
     textAlign: 'center',
     color: '#333333',
     marginBottom: 5,
   },
   image: {
     width: '100%',
     height: 200,
   },
 });

 export default App;
