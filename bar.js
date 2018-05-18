import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Animated, TouchableWithoutFeedback} from 'react-native'

const {Provider: OriginProvider, Consumer: OriginConsumer} = React.createContext('foo');
const {Provider: TargetProvider, Consumer: TargetConsumer} = React.createContext('bar');

class Bar extends React.PureComponent {

  state = {
    origin: {},
    originStyle: {},
  };

  _onOriginMeasure = (layout, style) => {
    this.setState({
      origin: layout,
      reveal: true,
      originStyle: style,
    })
  };

  _onClose = () => {
    this.setState({reveal: false})
  };


  render() {

    const {children, style} = this.props;

    const {
      reveal,
      originStyle,
      origin,
    } = this.state;

    console.log('state', this.state);

    return (
      <TargetProvider value={{
        reveal,
        origin,
        originStyle,
        onClose: this._onClose,
      }}>
        <OriginProvider value={{
          onReveal: this._onOriginMeasure,
          reveal: reveal,
        }}>
          <View
            style={[
              {flex: 1},
              style
            ]}
          >
            {
              React.Children.map(children, (child) => {
                // if (child.type === Origin) {
                //   return React.cloneElement(child, {
                //     onReveal: this._onOriginMeasure,
                //     reveal,
                //   })
                // if (child.type === Target) {
                //   return React.cloneElement(child, {
                //     // onMeasure: this._onTargetLayout,
                //     origin,
                //     originStyle,
                //     reveal,
                //   })
                // }
                return child
              })
            }}
          </View>
        </OriginProvider>
      </TargetProvider>
    )
  }
}


class Origin extends React.PureComponent {

  reveal() {
    this.ref.measure((x, y, width, height, pageX, pageY, foo) => {
      const measure = {
        x,
        y,
        width,
        height,
        pageX,
        pageY,
        foo,
      };
      this.props.onReveal(measure, this.props.style)
    });
  }

  render() {
    const {children, style, reveal, ...props} = this.props;

    return (
      <View
        style={[
          style,
          {opacity: reveal ? 0 : 1}
        ]}
        {...props}
      >
        {
          React.cloneElement(children, {
            ref: ref => this.ref = ref
          })
        }
      </View>
    )
  }
}

class Foo extends React.PureComponent {

  reveal() {
    this.ref.reveal();
  }

  render() {
    const {children, style} = this.props;

    return (
      <OriginConsumer>
        {
          (context) => (
            <Origin
              ref={ref => this.ref = ref}
              style={style}
              {...context}
            >
              {children}
            </Origin>
          )
        }
      </OriginConsumer>

    )
  }
}

class Baz extends React.PureComponent {

  render() {
    const {children, ...props} = this.props;

    return (
      <TargetConsumer>
        {
          (context) => (
            <Target
              {...props}
              {...context}
            >
              {children}
            </Target>
          )
        }
      </TargetConsumer>
    )
  }
}

class Target extends React.Component {

  animation = new Animated.Value(0);
  shadow = new Animated.Value(0);
  duration: 5000;

  state = {
    layout: {},
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.reveal && this.props.reveal) {
      this._showTarget()
    } else if (prevProps.reveal && !this.props.reveal) {
      this._hideTarget()
    }
  }

  _hideTarget = () => {
    const {onClose} = this.props;

    Animated.parallel([
      Animated.timing(this.animation, {
        toValue: 0,
        duration: this.duration,
      }),
      Animated.timing(this.shadow, {
        toValue: 0,
        duration: this.duration,
      })
    ]).start(onClose);
  }

  _showTarget() {
    Animated.sequence([
      Animated.timing(this.shadow, {
        toValue: 1,
        duration: this.duration,
      }),
      Animated.timing(this.animation, {
        toValue: 1,
        duration: this.duration,
      }),
    ]).start();
  }

  onLayout = (event) => {
    this.setState({layout: event.nativeEvent.layout})
  };

  render() {
    const {origin = {}, originStyle = {}, children, style, contentContainerStyle, reveal} = this.props;
    const {layout} = this.state;

    const _style = StyleSheet.flatten([contentContainerStyle, style]);
    const _targetStyle = StyleSheet.flatten(contentContainerStyle);
    const _originStyle = StyleSheet.flatten(originStyle);

    const marginLeft = _style.marginLeft || _style.marginHorizontal || _style.margin || 0;
    const marginTop = _style.marginTop || _style.marginVertical || _style.margin || 0;

    const targetShadow = {
      opacity: _targetStyle.shadowOpacity || 0,
      offset: _targetStyle.shadowOffset || {height: 0, width: 0},
      elevation: _targetStyle.elevation || 0,
      color: _targetStyle.shadowColor || 'transparent',
      radius: _targetStyle.shadowRadius || 0,
    };

    const originShadow = {
      opacity: _originStyle.shadowOpacity || 0,
      offset: _originStyle.shadowOffset || {height: 0, width: 0},
      elevation: _originStyle.elevation || 0,
      color: _originStyle.shadowColor || 'transparent',
      radius: _originStyle.shadowRadius || 0,
    };

    const height = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.height, layout.height],
    });

    const width = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.width, layout.width],
    });

    const leftInterpolator = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.pageX - marginLeft, layout.x],
    });

    const yInterpolator = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.pageY - marginTop, layout.y],
    });

    const borderRadiusInterpolator = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [_originStyle.borderRadius || 0, _targetStyle.borderRadius || 0],
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

    const shadowColorInterpolator = this.shadow.interpolate({
      inputRange: [0, 1],
      outputRange: [originShadow.color, targetShadow.color]
    });

    const elevationInterpolator = this.shadow.interpolate({
      inputRange: [0, 1],
      outputRange: [originShadow.elevation, targetShadow.elevation],
    });


    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={reveal ? 'auto' : 'none'}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            style,
          ]}
        >
          {/* for parent resizing */}
          <View
            style={{opacity: 0}}
            onLayout={this.onLayout}
          >
            {children}
          </View>
        </View>
        <TouchableWithoutFeedback
          style={StyleSheet.absoluteFill}
          onPress={this._hideTarget}
        >
          <View style={[{flex: 1}, style]}>
            {/* the actual view to animate*/}
            <Animated.View
              pointerEvents={'none'}
              style={[
                contentContainerStyle,
                {
                  position: 'absolute',
                  opacity: reveal ? 1 : 0,

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
                },
              ]}
            >
              <Animated.View
                style={[
                  {
                    height,
                    width,
                    overflow: 'hidden',
                    borderRadius: borderRadiusInterpolator,
                  }
                ]}
              >
                {children}
              </Animated.View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

}

Bar.Origin = Foo;
Bar.Target = Baz;

export default Bar
