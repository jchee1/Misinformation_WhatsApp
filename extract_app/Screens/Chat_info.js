import React, {useState, useEffect, useCallback, Component} from 'react';
import {StyleSheet, Text, View, Image, Platform, FlatList, Button, Alert, TouchableOpacity, TextInput} from 'react-native';
import ShareMenu from 'react-native-share-menu';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import { MainBundlePath, DocumentDirectoryPath, ExternalDirectoryPath, DownloadDirectoryPath, TemporaryDirectoryPath, readFile, readDir, exists, stat, copyFile, unlink, writeFile } from 'react-native-fs'
import {returner} from "../parser.js";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Accordion from 'react-native-collapsible/Accordion';
import AsyncStorage from '@react-native-community/async-storage';
import Mailer from 'react-native-mail';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { SendScreen } from'./SendScreen';
import { styles } from './styles';
import { AccordionView } from './accordianview';
import { Urls_extract } from './Urls_extract';


type SharedItem = {
    mimeType: string,
    data: string,
  };
  
export function Chat_info({ navigation }) {
    const [sharedData, setSharedData] = useState('');
    const [sharedMimeType, setSharedMimeType] = useState('');
    const [sharedExtraData, setSharedExtraData] = useState(null);
    const [fileData, setFileData] = useState({});
    const [urls, setUrls] = useState([]);
    const [sent, setSent] = useState(false);
    const [editing, setEditing] = useState(false);
  
    
    const handleShare = useCallback((item: ?SharedItem) => {
      if (!item) {
        return;
      }
  
      const {mimeType, data, extraData} = item;
  
      setSharedData(data);
      setSharedExtraData(extraData);
      setSharedMimeType(mimeType);
      setFileData({});
      setSent(false);
  
      console.log(mimeType);
      
      if (mimeType.startsWith('text/plain')) {
        readFile(data)
        .then((contents) => {
          let item = returner(0, contents);
          setFileData(item);
          setUrls(returner(1, contents));
        })
        .catch((error) => {
          console.error("text:", error);
        })
      }
  
      if (mimeType.startsWith('application/zip')){
        const sourcePath = data;
        
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
                 let item = returner(0, contents);
                 setFileData(item);
  
                 //console.log("item:", item);
  
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
               let item = returner(0, contents);
               setFileData(item);
  
               //console.log("item:", item);
  
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
  
  
    return (
    <View style={styles.container}>
        <Text style={styles.header}>Chat Information</Text>

        <View style={{flex:10, alignItems: "center", justifyContent: "center"}}>
            <Text>{JSON.stringify(fileData.info)}</Text>
        </View>
       <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 0}}>
         <Button style={styles.nav}
           title="Continue to Edit Urls"
           onPress={() => navigation.navigate('Urls-extract')}
         />
       </View>
    </View>
    );
  };
  
  export default Chat_info;