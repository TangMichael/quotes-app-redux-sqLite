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
let db = openDatabase({ name: "newdb", createFromLocation: "~quotes.db" });
import Snackbar from "react-native-snackbar";

class DailyQuote extends Component {
  textInputComponents;
  constructor(props) {
    super(props);
    this.state = { quotes: [], id: 0, initial: true };
  }
  componentDidMount() {
    db.transaction(tx => {
      // used to delete favorites db if error occurs while handling the db
      // tx.executeSql("DELETE FROM favorites", [], (tx, results)=>{
      //   console.log("deleted favs");
      // })
      // somehow needs an argument, without it, it doesnt work
      // but the argument should be optional
      tx.executeSql("SELECT * FROM quotes where id < 11", [], (tx, results) => {
        var len = results.rows.length;
        var arr = [];
        if (len > 0) {
          for (var i = 0; i < 10; i++) {
            arr.push({
              id: results.rows.item(i).id,
              quote: results.rows.item(i).quote
            });
          }
          this.setState({ quotes: arr, id: 10 });
        }
      });
      // fill the app state with favorites quotes
      tx.executeSql("SELECT * FROM favorites", [], (tx, results) => {
        console.log("ok");
        this.setState({ initial: true });
        var len = results.rows.length;
        if (len > 0) {
          for (var i = 0; i < len; i++) {
            this.props.addFavorites(
              {
                id: results.rows.item(i).id,
                quote: results.rows.item(i).quote
              },
              true
            );
          }
        }
      });
    });
  }

  addQuotes() {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM quotes where id <" +
          (this.state.id + 11) +
          " AND id >" +
          this.state.id,
        [],
        (tx, results) => {
          var len = results.rows.length;
          var arr = [];
          if (len > 0) {
            // add 10 new quotes to the array
            for (var i = 0; i < 10; i++) {
              arr.push({
                id: results.rows.item(i).id,
                quote: results.rows.item(i).quote
              });
            }
            // set local state for quick view/rerender
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
          <Text
            onPress={() =>{
              var x = false;
              this.props.favorites.some(element => {
                if (element.id === item.id) {
                  x = true;
                }
              });
              if(!x){
                this.props.addFavorites(item)
              } else{
                Snackbar.show({
                  title: "Quote already added to favorites",
                  duration: Snackbar.LENGTH_SHORT
                });
              }
            }
          }
            style={{ borderBottomWidth: 1 }}
          >
            {item.quote}
          </Text>
        )}
        onEndReachedThreshold={0.01} // need this so it keeps redoing onEndReached as we scroll
        onEndReached={() => {
          this.addQuotes(() => console.log(this.state.id));
        }}
      />
    );
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
            (tx, results) => {
              console.log("OK");
            },
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyQuote);
