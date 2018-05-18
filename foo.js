import React from 'react';
import PropTypes from 'prop-types';
import {Animated, Easing, StyleSheet, View} from 'react-native';

// Since this component uses a modal it will automatically show the statusbar on Android
// This will case a miss calculation if the statusbar was previously hidden (because of the changed viewport).
// To make sure this doesn't happen show the statusbar BEFORE opening this modal.
// This behaviour is a bug in React Native but has been recently fixed, although not yet released.
// See link to PR below
// {@link https://github.com/facebook/react-native/commit/076b1cea3563cae30e11d63cc100ceaed9082692}

const {Provider, Consumer} = React.createContext('foo');

class ExpandableContent extends React.PureComponent {

  state = {
    hasMeasuredChild: false,
    target: {},
  };

  translation = new Animated.Value(0);
  size = new Animated.Value(0);
  shadow = new Animated.Value(0);

  componentWillReceiveProps(props) {
    const {visible} = props;
    if (visible && !this.props.visible) {
      this.animate();
    }
  }

  animate() {

    // this.animation.setValue(0);
    Animated.sequence([
      Animated.timing(this.shadow, {
        toValue: 1,
        duration: 300,
      }),
      Animated.parallel([
        Animated.spring(this.size, {
          toValue: 1,
        }),
        Animated.spring(this.translation, {
          toValue: 1,
        }),
      ]),
    ]).start();
  }

  animateBackwards = () => {

    const {onClose} = this.props;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.size, {
          toValue: 0,
          duration: 200,
          easing: Easing.easeInEaseOut,
        }),
        Animated.timing(this.translation, {
          toValue: 0,
          duration: 200,
          easing: Easing.easeInEaseOut,
        }),
      ]),
      Animated.timing(this.shadow, {
        toValue: 0,
        delay: 50,
        easing: Easing.easeInEaseOut,
        duration: 200,
      }),
    ]).start(onClose);
  };

  _onChildLayout = (event) => {
    this.setState({
      hasMeasuredChild: true,
      target: {
        ...event.nativeEvent.layout,
      },
    });
  };

  render() {
    const {
      children,
      style,
      origin = {},
      originStyle = {},
      visible,
      contentContainerStyle,
      verticalOffset,
    } = this.props;

    const childStyles = StyleSheet.flatten(contentContainerStyle) || {};
    const _originStyles = StyleSheet.flatten(originStyle) || {};

    const marginLeft = childStyles.marginLeft || childStyles.marginHorizontal || childStyles.margin || 0;
    const marginTop = childStyles.marginTop || childStyles.marginVertical || childStyles.margin || 0;

    const targetShadow = {
      opacity: childStyles.shadowOpacity || 0,
      offset: childStyles.shadowOffset || {height: 0, width: 0},
      elevation: childStyles.elevation || 0,
      color: childStyles.shadowColor || 'transparent',
      radius: childStyles.shadowRadius || 0,
    };

    const originShadow = {
      opacity: _originStyles.shadowOpacity || 0,
      offset: _originStyles.shadowOffset || {height: 0, width: 0},
      elevation: _originStyles.elevation || 0,
      color: _originStyles.shadowColor || 'transparent',
      radius: _originStyles.shadowRadius || 0,
    };

    const {hasMeasuredChild, target} = this.state;

    const widthInterpolator = this.size.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.width, target.width],
    });

    const heightInterpolator = this.size.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.height, target.height],
    });

    const leftInterpolator = this.translation.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.pageX - marginLeft, target.x - marginLeft],
    });

    const yInterpolator = this.translation.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.pageY - marginTop - verticalOffset, target.y - marginTop],
    });

    const shadowOpacityInterpolator = this.shadow.interpolate({
      inputRange: [0, 1],
      outputRange: [originShadow.opacity, targetShadow.opacity],
    });

    const shadowHeightInterpolator = this.shadow.interpolate({
      inputRange: [0, 1],
      outputRange: [originShadow.offset.height, targetShadow.offset.height],
    });

    const shadowWidthInterpolator = this.shadow.interpolate({
      inputRange: [0, 1],
      outputRange: [originShadow.offset.width, targetShadow.offset.width],
    });

    const shadowRadiusInterpolator = this.shadow.interpolate({
      inputRange: [0, 1],
      outputRange: [originShadow.radius, targetShadow.radius],
    });

    const elevationInterpolator = this.shadow.interpolate({
      inputRange: [0, 1],
      outputRange: [originShadow.elevation, targetShadow.elevation],
    });

    const transformPosition = {
      position: 'absolute',
      top: yInterpolator,
      left: leftInterpolator,
    };

    const transformSize = {
      height: heightInterpolator,
      width: widthInterpolator,
      overflow: 'hidden',
      borderRadius: childStyles.borderRadius,
    };

    return (
      <Provider value={'bar'}>
        <View
          pointerEvents={visible ? 'auto' : 'none'}
          style={[
            StyleSheet.absoluteFill,
            {opacity: visible ? 1 : 0},
            {zIndex: 0},
          ]}
        >
          <View
            style={[{flex: 1}, style]}
            activeOpacity={0.99}
            onPress={this.animateBackwards}
          >
            <View
              style={[
                // dummy view to measure
                StyleSheet.absoluteFillObject,
                style,
                {opacity: 0},
              ]}
            >
              <View
                onLayout={this._onChildLayout}
                style={contentContainerStyle}
              >
                {children}
              </View>
            </View>
            <Animated.View
              style={[
                // opacity: 0 until measurements have been made and animation is started
                {opacity: 0},
                // doesn't render shadow on android without this
                contentContainerStyle,
                hasMeasuredChild && transformPosition,
                hasMeasuredChild && {opacity: 1},
                {
                  shadowOffset: {
                    height: shadowHeightInterpolator,
                    width: shadowWidthInterpolator,
                  },
                  shadowOpacity: shadowOpacityInterpolator,
                  shadowRadius: shadowRadiusInterpolator,
                  elevation: elevationInterpolator,
                },
              ]}
            >
              {/*
             This extra view serves as the "clipper", making sure that the child is clipped as
             we animate the height/width. This needs to be separated from the outer container that handles
             position and shows the shadow (otherwise the shadow would be clipped)
             */}
              <Animated.View style={transformSize}>
                {children}
              </Animated.View>
            </Animated.View>

          </View>
        </View>
      </Provider>
    );
  }

}

// eslint-disable-next-line react/no-multi-comp
class Origin extends React.PureComponent {

  onLayout = () => {
    const {onMeasure, id} = this.props;
    this.ref.measure((x, y, width, height, pageX, pageY, foo) => {
      const layout = {
        x,
        y,
        width,
        height,
        pageX,
        pageY,
        foo,
      };
      onMeasure(layout, id);
    });
  };

  render() {
    const {style, children} = this.props;
    return (
      <Consumer>
        {value => {
          return (<Text>
            {'value ' + value}
          </Text>)
        }}
        {children}
      </Consumer>
    );
  }

}

Origin.propTypes = {
  id: PropTypes.string,
  style: PropTypes.any,
  onMeasure: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

ExpandableContent.Origin = Origin;

ExpandableContent.propTypes = {
  children: PropTypes.node.isRequired,
  origin: PropTypes.shape({
    pageX: PropTypes.number.isRequired,
    pageY: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
  style: PropTypes.any,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  // might be needed on Android to offset the statusbar
  verticalOffset: PropTypes.number,
  contentContainerStyle: PropTypes.any,
  debug: PropTypes.bool,
};

ExpandableContent.defaultProps = {
  visible: false,
  verticalOffset: 0,
};

export default ExpandableContent;


