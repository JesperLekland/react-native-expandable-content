import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

class SmallComponent extends React.PureComponent {

  render() {
    const {image, title, body} = this.props

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
            <Text
              style={styles.body}
              ellipsizeMode={'tail'}
              numberOfLines={5}
            >
              {body}
            </Text>
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
  },
  image: {
    height: 160,
    width: 90,
  },
  body: {
    flex: 1,
    marginTop: 8,
  },
});

export default SmallComponent;
