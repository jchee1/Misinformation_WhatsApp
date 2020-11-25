import React, {useState, useEffect, useCallback, Component, componentDidMount} from 'react';
import {StyleSheet, Text, View, Image, Platform, FlatList, Linking, Button, Alert, TouchableOpacity, TextInput, PermissionsAndroid, SafeAreaView} from 'react-native';
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
import DocumentPicker from 'react-native-document-picker';


  type SharedItem = {
      mimeType: string,
      data: string,
    };

export function AccordionView ({navigation, route}) {

  const [sharedData, setSharedData] = useState('');
  const [sharedMimeType, setSharedMimeType] = useState('');
  const [sharedExtraData, setSharedExtraData] = useState(null);
  const [fileData, setFileData] = useState({});
  const [urls, setUrls] = useState([]);
  const [sent, setSent] = useState(false);
  const [editing, setEditing] = useState(false);

  if (Platform.OS === "android"){
    PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE])
    .catch((error) => {
      console.error("text:", error);
    });
  }

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
               metadata = returner(0, contents);
               setFileData(metadata);
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
             metadata = returner(0, contents);
             setFileData(metadata);
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
    const [edit, setEdit] = useState(false)
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      if(route.params != undefined){
        setEdit(route.params.edit)
      }
      
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
        setRandomnum(Math.random());
      })
      .catch((error) => {
        console.error("async get error", error);
      })
      AsyncStorage.getItem('count')
      .then((item)=>{
        global.count=parseInt(count);
      })
    });


    function _writeTo(){
      var path;
      console.log(edit)
      if (Platform.OS === 'ios') {
        path = `${DocumentDirectoryPath}/test1.txt`;
      }
      else if (Platform.OS === 'android') {
        path = `${DownloadDirectoryPath}/test1.txt`;
      }
      // write the file
      writeFile(path, JSON.stringify(global.SECTIONS, null, 4), 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!');
          console.log(JSON.stringify(global.SECTIONS, null, 4));
          console.log(path);
        })
        .catch((err) => {
          console.log(err.message);
        });

    }

    function deleteChat(chat){
      global.SECTIONS= global.SECTIONS.filter(function(value, index, arr){ return value.title!=chat.title;})
      for(let i=0; i<global.SECTIONS.length; i++){
        global.SECTIONS[i].title=`Chat ${i+1}`
      }
      setRandomnum(Math.random())
    }

    function _renderHeader(section){
      return (
        <View>
        {editing ?
          <View style={styles.chatHeader}>
            <Text style={styles.buttonText}>{section.title}</Text>
            <EntypoIcon name="cross" size={30} color="red" onPress={() => deleteChat(section)}/>
          </View>
          :
          <View style={styles.chatHeader}>
            <Text style={styles.buttonText}>{section.title}</Text>
          </View>
        }
        </View>
      );
    };

    function deleteURL(link){
      let l;
      for(let i=0; i<global.SECTIONS.length; i++){
        l = global.SECTIONS[i].content.url_list.length
        global.SECTIONS[i].content.url_list=global.SECTIONS[i].content.url_list.filter(function(value, index, arr){ return value!=link;})
        if(l != global.SECTIONS[i].content.url_list.length){
          global.SECTIONS[i].edit=true
        }
      }
    }

    function _renderContent(section){
      return (
        <View style={{flex: 0.4}}>
        {editing ?
          <FlatList data={section.content.url_list}
          renderItem={({item}) =>
          <View style={styles.item}>
          <TouchableOpacity
          onPress={() => Linking.openURL(item)}>
            <Text style={{textDecorationLine: 'underline'}}>{item.length>40 ? item.substr(0,40)+"..." : item}</Text>
          </TouchableOpacity>
          <EntypoIcon name="cross" size={30} color="red" onPress={() => deleteURL(item)}/>
          </View>} /> :
          <FlatList data={section.content.url_list}
            renderItem={({item}) => <Text style={{padding:5}}>{item}</Text>} />}
        </View>
      );
    };

    function _updateSections(activeSections){
      setActiveSections(activeSections);
    };
    function picker(){
      DocumentPicker.pick()
      .then((res) => {
        console.log("result:")
        console.log(res)
        return readFile(res.uri)
      .then((contents) => {
        let metadata = returner(0, contents);
        setFileData(metadata);
        setUrls(returner(1, contents));
        navigation.navigate("chat-info", {fileDat: metadata});
        })
      })
      .catch((err) => {
        console.log("picker error:", err)
      })
    }

      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>AIRLAB URL EXTRACTOR</Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.header2}>
            {editing ? <Button title="Done" onPress={() => setEditing(false)}/> :
            <EntypoIcon.Button name="pencil" onPress={() => setEditing(true)}>Edit URLs</EntypoIcon.Button>}
            <TouchableOpacity style={styles.chatHeader} onPress={() => picker()}>
              <Text style={styles.buttonText}>Import Files</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.fsImageContainer}>
              {global.SECTIONS.length===0 ?
              <Image
                style={styles.fullScreenImage}
                source={require('../assets/start-graphic.png')}
              /> : <View></View>}
            </View>

            <TouchableOpacity onPress={()=> Linking.openURL("https://airlab.cs.uchicago.edu/whatsapp-extractor-privacy-policy-faq/")}>
              <Text style={{paddingBottom: 15, textDecorationLine: 'underline', color: 'blue',}}>(Link to privacy policy)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> {AsyncStorage.clear(); global.SECTIONS=[]; global.count=1; setRandomnum(Math.random())}}>
              <Text style={{color: '#a10000',}}>Clear All Chats</Text>
            </TouchableOpacity>
            <Accordion
              sections={global.SECTIONS}
              activeSections={activeSections}
              renderHeader={_renderHeader}
              renderContent={_renderContent}
              onChange={_updateSections}
            />


             <TouchableOpacity style={[styles.button, { position: "absolute", bottom: 15,}]}
             onPress={() => {_writeTo() ; navigation.navigate('SendScreen')}}>
               <Text style={styles.buttonText}>Send Chats</Text>
             </TouchableOpacity>

          </View>

        </SafeAreaView>
      );

  }
  export default AccordionView
