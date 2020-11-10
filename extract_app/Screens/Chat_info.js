import React, {useState, useEffect, useCallback, Component} from 'react';
import {StyleSheet, Text, View, Image, Platform, FlatList, Button, Alert, TouchableOpacity, TextInput, SafeAreaView} from 'react-native';
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

    const {fileDat} = route.params
    console.log(fileDat);

    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
            <Text style={styles.headerText}>SHARED CHAT INFO</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={{paddingTop: 10, fontSize: 17.5,}}>
            Please verify that the chat information shown below is correct.
        </Text>
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
        <TouchableOpacity style={[styles.button, { position: "absolute", bottom: 15,}]}
             onPress={() => navigation.navigate('Urls-extract', {file: fileDat})}>
               <Text style={styles.buttonText}>Continue to Edit URLs</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
    );
  };

  export default Chat_info;
