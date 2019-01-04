import React, { Component } from "react";
import { Platform, StyleSheet, View, Text, Button } from "react-native";
import { connect } from "react-redux";
import { addFavorites } from "../../actions/index";
import { openDatabase } from "react-native-sqlite-storage";
let db = openDatabase({ name: "db", createFromLocation: '~quotes.db'});

class DailyQuote extends Component {
  constructor(props) {
    super(props);
    this.state = { quotes: [] };
  }

  componentDidMount() {
    db.transaction(tx => {
      // somehow needs an argument, without it, it doesnt work
      // but the argument should be optional
      tx.executeSql("SELECT * FROM quotes",[], (tx, results) => {
        var len = results.rows.length;
        var arr = []
        if (len > 0) {
          for(var i = 0; i<10; i++){
            arr.push(results.rows.item(i).quote);
          }
          this.setState({quotes: arr})
          console.log(arr)
        }
      });
    });
  }

  render() {
    return (
      <View>
        <Text>{this.state.quotes}</Text>
        <Button
          title="Add to favorites"
          onPress={() => this.props.addFavorites("ok")}
        />
      </View>
    );
  }
}

function mapDispatchToProps(dispatch, state) {
  return {
    addFavorites: function(quote) {
      dispatch(addFavorites(quote));
    },
    getQuotes: function(quote) {
      dispatch(getQuotes(quote));
    }
  };
}
export default connect(
  null,
  mapDispatchToProps
)(DailyQuote);
