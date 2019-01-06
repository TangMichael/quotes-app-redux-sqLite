import React, { Component } from "react";
import { Platform, StyleSheet, View, Text, Button } from "react-native";
import { connect } from "react-redux";
import { getFavorites } from "../../actions/index";
import { TextInput, FlatList } from "react-native-gesture-handler";
import { removeFavorites } from "../../actions/index";
import { openDatabase } from "react-native-sqlite-storage";
let db = openDatabase({ name: "newdb", createFromLocation: "~quotes.db" });

class Favorites extends Component {
  render() {
    return (
      <FlatList
        data={this.props.state}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text
            onPress={() => this.props.removeFavorites(item.id)}
            style={{ borderBottomWidth: 1, padding: 15 }}
          >
            {item.quote}
          </Text>
        )}
      />
    );
  }
}
const mapStateToProps = state => {
  return {
    state: state.favorites
  };
};

function mapDispatchToProps(dispatch, state) {
  return {
    removeFavorites: function(id) {
      dispatch(removeFavorites(id));
      db.transaction(tx => {
        tx.executeSql(
          "DELETE FROM favorites where id = ?",
          [id],
          (tx, rs) => {},
          (tx, err) => {}
        );
      });
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Favorites);
