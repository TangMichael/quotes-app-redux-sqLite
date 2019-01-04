import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Button,
  ListView
} from "react-native";
import { connect } from "react-redux";
import { addFavorites } from "../../actions/index";
import { openDatabase } from "react-native-sqlite-storage";
import { ScrollView, FlatList } from "react-native-gesture-handler";
let db = openDatabase({ name: "db", createFromLocation: "~quotes.db" });

class DailyQuote extends Component {
  textInputComponents;
  constructor(props) {
    super(props);
    this.state = { quotes: [], id: 0 };
  }
  componentDidMount() {
    db.transaction(tx => {
      // somehow needs an argument, without it, it doesnt work
      // but the argument should be optional
      tx.executeSql("SELECT * FROM quotes where id < 11", [], (tx, results) => {
        var len = results.rows.length;
        var arr = [];
        if (len > 0) {
          for (var i = 0; i < 10; i++) {
            arr.push(results.rows.item(i).quote);
          }
          this.setState({ quotes: arr, id: 10 });
        }
      });
    });
  }

  addQuotes() {
    db.transaction(tx => {
      // somehow needs an argument, without it, it doesnt work
      // but the argument should be optional
      tx.executeSql(
        "SELECT * FROM quotes where id <" + (this.state.id + 11) + " AND id >"+ this.state.id,
        [],
        (tx, results) => {
          var len = results.rows.length;
          var arr = [];
          if (len > 0) {
            for (var i = 0; i < 10; i++) {
              arr.push(results.rows.item(i).quote);
            }
            this.setState({
              quotes: this.state.quotes.concat(arr),
              id: this.state.id + 10
            });
          console.log(this.state.quotes);
          }
        }
      );
    });
  }

  render() {
    return (
      <FlatList
        data={this.state.quotes}
        renderItem={({ item }) => (
          <Text style={{ borderBottomWidth: 1 }}>{item}</Text>
        )}
        onEndReachedThreshold={0.01}
        onEndReached={() => {
          this.addQuotes(() => console.log(this.state.id));
        }}
      />
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
