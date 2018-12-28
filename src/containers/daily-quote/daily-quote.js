import React, { Component } from "react";
import { Platform, StyleSheet, View, Text, Button } from "react-native";
import { connect } from 'react-redux';
import { addFavorites } from '../../actions/index';

const DailyQuote = ({dispatch}) => {
    return (
      <View>
        <Text>Daily</Text>
        <Text>Date</Text>
        <Button
          title="Add to favorites"
          onPress={() => dispatch(addFavorites("ok"))}
        />
      </View>
    );
}

export default connect()(DailyQuote);