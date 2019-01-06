import React, { Component } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity} from "react-native";
import { connect } from "react-redux";
import { getFavorites } from "../../actions/index";
import { TextInput } from "react-native-gesture-handler";
import NotifService from './../../service/NotifService';
import { openDatabase } from "react-native-sqlite-storage";
let db = openDatabase({ name: "newdb", createFromLocation: "~quotes.db" });

class DisplayDaily extends Component {
  constructor(props) {
    super(props);
    this.state = {quote: null}
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  componentDidMount(){
    // load 1 random quote to pass to the function that push a notification
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1", [], (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          this.setState({quote: results.rows.item(0).quote});
        }
      });
    });
  }
  render() {
    return (
        <View>
          <Text>Your daily quote:</Text>
        <View style={styles.spacer}></View>
        <View style={styles.spacer}></View>

        <TouchableOpacity style={styles.button} onPress={() => { this.notif.localNotif(this.state.quote) }}><Text>Local Notification (now)</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.scheduleNotif() }}><Text>Schedule Notification in 30s</Text></TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelNotif() }}><Text>Cancel last notification (if any)</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelAll() }}><Text>Cancel all notifications</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.checkPermission(this.handlePerm.bind(this)) }}><Text>Check Permission</Text></TouchableOpacity> */}
        </View>
    )
  }


  onRegister(token) {
    Alert.alert("Registered !", JSON.stringify(token));
    console.log(token);
  }
  
  onNotif(notif) {
    console.log(notif.message);
    this.setState({quote: notif.message})
    // Alert.alert(notif.title, notif.message);
  }
  
  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
  }
}

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
  button: {
    borderWidth: 1,
    borderColor: "#000000",
    margin: 5,
    padding: 5,
    width: "70%",
    backgroundColor: "#DDDDDD",
    borderRadius: 5,
  },
  textField: {
    borderWidth: 1,
    borderColor: "#AAAAAA",
    margin: 5,
    padding: 5,
    width: "70%"
  },
  spacer: {
    height: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  }
});

export default DisplayDaily;


