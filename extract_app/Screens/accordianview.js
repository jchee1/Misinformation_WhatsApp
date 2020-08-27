import React, {useState, useEffect, useCallback, Component, componentDidMount} from 'react';
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
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { SendScreen } from'./SendScreen';
import { styles } from './styles';
//import {SECTIONS} from '../global';


  type SharedItem = {
      mimeType: string,
      data: string,
    };

export function AccordionView ({navigation}) {

  //console.log(SECTIONS);
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
    let metadata;

    if (mimeType.startsWith('text/plain')) {
      const sourcePath = `${DocumentDirectoryPath}/_chat.txt`
      readFile(sourcePath)
      .then((contents) => {
        //console.log("text2");
        metadata = returner(0, contents);
        setFileData(metadata);
        setUrls(returner(1, contents));
        navigation.navigate("chat-info", {fileDat: metadata});
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
               metadata = returner(0, contents);
               setFileData(metadata);

               //console.log("item:", item);

               //console.log(fileData);
               setUrls(returner(1, contents));
               navigation.navigate("chat-info", {fileDat: metadata});
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
             metadata = returner(0, contents);
             setFileData(metadata);

             //console.log("item:", item);

             setUrls(returner(1, contents));
             navigation.navigate("chat-info", {fileDat: metadata});
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

    const [activeSections, setActiveSections] = useState([]);
    const [randomnum, setRandomnum] = useState(0.2);
    //AsyncStorage.clear();
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      AsyncStorage.getItem('sections')
      .then((item) => {
        //console.log('async item',item);
        //console.log('parsed item', JSON.parse(item));

        item=JSON.parse(item);
        if(global.SECTIONS.length===0 && item!=null){
          for(let i=0; i<item.length; i++){
            global.SECTIONS.push(item[i]);
          }
        }
        console.log('SECTIONS',global.SECTIONS);
        setRandomnum(Math.random());
      })
      .catch((error) => {
        console.error("async get error", error);
      })
      AsyncStorage.getItem('count')
      .then((item)=>{
        global.count=parseInt(count);
      })
      console.log('listen');
      //setRandomnum(Math.random());
      //console.log(sect);

    });


    function _writeTo(){
      var path;
      if (Platform.OS === 'ios') {
        path = `${DocumentDirectoryPath}/test1.txt`;
      }
      else if (Platform.OS === 'android') {
        path = `${DownloadDirectoryPath}/test1.txt`;
      }
      // write the file
      writeFile(path, JSON.stringify(global.SECTIONS), 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!');
          console.log(JSON.stringify(global.SECTIONS));
          console.log(path);

        })
        .catch((err) => {
          console.log(err.message);
        });

    }

    function _renderHeader(section){
      return (
        <View style={styles.chatHeader}>
          <Text style={styles.text}>{section.title}</Text>
        </View>
      );
    };

    function _renderContent(section){
      //console.log("section",SECTIONS[0].content);

      return (
        <View style={styles.content}>
          <Text style={{padding:5}}>{JSON.stringify(section.content)}</Text>
        </View>
      );
    };

    function _updateSections(activeSections){
      setActiveSections(activeSections);
    };
    console.log('sections', global.SECTIONS);

      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            WhatsApp Extractor
          </Text>
          <Text style={{paddingTop: 10,}}>To get started, please export a chat from WhatsApp.</Text>
          <Text style={{paddingBottom: 15,}}>(Link to privacy policy)</Text>
          <Accordion
            sections={global.SECTIONS}
            activeSections={activeSections}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
          />

          <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 36}}>
            <Button style={styles.nav}
            title="Continue to Send Chats"
            onPress={() => {_writeTo(); navigation.navigate('SendScreen');}}
            />
          </View>
        </View>
      );

  }
  export default AccordionView
