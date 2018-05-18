import React from 'react';
import PropTypes from 'prop-types';
import { OriginConsumer } from './expandableContent';
import { View, TouchableOpacity } from 'react-native';

class Origin extends React.PureComponent {

  state = {
    context: {},
  };

  reveal() {
    this.ref.measure((x, y, width, height, pageX, pageY) => {
      const measure = {
        x,
        y,
        width,
        height,
        pageX,
        pageY,
      };
      this.state.context.onReveal(
        measure,
        this.props.style,
        this.props.id,
      );
    });
  }

  _onPress = () => {
    this.props.onPress();
    this.reveal();
  };

  render() {
    const { children, style, id, ...props } = this.props;
    const { context: { reveal, originId } }       = this.state;

    return (
      <View
        style={ [
          style,
          { opacity: reveal && originId === id ? 0 : 1 },
        ] }
      >
        <OriginConsumer>
          { (context) => this.setState({ context }) }
        </OriginConsumer>
        <TouchableOpacity
          ref={ ref => this.ref = ref }
          { ...props }
          onPress={ this._onPress }
        >
          { children }
        </TouchableOpacity>
      </View>
    );
  }
}

Origin.propTypes = {
  style: PropTypes.any,
  id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
};

export default Origin;
