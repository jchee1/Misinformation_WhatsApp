import React, {useState, useEffect, useCallback, Component} from 'react';
import {StyleSheet, Text, View, Image, Platform, FlatList, Button, Alert, TouchableOpacity, TextInput, Linking, SafeAreaView} from 'react-native';
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


type SharedItem = {
  mimeType: string,
  data: string,
};

export function Urls_extract({ navigation, route }) {
  const {file} = route.params
  const [urls, setUrls] = useState(file.url_list);
  const [sent, setSent] = useState(false);
  const [editing, setEditing] = useState(false);
  const [edited, setEdited] = useState(false);


  function deleter (val){
    let temp=urls;
    if(edited===false){
      setEdited(true)
    }
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
      let temp=file;
      temp.url_list=urls;
      if ("info" in temp) {
        global.SECTIONS.push({title: `Chat ${global.count}`, content: temp, edit: edited});
      }
      else {
        global.SECTIONS.push({title: `File ${global.count}`, content: temp, edit: edited});
      }
      global.count++;
      console.log(global.SECTIONS);
      AsyncStorage.setItem("sections", JSON.stringify(global.SECTIONS))
      .then(()=>{
        console.log("succeeded in sync")
      })
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>EXTRACTED URLS</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.header2}>
        {editing ? <Button title="Done" onPress={() => setEditing(false)}/> :
        <EntypoIcon.Button name="pencil" onPress={() => setEditing(true)}>Edit URLs</EntypoIcon.Button>}
        <TouchableOpacity style={styles.chatHeader} onPress={() => {sender(); navigation.navigate('AccordianView')}}>
          <Text style={styles.buttonText}>Add to Send</Text>
        </TouchableOpacity>
        </View>
        <Text style={styles.title}>
          URLs Extracted: {urls.length===0 ? "(Share a Zipped WhatsApp Chat File)" : ""}
        </Text>
        <Text style={{paddingHorizontal: 15, paddingTop: 10, paddingBottom: 20, fontSize: 16,}}>Below is a list of URLs extracted from your chat. You can edit this list before
            sending it by tapping on the pencil icon above and removing any undesired links. Once you're finished
            editing, click "Done" and save the information by clicking "Add to Send".
            Return to the home page with the button at the bottom.
        </Text>
        <View style={{flex:0.8}}>
        {editing ?
        <FlatList data={urls} style={styles.list}
        renderItem={({item}) =>
        <View style={styles.item}>
        <TouchableOpacity
        onPress={() => Linking.openURL(item)}>
          <Text style={{textDecorationLine: 'underline'}}>{item.length>40 ? item.substr(0,40)+"..." : item}</Text>
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
        {urls.length==0 && <Text style={{alignItems: 'center', paddingBottom: 180, fontFamily: 'Montserrat-Bold',
    fontSize: 18,}}>No URLs found in chat</Text>}
        </View>
        <TouchableOpacity style={[styles.button, { position: "absolute", bottom: 15,}]}
              onPress={() => navigation.navigate('AccordianView')}>
                <Text style={styles.buttonText}>Return to Home Page</Text>
        </TouchableOpacity>
        </View>
   </SafeAreaView>
  );
};


export default Urls_extract;
