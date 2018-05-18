/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import ExpandableContent from './expandableContent';

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

  onClick = (number) => {
    this[ `origin${number}` ].reveal();
  };

  render() {
    return (
      <ExpandableContent
        style={{flex: 1, justifyContent: 'center'}}
      >
        <StatusBar
          translucent={ true }
          backgroundColor={ 'transparent' }
        />
        <ScrollView contentContainerStyle={{paddingTop: 300}}>
          <ExpandableContent.Origin
            id={'foo'}
            ref={ ref => this.origin1 = ref }
            style={styles.origin}>
            <TouchableOpacity
              style={ { height: 200 } }
              onPress={ () => this.onClick(1) }
            />
          </ExpandableContent.Origin>
          <ExpandableContent.Origin
            ref={ ref => this.origin2 = ref }
            style={ styles.origin }>
            <TouchableOpacity
              style={ { height: 200 } }
              onPress={ () => this.onClick(2) }
            />
          </ExpandableContent.Origin>
        </ScrollView>
        <ExpandableContent.Target
          style={{
            justifyContent: 'center',
            // margin: 10,
          }}
          contentContainerStyle={styles.target}
          verticalOffset={ Platform.OS === 'android' ? StatusBar.currentHeight : 0 }
        >
          <View style={{
            height: 500,
            backgroundColor: 'lightgrey',
          }}/>
        </ExpandableContent.Target>
      </ExpandableContent>
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
    margin: 10,
    shadowOpacity: 0.5,
    shadowColor: 'black',
    shadowOffset: {
      height: 2,
      width: 2,
    },
    shadowRadius: 3,
    borderRadius: 20,
    elevation: 3,
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
    margin: 10,
    elevation: 20,
    backgroundColor: 'lightgrey',
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
