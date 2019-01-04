import React, { Component } from "react";
import { Platform, StyleSheet, View, Text, Button } from "react-native";
import { connect } from "react-redux";
import { getFavorites } from "../../actions/index";
import { TextInput } from "react-native-gesture-handler";

class History extends Component {

  render() {
    const textInputComponents = this.props.favorites.map((quote)=> <Text key={quote.id}>{quote.quote} </Text>)
    console.log(this.props.favorites)
    return (
        <View>
            {textInputComponents}
        </View>
    )
  }
}
const mapStateToProps = state => {
  return {
    favorites: state.favorites
  };
};
export default connect(mapStateToProps)(History);
