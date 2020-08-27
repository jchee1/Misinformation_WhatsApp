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
import { CheckBox } from '../checkbox';
import { styles } from './styles';


export class SendScreen extends Component {
    state = {
      email: '',
      termsAccepted: false,
      mturk: '',
    }
    
    handleCheckBox = () => this.setState({ termsAccepted: !this.state.termsAccepted })
    
    handleEmail = () => {
      var research;
      var recips;
      if (this.state.termsAccepted === true) {
         research = ("brohna@uchicago.edu");
      }
      var filepath;
      if (Platform.OS === 'ios') {
        filepath = `${DocumentDirectoryPath}/test1.txt`;
      }
      else if (Platform.OS === 'android') {
        filepath = `${DownloadDirectoryPath}/test1.txt`;
      }

      if (research != null) {
        recips = this.state.email.split(/;| /);
        recips.push(research);
        //remove empty strings
        recips = recips.filter(el => {
          return el != null && el != '';
        });
        console.log(recips);
        //recips = [this.state.email, research];
      }
      else {
        recips = this.state.email.split(/[ ;]+/);
        //remove empty strings
        recips = recips.filter(el => {
          return el != null && el != '';
        });
        console.log(recips);
        //recips = [this.state.email];
      }

      Mailer.mail({
        subject: 'need help',
        recipients: recips,
        ccRecipients: [],
        bccRecipients: [],
        body: '<b>A Bold Body</b>',
        isHTML: true,
        attachments: [{
          path: filepath,  // The absolute path of the file from which to read data.
          type: 'text',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
          // mimeType - use only if you want to use custom type
          name: this.state.mturk,   // Optional: Custom filename for attachment
        }]
      }, (error, event) => {
        Alert.alert(
          error,
          event,
          [
            {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
            {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
          ],
          { cancelable: true }
        )
      });
    }
  
    render() {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Send Extractions</Text>
          <Text style={{fontSize: 15, paddingTop: 5,}}> Enter Email addresses to which you
            would like to send the extracted data. Separate each
            email with a semicolon. Click the checkbox to automatically add our email. 
          </Text>
          <TextInput 
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize='none'
            value={this.state.email}
            onChangeText={(newValue)=> this.setState({email: newValue})}
            placeholder="brohna@uchicago.edu"
          />
          <CheckBox
            selected={this.state.termsAccepted} 
            onPress={this.handleCheckBox}
            text='Send to Research Team (research@uchicago.edu)'
          />
          <Text style={{fontSize: 14, fontWeight: 'bold', paddingTop: 8,}}>Please enter your MTurk ID below:</Text>
          <TextInput 
            style={styles.input}
            autoCapitalize='none'
            value={this.state.mturk}
            onChangeText={(newId)=> this.setState({mturk: newId})}
            placeholder="Put an MTURK example id"
          /> 
          <Button
            onPress={this.handleEmail}
            title="Email Me"
            color="#841584"
            accessabilityLabel="Purple Email Me Button"
          />
        </View>
      );
    }
  }
  export default SendScreen