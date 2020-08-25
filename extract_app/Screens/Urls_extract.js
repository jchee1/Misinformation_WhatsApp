

import React, {useState, useEffect, useCallback, Component} from 'react';
import {StyleSheet, Text, View, Image, Platform, FlatList, Button, Alert, TouchableOpacity, TextInput} from 'react-native';
import ShareMenu from 'react-native-share-menu';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import { MainBundlePath, DocumentDirectoryPath, ExternalDirectoryPath, DownloadDirectoryPath, TemporaryDirectoryPath, readFile, readDir, exists, stat, copyFile, unlink, writeFile } from 'react-native-fs'
import {returner} from "../parser";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Accordion from 'react-native-collapsible/Accordion';
import AsyncStorage from '@react-native-community/async-storage';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { SendScreen } from'./SendScreen';
import { styles } from './styles';
import { AccordionView } from './accordianview';


//global variables
global.count = 1;

var SECTIONS = [];

type SharedItem = {
  mimeType: string,
  data: string,
};

export function Urls_extract({ navigation }) {
  const [sharedData, setSharedData] = useState('');
  const [sharedMimeType, setSharedMimeType] = useState('');
  const [sharedExtraData, setSharedExtraData] = useState(null);
  const [fileData, setFileData] = useState({});
  const [urls, setUrls] = useState([]);
  const [sent, setSent] = useState(false);
  const [editing, setEditing] = useState(false);

  //AsyncStorage.clear();
  AsyncStorage.getItem("sections")
      .then((item) => {
        if(item!=null){
          SECTIONS=JSON.parse(item);
          //console.log(SECTIONS)
        }
      })
      .catch((error) => {
        console.error("get async", error)
      });

  AsyncStorage.getItem("count")
      .then((item) => {
        if(item!=null){
          global.count=parseInt(item);
          //console.log(item);
        }
      })
      .catch((error) => {
        console.error("get async", error)
      });

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



  function deleter (val){
    let temp=urls;
    temp=temp.filter(function (j){
      return j!=val;
      });

    setUrls(temp);
  }


  function sender (){
    if(sent){
      Alert.alert("URLs already sent");
    }
    else{
      let temp=fileData;
      temp.url_list=urls;
      SECTIONS.push({title: `Chat ${global.count}`, content: temp});
      global.count++;
      AsyncStorage.setItem("sections", JSON.stringify(SECTIONS))
      .catch((error)=>{
          console.error("set async", error)
       });
      AsyncStorage.setItem("count", global.count.toString())
      .catch((error)=>{
          console.error("set async", error)
       });
      setSent(true);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      {editing ? <Button title="Done" onPress={() => setEditing(false)}/> :
      <EntypoIcon.Button name="pencil" onPress={() => setEditing(true)}>Edit URLs</EntypoIcon.Button>}
      <Button title="Add to Send" onPress={() => sender()}/>
      </View>
      <Text style={styles.title}>
         URLs Extracted: {urls.length===0 ? "(Share a Zipped WhatsApp Chat File)" : ""}
      </Text>
      <View style={{flex:10}}>
      {editing ?
      <FlatList data={urls} style={styles.list}
      renderItem={({item}) =>
      <View style={styles.item}>
      <TouchableOpacity
      onPress={() => Linking.openURL(item)}>
        <Text style={{textDecorationLine: 'underline'}}>{item.length>45 ? item.substr(0,42)+"..." : item}</Text>
      </TouchableOpacity>
      <EntypoIcon name="cross" size={30} color="red" onPress={() => deleter(item)}/>
      </View>}
      /> :
      <FlatList data={urls} style={styles.list}
      renderItem={({item}) =>
      <View>
        <TouchableOpacity style={{padding:10}}
        onPress={() => Linking.openURL(item)}>
        <Text style={{textDecorationLine: 'underline'}}>{item}</Text>
        </TouchableOpacity>
      </View>}
      />}
      </View>
     <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 0}}>
       <Button style={styles.nav}
         title="Continue to See Chat Info"
         onPress={() => navigation.navigate('AccordianView')}
       />
     </View>
   </View>
  );
};


export default Urls_extract;
