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
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { SendScreen } from'./SendScreen';
import { styles } from './styles';

var SECTIONS = [
    {
      title: 'Chat1',
      content: 'Test1',
    },
    {
      title: 'Chat2',
      content: 'Test2',
    },
    {
      title: 'Chat3',
      content: 'Test3',
    },
    {
      title: 'Chat4',
      content: 'Test4',
    },
    {
      title: 'Chat5',
      content: 'Test5',
    },
  ];

  type SharedItem = {
      mimeType: string,
      data: string,
    };

export function AccordionView ({navigation}) {

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
    let thingy;

    if (mimeType.startsWith('text/plain')) {
      readFile(data)
      .then((contents) => {
        thingy = returner(0, contents);
        setFileData(thingy);
        setUrls(returner(1, contents));
        navigation.navigate("chat-info", {fileDat: thingy});
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
               thingy = returner(0, contents);
               setFileData(thingy);

               //console.log("item:", item);

               //console.log(fileData);
               setUrls(returner(1, contents));
               navigation.navigate("chat-info", {fileDat: thingy});
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
             thingy = returner(0, contents);
             setFileData(thingy);

             //console.log("item:", item);

             setUrls(returner(1, contents));
             navigation.navigate("chat-info", {fileDat: thingy});
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

    function _writeTo(){
      var path;
      if (Platform.OS === 'ios') {
        path = `${DocumentDirectoryPath}/test1.txt`;
      }
      else if (Platform.OS === 'android') {
        path = `${DownloadDirectoryPath}/test1.txt`;
      }
      // write the file
      writeFile(path, JSON.stringify(SECTIONS), 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!');
          console.log(JSON.stringify(SECTIONS));
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
          <Text style={{padding:5}}>{section.content}</Text>
        </View>
      );
    };

    function _updateSections(activeSections){
      setActiveSections(activeSections);
    };

      return (
        <View style={styles.container}>
          <Accordion
            sections={SECTIONS}
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
