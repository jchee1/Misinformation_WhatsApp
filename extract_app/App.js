/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useCallback, Component} from 'react';
import {StyleSheet, Text, View, Image, Platform, FlatList, Button, Alert, TouchableOpacity, TextInput} from 'react-native';
import ShareMenu from 'react-native-share-menu';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import { MainBundlePath, DocumentDirectoryPath, ExternalDirectoryPath, DownloadDirectoryPath, TemporaryDirectoryPath, readFile, readDir, exists, stat, copyFile, unlink, writeFile } from 'react-native-fs'
import {returner} from "./parser.js";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Accordion from 'react-native-collapsible/Accordion';
import AsyncStorage from '@react-native-community/async-storage';
import Mailer from 'react-native-mail';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { SendScreen } from'./Screens/SendScreen';
import { styles } from './Screens/styles';
import { AccordionView } from './Screens/accordianview';
import { Urls_extract } from './Screens/Urls_extract';
import { Chat_info } from './Screens/Chat_info';


//global variables
global.count = 1;

var SECTIONS = [];

const Stack = createStackNavigator();

function App() {
 return (
   <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
       <Stack.Screen name="chat-info" component={Chat_info} />
       <Stack.Screen name="Urls-extract" component={Urls_extract} />
       <Stack.Screen name="AccordianView" component={AccordionView} />
       <Stack.Screen name="SendScreen" component={SendScreen} />
     </Stack.Navigator>
   </NavigationContainer>
 );
}

export default App;
