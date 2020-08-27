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



export function Chat_info({ navigation, route }) {

    //const file = navigation.getParam("fileDat", 'default value');
    const {fileDat} = route.params
    console.log(fileDat);

    return (
    <View style={styles.container}>
        <Text style={{fontSize:30, fontWeight:'bold'}}>Shared Chat Information</Text>
        <View style={{flexDirection: 'row', margin:10, marginTop:20}}>
          <Text style={styles.chatSect}>Number of Members: </Text>
          <Text style={styles.chatText}>{fileDat.info.Contacts}</Text>
        </View>
        <View style={{flexDirection: 'row', margin:10}}>
          <Text style={styles.chatSect}>Chat Start Date: </Text>
          <Text style={styles.chatText}>{fileDat.info.startdate}</Text>
        </View>
        <View style={{flexDirection: 'row', margin:10}}>
          <Text style={styles.chatSect}>Total Number of Messages: </Text>
          <Text style={styles.chatText}>{fileDat.info.Total_messages}</Text>
        </View>
        <View style={{flexDirection: 'row', margin:10}}>
          <Text style={styles.chatSect}>Number of URLs in Chat: </Text>
          <Text style={styles.chatText}>{fileDat.info.URLs}</Text>
        </View>
        <View style={{flexDirection: 'row', margin:10}}>
          <Text style={styles.chatSect}>Number of Images in Chat: </Text>
          <Text style={styles.chatText}>{fileDat.info.Images}</Text>
        </View>
        <View style={{flexDirection: 'row', margin:10}}>
          <Text style={styles.chatSect}>Number of Texts in Chat: </Text>
          <Text style={styles.chatText}>{fileDat.info.Text}</Text>
        </View>
        <Text style={{textAlign:'center', marginTop:30}}>
        Look like you shared the correct chat?
        Click the "Continue to Edit URLs" button below! </Text>
       <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 0}}>
         <Button style={styles.nav}
           title="Continue to Edit Urls"
           onPress={() => navigation.navigate('Urls-extract', {file: fileDat})}
         />
       </View>
    </View>
    );
  };

  export default Chat_info;
