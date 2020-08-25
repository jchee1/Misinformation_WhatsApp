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

export class AccordionView extends Component {
    state = {
      activeSections: [],
    };
  
    _writeTo = () => {
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
  
    _renderHeader = section => {
      return (
        <View style={styles.chatHeader}>
          <Text style={styles.text}>{section.title}</Text>
        </View>
      );
    };
  
    _renderContent = section => {
      //console.log("section",SECTIONS[0].content);
  
      return (
        <View style={styles.content}>
          <Text style={{padding:5}}>{section.content}</Text>
        </View>
      );
    };
  
    _updateSections = activeSections => {
      this.setState({ activeSections });
    };
  
    render() {
      return (
        <View style={styles.container}>
          <Accordion
            sections={SECTIONS}
            activeSections={this.state.activeSections}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
          />
  
          <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 36}}>
            <Button style={styles.nav}
            title="Continue to Send Chats"
            onPress={() => {this._writeTo(); this.props.navigation.navigate('SendScreen');}}
            />
          </View>
        </View>
      );
    }
  }
  export default AccordionView