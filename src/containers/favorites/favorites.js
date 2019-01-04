import React, { Component } from "react";
import { Platform, StyleSheet, View, Text, Button } from "react-native";
import { connect } from "react-redux";
import { getFavorites } from "../../actions/index";
import { TextInput, FlatList } from "react-native-gesture-handler";
import { removeFavorites } from "../../actions/index";


class Favorites extends Component {
  render() {
    return (
      <FlatList
        data={this.props.state}
        renderItem={({ item }) => (
          <Text
            onPress={() => this.props.removeFavorites(item.id)}
            style={{ borderBottomWidth: 1 }}
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
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
