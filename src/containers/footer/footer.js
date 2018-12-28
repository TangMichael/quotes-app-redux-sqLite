import React, { Component } from 'react'
import { Platform, StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";

class Footer extends Component {

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View>
         <TouchableOpacity>
            <Text>Increase</Text>
          </TouchableOpacity>
      </View>
    )
  }
}

export default Footer;
