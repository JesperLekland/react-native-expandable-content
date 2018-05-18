/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import ExpandableContent from 'react-native-expandable-content';
import SmallComponent from './small-component';
import BigComponent from './big-component';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
  'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
});

const IDIOTS = [
  {
    id: 'trump',
    image: 'https://pmcdeadline2.files.wordpress.com/2018/02/trump.jpg?w=446&h=299&crop=1',
    title: 'I\'m so awesome, me gonna build very tall wall',
    trail: [
      'Me so awesome',
      'Me the biggest',
      'Me the bestest',
    ],
  },
  {
    id: 'Kim Jong Un',
    image: 'https://media.newyorker.com/photos/5a7db87056b75c08a3e5b183/master/w_727,c_limit/Borowitz-Trumps-Worst-Hair-Day.jpg',
    title: 'Much nuke such dictator',
    trail: [
      'You quite',
      'You honor',
      'You no go internet',
    ],
  }
];

export default class App extends Component<Props> {

  state = {
    expanded: false,
    idiot: {},
  };

  onClick = (number) => {
    this[ `origin${number}` ].reveal();
  };

  render() {
    const { idiot } = this.state;
    return (
      <ExpandableContent
        style={{flex: 1, justifyContent: 'center'}}
      >
        <StatusBar
          translucent={ true }
          backgroundColor={ 'transparent' }
        />
        <ScrollView contentContainerStyle={{paddingTop: 300}}>
          { IDIOTS.map(idiot => (
            <ExpandableContent.Origin
              key={ idiot.id }
              id={ idiot.id }
              style={ styles.origin }
              onPress={ () => this.setState({ idiot }) }
            >
              <SmallComponent
                image={ idiot.image }
                title={ idiot.title }
              />
            </ExpandableContent.Origin>

          )) }
        </ScrollView>
        <ExpandableContent.Target
          style={ { justifyContent: 'center' } }
          contentContainerStyle={styles.target}
          verticalOffset={ Platform.OS === 'android' ? StatusBar.currentHeight : 0 }
        >
          <BigComponent
            { ...idiot }
          />
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
    backgroundColor: 'white',
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
