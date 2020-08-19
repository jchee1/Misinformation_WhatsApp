/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useCallback, Component} from 'react';
import {StyleSheet, Text, View, Image, Platform, FlatList, Button, Alert, TouchableOpacity, ScrollView} from 'react-native';
import ShareMenu from 'react-native-share-menu';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import { MainBundlePath, DocumentDirectoryPath, DownloadDirectoryPath, TemporaryDirectoryPath, readFile, readDir, exists, stat, copyFile, unlink, writeFile } from 'react-native-fs'
import {returner} from "./parser.js";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Accordion from 'react-native-collapsible/Accordion';
import AsyncStorage from '@react-native-community/async-storage';
import Mailer from 'react-native-mail';


class SendScreen extends Component {

  writeTo = () => {
    /*put stuff in file*/
    var path = DocumentDirectoryPath + '/test.doc';
    // write the file
    writeFile(path, JSON.stringify(SECTIONS), 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
        //console.log(success);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  
  
  handleEmail = () => {
    //var Mailer = require('NativeModules').RNMail;
    //this.writeTo;
    Mailer.mail({
      subject: 'need help',
      recipients: ['brohna@uchicago.edu'],
      ccRecipients: [],
      bccRecipients: [],
      body: '<b>A Bold Body</b>',
      isHTML: true,
      attachments: [{
        path: DocumentDirectoryPath + '/test1.doc',  // The absolute path of the file from which to read data.
        type: 'doc',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
        // mimeType - use only if you want to use custom type
        name: '',   // Optional: Custom filename for attachment
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


//global variables
global.count = 0;

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

class AccordionView extends Component {
  state = {
    activeSections: [],
  };

  _writeTo = () => {
    
    var path = DocumentDirectoryPath + '/test1.doc';
    // write the file
    writeFile(path, JSON.stringify(SECTIONS), 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
        console.log(JSON.stringify(SECTIONS));
      })
      .catch((err) => {
        console.log(err.message);
      });
      
    console.log("hello");
  }

  _renderHeader = section => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  _renderContent = section => {
    //console.log("section",SECTIONS[0].content);

    for (let i = 0; i < global.count; i++) {
      AsyncStorage.getItem(`filedata${i}`)
      .then((file) => {
        //console.log("async", file);
        SECTIONS[i].content = file;
      })
      .catch((error) => {
        console.error("get async", error)
      });
    }

    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
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

function SendScreen1() {
  /*put stuff in file*/
  var path = DocumentDirectoryPath + '/test.txt';
  // write the file
  writeFile(path, JSON.stringify(SECTIONS), 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN!');
      //console.log(success);
    })
    .catch((err) => {
      console.log(err.message);
    });
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Send Screen</Text>
    </View>
  );
}

type SharedItem = {
  mimeType: string,
  data: string,
};

function Screen1({ navigation }) {
  const [sharedData, setSharedData] = useState('');
  const [sharedMimeType, setSharedMimeType] = useState('');
  const [sharedExtraData, setSharedExtraData] = useState(null);
  const [fileData, setFileData] = useState({});
  const [editData, setEditData] = useState([]);
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
    setEditData([]);
    setSent(false);

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



  function deleter (vals){
    let temp=urls;
    for(let i=0; i<vals.length; i++){
      temp=temp.filter(function (j){
        return j!=vals[i];
        });
    }
    setUrls(temp);
    setEditing(false);
  }

  function itemPress (data){
    if(editData.includes(data)){
      let temp=editData;
      temp=temp.filter(function (i){
        return i!=data;
        });
      setEditData(temp);
    }
    else{
      setEditData(editData.concat(data))
    }
  }

  function sender (){
    if(sent){
      Alert.alert("URLs already sent");
    }
    else{
      let temp=fileData;
      temp.url_list=urls;
      AsyncStorage.setItem(`filedata${global.count}`, JSON.stringify(temp))
       .then((save)=>{
          global.count++;
       })
       .catch((error)=>{
          console.error("set async", error)
       })
       setSent(true);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      {editing ? <Button title="Delete selected/Done" onPress={() => deleter(editData)}/> :
      <Button title="Edit URLs" onPress={() => setEditing(true)}/>}
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
      <TouchableOpacity style={{backgroundColor: editData.includes(item) ? "grey" : "blue", padding: 10, margin: 5}}
      onPress={() => itemPress(item)}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
      </View>}
      /> :
      <FlatList data={urls} style={styles.list}
      renderItem={({item}) =>
      <View style={styles.item}>
        <Text style={{padding:10}}>{item}</Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    height: '100%',
    justifyContent: 'flex-start'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop:15
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {

  },
  nav: {
   //flex: 1,
   //marginBottom: 36,
   //justifyContent: 'space-between',
   position: 'absolute',
   bottom: 0,
 }
});

const Stack = createStackNavigator();

function App() {
 return (
   <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
       <Stack.Screen name="WhatsApp Extractor" component={Screen1} />
       <Stack.Screen name="AccordianView" component={AccordionView} />
       <Stack.Screen name="SendScreen" component={SendScreen} />
     </Stack.Navigator>
   </NavigationContainer>
 );
}

export default App;
