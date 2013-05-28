/* jshint unused: false */
var path =      require('path'),
    should =    require('should'),
    h =         require(path.resolve(__dirname, '../hydrogen.js'));

/* global describe, before, it */
describe('#create', function() {
    'use strict';

    describe('Simple object', function() {
        var Base;

        before(function() {
            Base = function() {};
            h.create(Base, {});
        });

        it('should be instantiable via new', function() {
            var obj = new Base();
            obj.should.be.an.instanceOf(Base);
        });

        it('should be instantiable via inst()', function() {
            var obj = Base.inst();
            obj.should.be.an.instanceOf(Base);
        });

    });

    describe('Simple object with properties', function() {
        var Base;

        before(function() {
            Base = function() {};
            h.create(Base, {

                someVar: 'A variable',

                someFunc: function() {
                    return 'A function';
                }
            });
        });

        it('instances should have those properties', function() {
            var obj = new Base();
            obj.someVar.should.eql('A variable');
            obj.someFunc().should.eql('A function');
        });

    });

    describe('Extend object', function() {
        var Base, Derived;

        before(function() {
            Base = function() {};
            Derived = function() {};
            h.create(Derived, Base, {});
        });

        it('should be an instance of both the base and derived objects', function() {
            var obj = new Derived();
            obj.should.be.an.instanceOf(Base);
            obj.should.be.an.instanceOf(Derived);
        });
    });

    describe('Extend object with properties', function() {
        var Base, Derived;

        before(function() {
            Base = function() {};
            h.create(Base, {

                someVar: 'A variable',

                someFunc: function() {
                    return 'A function';
                }

            });
            Derived = function() {};
            h.create(Derived, Base, {});
        });

        it('should inherit properties from parent', function() {
            var obj = new Derived();
            obj.someVar.should.eql('A variable');
            obj.someFunc().should.eql('A function');
        });
    });

});