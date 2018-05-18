import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

class BigComponent extends React.PureComponent {

  render() {
    const { image, title, trail } = this.props;

    return (
      <View style={ styles.container }>
        <View style={ { flexDirection: 'row' } }>
          <Image
            style={ styles.image }
            source={ { uri: image } }
          />
          <View style={ { padding: 16, backgroundColor: 'white', flex: 1 } }>
            <Text style={ styles.title }>
              { title }
            </Text>
          </View>
        </View>
        <View style={ { flex: 1, backgroundColor: 'white', padding: 16 } }>
          {
            trail.map((text) => (
              <Text key={ text }>{ text }</Text>
            ))
          }
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
  },
  image: {
    height: 160,
    width: 90,
  }
});

export default BigComponent;
