# hydrogen

A minimal library for object-oriented JavaScript development.

[![Build Status](https://travis-ci.org/pixelsandbytes/hydrogen.png?branch=master)](https://travis-ci.org/pixelsandbytes/hydrogen)

## How To Use

### Node.js

    var h = require('path/to/hydrogen.js');

### Browser

    <script type="text/javascript" src="path/to/hydrogen.js"></script>

## Usage Examples
See [sample/index.html](blob/master/sample/index.html) for the examples below plus a few more.

### Inheritance
`h.create()` can be used to create a prototypical object, or extend one prototypical object from another.

    function Character(name, mediumName, otherName) {
        this.name = name;
        this.mediumName = mediumName;
        this.otherName = otherName;
    }
    h.create(Character, {
        getDescription: function() {
            return this.getName() + ' is from "' + this.mediumName + '"';
        },
        getName: function() {
            if (this.otherName) {
                return this.name + ' (a.k.a. ' + this.otherName + ')';
            } else {
                return this.name;
            }
        }
    });

    function Villain(name, mediumName, otherName, wearsMask) {
        this.super.constructor.call(this, name, mediumName, otherName);
        this.wearsMask = wearsMask;
    }
    h.create(Villain, Character, {
        getDescription: function() {
            return this.getName() + ' is from "' + this.mediumName + '". Mwahahaha!';
        }
    });

    var mcclane = Character.makeInst('John McClane', 'Die Hard');
    mcclane.name; // John McClane
    mcclane.getDescription(); // John McClane is from "Die Hard"
    var vader = Villain.makeInst('Darth Vader', 'Star Wars', 'Anakin Skywalker', true);
    vader.getDescription(); // Darth Vader (a.k.a. Anakin Skywalker) is from "Star Wars". Mwahahaha!

### Private Variables
`h.attach()` adds a closure to an object, which can be used to contain private variables and functions.

    function Weapon(name) {
        this.name = name;
    }
    h.attach(Weapon, function() {
        var users = [];

        return {
            addUser: function(user) {
                users.push(user);
            },
            getUsers: function() {
                return users;
            }
        };
    });

    var bullwhip = Weapon.makeInst('Bullwhip');
    bullwhip.users; // undefined
    bullwhip.addUser('Indiana Jones');
    bullwhip.addUser('Catwoman');
    bullwhip.getUsers(); // Indiana Jones,Catwoman

Properties returned by attached closure can be overridden in a child object via either `h.create()` or `h.attach()`. See [sample/index.html](blob/master/sample/index.html) for examples.