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

const SUPER_HEROES = [
  {
    id: 'spiderman',
    image: 'https://static.posters.cz/image/750/posters/spider-man-homecoming-hang-i48035.jpg',
    title: 'Spiderman',
    body: 'Spider-Man is a fictional superhero appearing in American comic books published by Marvel Comics. The character was created by writer-editor Stan Lee and writer-artist Steve Ditko, and first appeared in the anthology comic book Amazing Fantasy #15 (August 1962) in the Silver Age of Comic Books',
    trail: [
      'Spider sense',
      'Super-human strength',
      'Spider web',
    ],
  },
  {
    id: 'Iron man',
    image: 'https://vignette.wikia.nocookie.net/maa2/images/8/82/Ironman_CW_two-shot.png/revision/latest?cb=20160503124845',
    title: 'Iron man',
    body: 'A wealthy American business magnate, playboy, and ingenious scientist, Anthony Edward "Tony" Stark suffers a severe chest injury during a kidnapping in which his captors attempt to force him to build a weapon of mass destruction. He instead creates a powered suit of armor to save his life and escape captivity. Later, Stark augments his suit with weapons and other technological devices he designed through his company, Stark Industries.',
    trail: [
      'Super-human healing',
      'Super-human response time',
      'Iron man suit',
    ],
  },
  {
    id: 'Thor',
    image: 'https://vignette.wikia.nocookie.net/avengersalliance2/images/a/a0/Thor_AoU_1_unleash-mjolner.png/revision/latest?cb=20160413193836',
    title: 'Thor',
    body: 'Based on the Norse deity of the same name, is the Asgardian god of thunder and possesses the enchanted hammer Mjolnir, which grants him the ability to fly and manipulate weather amongst his other superhuman attributes.',
    trail: [
      'Strongest of the Asgardians',
      'Almost invulnerable',
      'Can summon the elements of the storm',
    ],
  }

];

export default class App extends Component<Props> {

  state = {
    expanded: false,
    hero: {},
  };

  onClick = (number) => {
    this[ `origin${number}` ].reveal();
  };

  render() {
    const {hero} = this.state;
    return (
      <ExpandableContent
        style={{flex: 1, justifyContent: 'center'}}
      >
        <StatusBar
          translucent={ true }
          backgroundColor={ 'transparent' }
        />
        <ScrollView
          contentContainerStyle={{paddingVertical: 150}}
          showsVerticalScrollIndicator={false}
        >
          {SUPER_HEROES.map(hero => (
            <ExpandableContent.Origin
              key={hero.id}
              id={hero.id}
              style={ styles.origin }
              onPress={() => this.setState({hero})}
            >
              <SmallComponent
                {...hero}
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
            {...hero}
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
    backgroundColor: '#dddee2',
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
