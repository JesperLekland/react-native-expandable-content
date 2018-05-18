/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import ExpandableContent from "./foo";
import Bar from "./bar";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
  'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
});

export default class App extends Component<Props> {

  state = {
    expanded: false,
  };

  onClick = () => {
    this.origin.reveal();
  };

  render() {
    return (
      <Bar
        style={{flex: 1, justifyContent: 'center'}}
        expanded={this.state.expanded}
      >
        <ScrollView contentContainerStyle={{paddingTop: 300}}>
          <Bar.Origin
            ref={ref => this.origin = ref}
            style={styles.origin}>
            <TouchableOpacity
              style={{height: 200}}
              onPress={this.onClick}
            />
          </Bar.Origin>
        </ScrollView>
        <Bar.Target
          style={{
            justifyContent: 'center',
            margin: 10,
          }}
          contentContainerStyle={styles.target}
        >
          <View style={{
            height: 500,
          }}/>
        </Bar.Target>
      </Bar>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  origin: {
    marginHorizontal: 10,
    shadowOpacity: 0.5,
    shadowColor: 'black',
    shadowOffset: {
      height: 2,
      width: 2,
    },
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'lightgrey',
  },
  target: {
    shadowOpacity: 0.9,
    shadowColor: 'black',
    shadowRadius: 20,
    shadowOffset: {
      height: 2,
      width: 2,
    },
    backgroundColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
