import React from 'react';
import { View } from 'react-native';

const { Provider: OriginProvider, Consumer: OriginConsumer } = React.createContext('foo');
const { Provider: TargetProvider, Consumer: TargetConsumer } = React.createContext('bar');

import Origin from './origin';
import Target from './target';

export {
  TargetConsumer,
  OriginConsumer,
};

class ExpandableContent extends React.PureComponent {

  state = {
    origin: {},
    originStyle: {},
    reveal: false,
  };

  _onOriginMeasure = (layout, style, id) => {
    this.setState({
      origin: layout,
      reveal: true,
      originStyle: style,
      originId: id,
    });
  };

  _onClose = () => {
    this.setState({ reveal: false });
  };


  render() {

    const { children, style } = this.props;

    const {
            reveal,
            originStyle,
            origin,
            originId,
          } = this.state;

    console.log('state', this.state);

    return (
      <TargetProvider
        value={ {
          reveal,
          origin,
          originStyle,
          onClose: this._onClose,
        } }
      >
        <OriginProvider
          value={ {
            onReveal: this._onOriginMeasure,
            reveal: reveal,
            originId,
          } }
        >
          { children }
        </OriginProvider>
      </TargetProvider>
    );
  }
}


ExpandableContent.Origin = Origin;
ExpandableContent.Target = Target;

export default ExpandableContent;
