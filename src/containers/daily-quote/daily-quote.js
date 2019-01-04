import React, { Component } from "react";
import { Platform, StyleSheet, View, Text, Button } from "react-native";
import { connect } from "react-redux";
import { addFavorites } from "../../actions/index";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "quote.db"});

class DailyQuote extends Component {
  constructor(props) {
    super(props);
    this.state = { quotes: null };
  }

  componentDidMount() {
    db.transaction(tx => {
      // somehow needs an argument, without it, it doesnt work
      // but the argument should be optional
      tx.executeSql("SELECT * FROM quote", [], (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          console.log("quotes to be displayed")
          var row = results.rows.item(0);
          console.log(row.quote);
          this.setState({quotes: row.quote})
          quote = row.quote;
          var row = results.rows.item(1);
          console.log(row.quote);
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
