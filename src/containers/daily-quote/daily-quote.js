import React, { Component } from "react";
import { Platform, StyleSheet, View, Text, Button } from "react-native";
import { connect } from 'react-redux';
import { addFavorites } from '../../actions/index';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'quotes.db' });


const DailyQuote = ({dispatch}) => {
    db.transaction((tx) => {
        // somehow needs an argument, without it, it doesnt work
        // but the argument should be optional
        tx.executeSql('SELECT * FROM quotes',[], (tx, results) =>{
          var len = results.rows.length;
          console.log("OK2");
          if(len >0){
            var row = results.rows.item(0);
            console.log(row.quote);
            var row = results.rows.item(1);
            console.log(row.quote);
          }
        })
      })
    return (
      <View>
        <Text>Date</Text>
        <Button
          title="Add to favorites"
          onPress={() => dispatch(addFavorites("ok"))}
        />
      </View>
    );
}

export default connect()(DailyQuote);