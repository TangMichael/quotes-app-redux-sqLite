import React, { Component } from "react";
import { createStore } from "redux";
import Favorites from "./src/containers/favorites/favorites";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import History from "./src/containers/history/History";
import DailyQuote from "./src/containers/daily-quote/daily-quote";
import reducers from "./src/reducers/reducers"
import { Provider } from 'react-redux'

export const TabNavigator = createBottomTabNavigator({
  Quote: {
    screen: DailyQuote,
    // navigationOptions: () => ({
    //   title: 'LOL',
    //   activeColor: '#f0edf6',
    //   headerStyle: {backgroundColor: 'red'},
    //   headerBackTitle: null
    // }),
  },
  History: {
    screen: History,
  },
  Favorites: {
    screen: Favorites
  }
},{
  activeColor: '#f0edf6',
  inactiveColor: '#3e2465',
  barStyle: { backgroundColor: '#694fad' },
}
);

const App = createAppContainer(TabNavigator);
const store = createStore(reducers);
/* if we want to move from one screen to another,
<Button
        title="Go to History"
        onPress={() => this.props.navigation.navigate('History')}
      />
  */

class Nav extends Component {
  render() {
    return (
      <Provider store={store}>
      <App />
    </Provider>
    );
  }
}
// why won't the program work if I remove export default?
export default Nav;
