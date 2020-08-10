/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useState, useEffect, useCallback} from 'react';
 import {StyleSheet, Text, View, Image} from 'react-native';
 import ShareMenu from 'react-native-share-menu';
 import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
 import { MainBundlePath, DocumentDirectoryPath, TemporaryDirectoryPath, readFile, readDir, stat, copyFile } from 'react-native-fs'
 import {readUrl} from "./parser.js";

 type SharedItem = {
   mimeType: string,
   data: string,
 };

 const App: () => React$Node = () => {
   const [sharedData, setSharedData] = useState('');
   const [sharedMimeType, setSharedMimeType] = useState('');
   const [sharedExtraData, setSharedExtraData] = useState(null);

   const handleShare = useCallback((item: ?SharedItem) => {
     if (!item) {
       return;
     }

     const {mimeType, data, extraData} = item;

     setSharedData(data);
     setSharedExtraData(extraData);
     setSharedMimeType(mimeType);
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

   if (sharedMimeType.startsWith('application/zip')){
     const sourcePath = sharedData;
     console.log(sourcePath);
     const tempPath = `${TemporaryDirectoryPath}/tester.zip`;
     copyFile(sourcePath, tempPath)
     .catch((error) => {
       console.error(error)
     });
     console.log(tempPath);
     const targetPath = DocumentDirectoryPath
     const charset = 'UTF-8'
     unzip(tempPath, targetPath, charset)
      .then((path) => {
        console.log(`unzip completed at ${path}`)
        readDir(DocumentDirectoryPath)
        .then((result) => {
          console.log('test readdir', result);
          var i = 0;
          while(result[i]["name"]!="_chat.txt"){
            i = i+1;
          }
          console.log(result[i]["path"]);
          return readFile(result[i]["path"]);
        })
        .then((contents) => {
          // log the file contents
          //console.log(JSON.stringify(contents));
          //console.log(contents);
          readUrl(contents);
        })
      })
      .catch((error) => {
        console.error(error)
      })
   }

   return (
     <View style={styles.container}>
       <Text style={styles.welcome}>React Native Share Menu</Text>
       <Text style={styles.instructions}>Shared type: {sharedMimeType}</Text>
       <Text style={styles.instructions}>
         Shared text: {sharedMimeType === 'text/plain' ? sharedData : ''}
       </Text>
       <Text style={styles.instructions}>Shared image:</Text>
       {sharedMimeType.startsWith('image/') && (
         <Image
           style={styles.image}
           source={{uri: sharedData}}
           resizeMode="contain"
         />
       )}
       <Text style={styles.instructions}>
         Shared file:{' '}
         {sharedMimeType !== 'text/plain' && !sharedMimeType.startsWith('image/')
           ? sharedData
           : ''}
       </Text>
       <Text style={styles.instructions}>
         Extra data: {sharedExtraData ? JSON.stringify(sharedExtraData) : ''}
       </Text>
     </View>
   );
 };

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F5FCFF',
   },
   welcome: {
     fontSize: 20,
     textAlign: 'center',
     margin: 10,
   },
   instructions: {
     textAlign: 'center',
     color: '#333333',
     marginBottom: 5,
   },
   image: {
     width: '100%',
     height: 200,
   },
 });

 export default App;

/*
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
*/
