'use strict';

var React = require('react'),
    Reflux = require('reflux'),
    ItsaStateChange = require('../../main.js'),
    actions, store, count;

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
        count++;
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
    getCount: function() {
        return count;
    },
    componentDidMount: function() {
        count = 0;
    },
    render: function() {
console.warn('going to render '+this.state.message);
        return <h1>{this.state.message}</h1>
    }
});

module.exports = {
    App: App,
    actions: actions
};
