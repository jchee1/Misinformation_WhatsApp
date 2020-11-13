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
         research = ("airlabapps@gmail.com");
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
      }
      else {
        recips = this.state.email.split(/[ ;]+/);
        //remove empty strings
        recips = recips.filter(el => {
          return el != null && el != '';
        });
        console.log(recips);
      }

      Mailer.mail({
        subject: "WhatsApp Extractor "+this.state.mturk+" Data",
        recipients: recips,
        ccRecipients: [],
        bccRecipients: [],
        body: "",
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
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
          <Button title="Back" style={{position: 'absolute', left: 0, top: 0}}
          onPress={() => this.props.navigation.navigate('AccordianView')} />
            <Text style={{flexDirection: 'row'}, styles.headerText}>EMAIL EXTRACTIONS</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={{fontSize: 15, padding: 20, paddingBottom: 5}}> Enter Email addresses to which you
              would like to send the extracted data. Separate each
              email with a semicolon. Click the checkbox to automatically add our email.
            </Text>
            <TextInput
              style={[styles.input, {height: Platform.OS == 'android' ? 42 : 30}]}
              keyboardType="email-address"
              autoCapitalize='none'
              value={this.state.email}
              onChangeText={(newValue)=> this.setState({email: newValue})}
              placeholder="example@example.com"
            />
            <CheckBox
              selected={this.state.termsAccepted}
              onPress={this.handleCheckBox}
              style={{color:'red'}}
              text='Send to Research Team'
            />
            <Text style={{fontSize: 14, fontWeight: 'bold', paddingTop: 8,}}>Please enter your MTurk ID below:</Text>
            <TextInput
              style={[styles.input, {height: Platform.OS == 'android' ? 42 : 30}]}
              autoCapitalize='none'
              value={this.state.mturk}
              onChangeText={(newId)=> this.setState({mturk: newId})}
            />

            <TouchableOpacity style={[styles.button, { position: "absolute", bottom: 15,}]}
            onPress={this.handleEmail}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
  }
  export default SendScreen
