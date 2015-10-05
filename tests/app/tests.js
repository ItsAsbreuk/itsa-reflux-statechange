/*global describe, it, beforeEach, afterEach */
/*jshint unused:false */

"use strict";
var expect = require('chai').expect,
    should = require('chai').should(),
    React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    appModule = require('./app.js'),
    App = appModule.App,
    actions = appModule.actions;

describe('Testing Webapp', function () {
    var component;

    beforeEach(function() {
        component = TestUtils.renderIntoDocument(<App />);
    });

    afterEach(function() {
        var domNode = React.findDOMNode(component);
        React.unmountComponentAtNode(domNode);
    });

    it('should display the correct content on initialization', function (done) {
        setTimeout(function() {
            expect(React.findDOMNode(component).textContent).to.be.eql('Initial State');
            expect(component.getCount()).to.be.eql(0);
            done();
        }, 10);
    });

    it('should display the correct content after invoking the one-method', function (done) {
        actions.one();
        setTimeout(function() {
            // expect(React.findDOMNode(component).textContent).to.be.eql('One triggered');
            expect(component.getCount()).to.be.eql(2);
            done();
        }, 10);
    });

    it('should display the correct content after invoking the one-method', function (done) {
        component.freezeState();
        actions.one();
        setTimeout(function() {
            expect(React.findDOMNode(component).textContent).to.be.eql('Initial State');
            expect(component.getCount()).to.be.eql(1);
            done();
        }, 10);
    });


});
