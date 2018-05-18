import React from 'react';
import { TargetConsumer } from './expandableContent';
import { View, StyleSheet, Animated, TouchableWithoutFeedback, Modal } from 'react-native';

class TargetWrapper extends React.PureComponent {

  render() {
    const { children, ...props } = this.props;

    return (
      <TargetConsumer>
        {
          (context) => (
            <Target
              { ...props }
              { ...context }
            >
              { children }
            </Target>
          )
        }
      </TargetConsumer>
    );
  }
}

class Target extends React.Component {

  animation = new Animated.Value(0);
  shadow    = new Animated.Value(0);
  duration  = 300;

  state = {
    layout: {},
    visible: false,
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.reveal && this.props.reveal) {
      this._showTarget();
    } else if (prevProps.reveal && !this.props.reveal) {
      this._hideTarget();
    }
  }

  _hideTarget = () => {
    const { onClose } = this.props;

    Animated.parallel([
      Animated.timing(this.animation, {
        toValue: 0,
        duration: this.duration,
      }),
      Animated.timing(this.shadow, {
        toValue: 0,
        duration: this.duration,
      })
    ]).start(() => {
      onClose();
      this.setState({ visible: false });
    });

  };

  _showTarget() {
    this.setState({ visible: true });

    Animated.sequence([
      Animated.timing(this.shadow, {
        toValue: 1,
        duration: this.duration,
      }),
      Animated.spring(this.animation, {
        toValue: 1,
        // duration: this.duration,
      }),
    ]).start();
  }

  onLayout = (event) => {
    this.setState({ layout: event.nativeEvent.layout });
  };

  render() {
    const { origin = {}, originStyle = {}, children, style, contentContainerStyle, verticalOffset = 0 } = this.props;
    const { layout, visible }                                                                       = this.state;

    // const _style       = StyleSheet.flatten([ contentContainerStyle, style ]);
    const _targetStyle = StyleSheet.flatten(contentContainerStyle);
    const _originStyle = StyleSheet.flatten(originStyle);

    // const marginLeft = _style.marginLeft || _style.marginHorizontal || _style.margin || 0;
    // const marginTop  = _style.marginTop || _style.marginVertical || _style.margin || 0;

    const targetShadow = {
      opacity: _targetStyle.shadowOpacity || 0,
      offset: _targetStyle.shadowOffset || { height: 0, width: 0 },
      elevation: _targetStyle.elevation || 0,
      color: _targetStyle.shadowColor || 'transparent',
      radius: _targetStyle.shadowRadius || 0,
    };

    const originShadow = {
      opacity: _originStyle.shadowOpacity || 0,
      offset: _originStyle.shadowOffset || { height: 0, width: 0 },
      elevation: _originStyle.elevation || 0,
      color: _originStyle.shadowColor || 'transparent',
      radius: _originStyle.shadowRadius || 0,
    };

    const height = this.animation.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ origin.height, layout.height ],
    });

    const width = this.animation.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ origin.width, layout.width ],
    });

    const leftInterpolator = this.animation.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ origin.pageX, layout.x ],
    });

    const yInterpolator = this.animation.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ origin.pageY - verticalOffset, layout.y ],
    });

    const borderRadiusInterpolator = this.animation.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ _originStyle.borderRadius || 0, _targetStyle.borderRadius || 0 ],
    });

    const shadowOpacityInterpolator = this.shadow.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ originShadow.opacity, targetShadow.opacity ],
    });

    const shadowHeightInterpolator = this.shadow.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ originShadow.offset.height, targetShadow.offset.height ],
    });

    const shadowWidthInterpolator = this.shadow.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ originShadow.offset.width, targetShadow.offset.width ],
    });

    const shadowRadiusInterpolator = this.shadow.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ originShadow.radius, targetShadow.radius ],
    });

    const shadowColorInterpolator = this.shadow.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ originShadow.color, targetShadow.color ]
    });

    const elevationInterpolator = this.shadow.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ originShadow.elevation, targetShadow.elevation ],
    });


    return (
      <Modal
        visible={ visible }
        animationType={ 'none' }
        transparent={ true }
        onRequestClose={ this._hideTarget }
      >
        <View
          style={ StyleSheet.absoluteFill }
          // pointerEvents={ reveal ? 'auto' : 'none' }
        >
          <View
            style={ [
              StyleSheet.absoluteFill,
              style,
            ] }
          >
            { /* for parent resizing */ }
            <View
              style={ [ { opacity: 0 }, contentContainerStyle ] }
              onLayout={ this.onLayout }
            >
              { children }
            </View>
          </View>
          <TouchableWithoutFeedback
            style={ StyleSheet.absoluteFill }
            onPress={ this._hideTarget }
          >
            <View style={ { flex: 1 } }>

              <Animated.View
                style={ [
                  // contentContainerStyle,
                  {
                    position: 'absolute',

                    left: leftInterpolator,
                    top: yInterpolator,
                    shadowOpacity: shadowOpacityInterpolator,
                    shadowOffset: {
                      height: shadowHeightInterpolator,
                      width: shadowWidthInterpolator,
                    },
                    shadowColor: shadowColorInterpolator,
                    shadowRadius: shadowRadiusInterpolator,
                    elevation: elevationInterpolator,
                    // elevation: 4,
                    borderRadius: _targetStyle.borderRadius,
                    // borderWidth: 1,
                  },
                ] }
              >
                <Animated.View
                  style={ [
                    {
                      height,
                      width,
                      overflow: 'hidden',
                      borderRadius: borderRadiusInterpolator,
                      backgroundColor: _targetStyle.backgroundColor,
                    }
                  ] }
                >
                  { children }
                </Animated.View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  }
}


export default TargetWrapper;
