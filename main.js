'use strict';

var React = require('react'),
    Reflux = require('reflux'),
    Event = require('itsa-event'),
    DEFAULT_FUNCTIONS = {},
    NOOP = function() {},
    patchRefluxActions, patchSetState, createdActions, refluxStateChange, defineDefaultFunction, listener;

patchRefluxActions = function() {
    var originalCreateActions = Reflux.createActions;
    Reflux.createActions = function(actions) {
        (typeof actions==='string') && (actions=[actions]);
        Array.isArray(actions) || (actions=[]);
        (actions.indexOf('stateChange')===-1) && actions.push('stateChange');
        createdActions = originalCreateActions(actions);
        return createdActions;
    };
};

defineDefaultFunction = function(emitter, defaultFn) {
    Event.defineEvent(emitter+':stateChange').defaultFn(defaultFn);
};

/**
 * we are going to patch React, so that any component its 'setState' method will go through Event's defaultFunc.
 * Because React.Component.prototype gets merged inside 'react' and later on -during construction- gets merged into
 * the new Component, we need to redefine Component.setState AFTER it is defined (for every instance)
*/
patchSetState = function() {
    var originalCreateClass = React.createClass;
    React.createClass = function() {
        var component = originalCreateClass.apply(React, arguments),
            originalSetState = component.prototype.setState;
        component.prototype.setState = function (partialState, callback) {
            var instance = this,
                payload = {
                    partialState: partialState,
                    callback: callback
                },
                displayName = instance.displayName || 'reactcomponent',
                defFn, changed, keys;
            defFn = function(e) {
                originalSetState.call(instance, e.partialState, e.callback);
            };
            if (!DEFAULT_FUNCTIONS[displayName]) {
                defineDefaultFunction(displayName, defFn);
                DEFAULT_FUNCTIONS[displayName] = true;
            }
            keys = Object.keys(partialState);
            keys.some(function(key) {
                changed = (instance.state[key]!==partialState[key]);
                return changed;
            });
            changed && Event.emit(instance, displayName+':stateChange', payload);
        };
        return component;
    };
};

patchRefluxActions();
patchSetState();

listener = Event.after('*:stateChange', function(e) {
    createdActions && createdActions.stateChange(e.target, e.partialState);
});

refluxStateChange = {
    destroy: listener.detach,
    freeze: {
        freezeState: function() {
            var instance = this;
            instance._freezeEvt = Event.before('*:stateChange', function(e) {
                var componentDomNode = React.findDOMNode(instance),
                    targetNode = React.findDOMNode(e.target);
                if ((targetNode===componentDomNode) || (componentDomNode.contains(targetNode))) {
                    e.halt();
                }
            });
        },
        unfreezeState: function() {
            var instance = this;
            if (instance._freezeEvt) {
                instance._freezeEvt.detach();
                delete instance._freezeEvt;
            }
        },
        componentWillUnmount: function() {
            this.unfreezeState();
            this.setState = NOOP; // prevent anything to happen when invoked
        }
    }
};

module.exports = refluxStateChange;
