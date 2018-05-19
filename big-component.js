import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

class BigComponent extends React.PureComponent {

  render() {
    const {image, title, trail, body} = this.props;

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
        <View style={{flex: 1, backgroundColor: '#dddee2', padding: 8}}>
          <Text style={{marginBottom: 4, fontSize: 18, fontWeight: 'bold'}}>
            {'Super powers'}
          </Text>
          {
            trail.map((text) => (
              <Text
                key={text}
                style={{
                  fontSize: 11,
                  marginLeft: 8,
                }}
              >
                {'• '}{text}
              </Text>
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
  },
  body: {
    flex: 1,
    marginTop: 8,
  },

});

export default BigComponent;
