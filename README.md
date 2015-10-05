# itsa-reflux-statechange
Adds onStateChange to reflux stores which automaticly handles state-changes on any component

##Example
```js
// Important note:
// itsa-reflux-statechange NEEDS to be defined before any components are required!

var React = require('react');
    Reflux = require('reflux'),
    ItsaStateChange = require('itsa-reflux-statechange'),
    actions, store;

actions = Reflux.createActions([
    'one',
    'two',
    'three'
]);
// Note: `itsa-reflux-statechange` made `actions` to become: ['one', 'two', three', 'stateChange']

store = Reflux.createStore({
    listenables: [actions],
    onOne: function() {
        this.trigger({message: 'One triggered'});
    },
    onStateChange: function(component, partialState) {
        // always available, due to `itsa-reflux-statechange`
        console.warn('onStateChange ', component, partialState);
    },
    onTwo: function() {
        this.trigger({message: 'Two triggered'});
    },
    onThree: function() {
        this.trigger({message: 'Three triggered'});
    },
    getInitialState: function() {
        return {message: 'Initial State'};
    }
});

// Mixin `ItsaStateChange.freeze` to be able to freeze any stateChange inside the component
var App = React.createClass({
    mixins: [Reflux.connect(store), ItsaStateChange.freeze],
    render: function() {
        return <h1>{this.state.message}</h1>
    }
});

var app = React.render(<App/>, document.getElementById('container'));

setTimeout(actions.one, 1000); // will be processed
setTimeout(app.freezeState, 2000);
setTimeout(actions.three, 3000); // will *not* be processed, because the state of `app` is frozen
```