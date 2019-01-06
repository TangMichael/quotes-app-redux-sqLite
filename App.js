import React, { Component } from "react";
import { createStore } from "redux";
import Favorites from "./src/containers/favorites/favorites";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import DisplayDaily from "./src/containers/display-daily/display-daily";
import DisplayQuotes from "./src/containers/display-quotes/display-quotes";
import reducers from "./src/reducers/reducers"
import { Provider } from 'react-redux';
var PushNotification = require('react-native-push-notification');

export const TabNavigator = createBottomTabNavigator({
  Quote: {
    screen: DisplayQuotes,
    // navigationOptions: () => ({
    //   title: 'LOL',
    //   activeColor: '#f0edf6',
    //   headerStyle: {backgroundColor: 'red'},
    //   headerBackTitle: null
    // }),
  },
  Daily: {
    screen: DisplayDaily,
  },
  Favorites: {
    screen: Favorites
  }
},{
  tabBarOptions:{
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
    tabStyle:{paddingBottom:10,}
  }
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
