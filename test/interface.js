/* jshint unused: false */
var path =      require('path'),
    should =    require('should'),
    h =         require(path.resolve(__dirname, '../lib/hydrogen.js'));

/* global describe, before, it */
describe('#checkImpl', function() {
    'use strict';

    describe('Interface for a string', function() {
        var strDef;

        before(function() {
            strDef = {
                type: 'string'
            };
        });

        it('should match an empty string', function() {
            var str = '';
            h.checkImpl(str, strDef).should.equal(true);
        });

        it('should match a non-empty string', function() {
            var str = 'foo';
            h.checkImpl(str, strDef).should.equal(true);
        });

        it('should not match an object', function() {
            var notStr = {};
            h.checkImpl(notStr, strDef).should.be.a('string');
        });
    });

    describe('Interface for a number', function() {
        var numDef;

        before(function() {
            numDef = {
                type: 'number'
            };
        });

        it('should match a decimal number', function() {
            var num = 3.14;
            h.checkImpl(num, numDef).should.equal(true);
        });

        it('should match a negative integer', function() {
            var num = -1;
            h.checkImpl(num, numDef).should.equal(true);
        });

        it('should not match null', function() {
            var notNum = null;
            h.checkImpl(notNum, numDef).should.be.a('string');
        });
    });

    describe('Interface for a function with min. 2 parameters', function() {
        var funcDef;

        before(function() {
            funcDef = {
                type: 'function',
                minArity: 2
            };
        });

        it('should match a function that accepts 2 parameters', function() {
            function func(a, b) {}
            h.checkImpl(func, funcDef).should.equal(true);
        });

        it('should match a function that accepts 4 parameters', function() {
            function func(a, b, c, d) {}
            h.checkImpl(func, funcDef).should.equal(true);
        });

        it('should not match a function that accepts 1 parameter', function() {
            function func(a) {}
            h.checkImpl(func, funcDef).should.be.a('string');
        });

        it('should not match an object', function() {
            var notFunc = {};
            h.checkImpl(notFunc, funcDef).should.be.a('string');
        });

        it('should not match a string', function() {
            var notFunc = 'foo';
            h.checkImpl(notFunc, funcDef).should.be.a('string');
        });

    });

    describe('Interface for an object with no public properties', function() {
        var objDef;

        before(function() {
            objDef = {
                type: 'object',
                contents: {}
            };
        });

        it('should match an empty object', function() {
            var obj = {};
            h.checkImpl(obj, objDef).should.equal(true);
        });

        it('should match an array', function() {
            var obj = ['foo', 'bar'];
            h.checkImpl(obj, objDef).should.equal(true);
        });

        it('should match an instance with public properties', function() {
            function Class() {}
            h.create(Class, {
                a: {}
            });
            var obj = Class.makeInst();
            h.checkImpl(obj, objDef).should.equal(true);
        });

        it('should not match a function', function() {
            var notObj = function() {};
            h.checkImpl(notObj, objDef).should.be.a('string');
        });

        it('should not match a string', function() {
            var notObj = 'foo';
            h.checkImpl(notObj, objDef).should.be.a('string');
        });

    });

    describe('Interface for an object with public properties', function() {
        var objDef;

        before(function() {
            objDef = {
                type: 'object',
                contents: {
                    foo: {
                        type: 'object',
                        contents: {
                            baz: {
                                type: 'string'
                            }
                        }
                    },
                    bar: {
                        type: 'function',
                        minArity: 2
                    }
                }
            };
        });

        it('should match an object with exact same public properties', function() {
            var obj = {
                foo: {
                    baz: 'bacon'
                },
                bar: function(a, b) {}
            };
            h.checkImpl(obj, objDef).should.equal(true);
        });

        it('should match an object with same public properties plus more', function() {
            var obj = {
                foo: {
                    baz: 'bacon',
                    woo: {}
                },
                bar: function(a, b, c) {},
                bacon: 'ipsum'
            };
            h.checkImpl(obj, objDef).should.equal(true);
        });

        it('should match an instance with same public properties plus more', function() {
            function Class() {}
            h.create(Class, {
                foo: {
                    baz: 'bacon',
                    woo: {}
                },
                bar: function(a, b, c) {},
                bacon: 'ipsum'
            });
            var obj = Class.makeInst();
            h.checkImpl(obj, objDef).should.equal(true);
        });

        it('should not match an array', function() {
            var notObj = [];
            h.checkImpl(notObj, objDef).should.be.a('string');
        });

        it('should not match an object with mismatches at the top level', function() {
            var notObj = {
                foo: function() {},
                bar: function(a, b) {}
            };
            h.checkImpl(notObj, objDef).should.be.a('string');
        });

        it('should not match an object with mismatches at the top level', function() {
            var notObj = {
                foo: {
                    baz: 'bacon'
                },
                bar: function(a) {}
            };
            h.checkImpl(notObj, objDef).should.be.a('string');
        });

        it('should not match an object with mismatches at the leaf level', function() {
            var notObj = {
                foo: {
                    baz: 0
                },
                bar: function(a, b) {}
            };
            h.checkImpl(notObj, objDef).should.be.a('string');
        });

    });

});