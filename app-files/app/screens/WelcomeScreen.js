import React, { Component } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
} from "react-native";

class WelcomeScreen extends Component {
  /*
    state = {
        name: ''
    }
*/
  render() {
    return (
      <ImageBackground
        style={styles.background}
        source={require("../assets/background.jpg")}
      >
        <Text style={styles.title}>WhatsApp Extractor</Text>
        <View style={styles.loginButton}>
          <Button
            //color="orange"
            title="Enter Name"
            onPress={() =>
              Alert.prompt("My title", "My message", (text) =>
                console.log(text)
              )
            }
          />
        </View>
        <View style={styles.descButton}>
          <Button
            //color="orange"
            title="Click for Instructions"
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
  },
  loginButton: {
    //position: "absolute",
    width: "100%",
    height: 70,
    backgroundColor: "#fc5c65",
    alignItems: "center",
  },
  title: {
    color: "#4ecdc4",
    position: "absolute",
    top: 70,
    justifyContent: "center",
    fontSize: 60,
    fontWeight: "bold",
    alignItems: "center",
  },
  descButton: {
    width: "100%",
    height: 70,
    backgroundColor: "#4ecdc4",
    alignItems: "center",
  },
});

export default WelcomeScreen;
