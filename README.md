# react-native-expandable-content

![](./expandable-content.gif)

A nice, reusable component for creating expandable, interactive UIs.

The library consists of three components
 * **ExpandableContent**

    The root component that orchestrates the communication between the `Origin` and the `Target`

 * **ExpandableContent.Origin**

    Used to wrap the "small component", adds an `onPress` property that is used to expand to the "big component"

 * **ExpandableContent.Target**

    Used to wrap the "big component", adds all the animation making sure that the "big component" takes the form of the "small component"
    and the morphs into the "big component", and back when closing.

```javascript
return (
      <ExpandableContent>
        <ScrollView>
            <ExpandableContent.Origin>
              <SmallComponent
                {...props}
              />
            </ExpandableContent.Origin>
        </ScrollView>
        <ExpandableContent.Target>
          <BigComponent
            {...props}
          />
        </ExpandableContent.Target>
      </ExpandableContent>
    );
  }
```


The library uses the new React Context API and therefore requires React 16.3.
This allows you to place the `Origin` and `Target` component in any depth of the tree while stile allowing it to communicate properly.

### Caveats

There are some caveats to how you can style your components when using this library,
allowing us to easily measure and morph between the two components. Basically all "external" styles,
e.g shadows, margins etc must be places on the `Target` and `Origin` component, not the component they wrap.
See the [example code](./App.js) for inspiration.

This README is a work in progress but the library itself works just fine

### Known issues
Some flickering might occur in the beginning and the end of the animation,
this is caused by the millisecond when we hide the target and show the origin (and vice versa) and they are rendered in different frames.
we're working on fixing it.



