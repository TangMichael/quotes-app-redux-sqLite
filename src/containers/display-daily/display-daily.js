import React, { Component } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { getFavorites } from "../../actions/index";
import { TextInput, ScrollView } from "react-native-gesture-handler";
import { addFavorites } from "../../actions/index";
import Snackbar from "react-native-snackbar";
import NotifService from "./../../service/NotifService";
import { openDatabase } from "react-native-sqlite-storage";
let db = openDatabase({ name: "db", createFromLocation: "~quotes.db" });

class DisplayDaily extends Component {
  constructor(props) {
    super(props);
    this.state = { oldQuote: null, newQuote: null };
    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this)
    );
  }

  componentWillMount() {
    this.notif.cancelAll();
    // display daily quote
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM daily", [], (tx, results) => {
        var len = results.rows.length;
        console.log("getting data");
        if (len > 0) {
          console.log(results.rows.item(0).quote);
          this.setState({
            oldQuote: {
              id: results.rows.item(0).id,
              quote: results.rows.item(0).quote
            }
          });
        }
      });
      tx.executeSql("DELETE FROM daily", [], (tx, results) => {});
    });

    // pick new quote
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1",
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            console.log(
              "new quote is " +
                results.rows.item(0).quote +
                " ID " +
                results.rows.item(0).id
            );

            this.setState({
              newQuote: {
                id: results.rows.item(0).id,
                quote: results.rows.item(0).quote
              }
            });
            this.notif.scheduleNotif(this.state.newQuote);
          }
        }
      );
    });
    // store new quote in the database
    db.transaction(tx => {
      tx.executeSql(
        "INSERT into daily values(?,?)",
        [this.state.newQuote.id, this.state.newQuote.quote],
        (tx, results) => {}
      );
    });
  }
  render() {
    const quote =
      this.state.oldQuote === null ? (
        <Text>""</Text>
      ) : (
        <Text
          onPress={() => {
            var x = false;
            this.props.favorites.some(element => {
              if (element.id === this.state.oldQuote.id) {
                x = true;
              }
            });
            if (!x) {
              this.props.addFavorites(this.state.oldQuote);
            } else {
              Snackbar.show({
                title: "Quote already added to favorites",
                duration: Snackbar.LENGTH_SHORT
              });
            }
          }}
          style={{ padding: 15 }}
        >
          {this.state.oldQuote.quote}
        </Text>
      );
    return (
      <ScrollView>
        <Text>Your daily quote:</Text>
        {quote}
        <View style={styles.spacer} />
        <View style={styles.spacer} />

        {/* <TouchableOpacity style={styles.button} onPress={() => { this.notif.localNotif(this.state.newQuote) }}><Text>Local Notification (now)</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.scheduleNotif(this.state.newQuote) }}><Text>Schedule Notification in 30s</Text></TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelNotif() }}><Text>Cancel last notification (if any)</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelAll() }}><Text>Cancel all notifications</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.checkPermission(this.handlePerm.bind(this)) }}><Text>Check Permission</Text></TouchableOpacity> */}
      </ScrollView>
    );
  }

  onRegister(token) {
    Alert.alert("Registered !", JSON.stringify(token));
    console.log(token);
  }

  onNotif(notif) {
    console.log(notif.message);
    this.setState({ oldQuote: notif.message });
    // Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
  }
}

function mapDispatchToProps(dispatch, state) {
  return {
    addFavorites: function(quote, initial) {
      dispatch(addFavorites(quote));
      // on opening, will triger the err since it is already in the database
      // we pass in initial which is true
      // next time we add, we dont pass anything, !undefined will be true
      if (!initial) {
        db.transaction(tx => {
          tx.executeSql(
            "INSERT into favorites values(?,?)",
            [quote.id, quote.quote],
            (tx, results) => {},
            (tx, err) => {
              if (tx.code == 0) {
                Snackbar.show({
                  title: "Quote already added to favorites",
                  duration: Snackbar.LENGTH_SHORT
                });
              }
            }
          );
        });
      }
    }
  };
}

const mapStateToProps = state => {
  return {
    favorites: state.favorites
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  button: {
    borderWidth: 1,
    borderColor: "#000000",
    margin: 5,
    padding: 5,
    width: "70%",
    backgroundColor: "#DDDDDD",
    borderRadius: 5
  },
  textField: {
    borderWidth: 1,
    borderColor: "#AAAAAA",
    margin: 5,
    padding: 5,
    width: "70%"
  },
  spacer: {
    height: 10
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayDaily);
