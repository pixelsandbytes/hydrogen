# hydrogen

A minimal library for object-oriented JavaScript development.

[![Build Status](https://travis-ci.org/pixelsandbytes/hydrogen.png?branch=master)](https://travis-ci.org/pixelsandbytes/hydrogen)

## How To Use

### Node.js

Add `hydrogen` to your dependencies, then run:

    npm install

Then add:

    var h = require('hydrogen');

### Browser

    <script type="text/javascript" src="path/to/hydrogen.js"></script>

## Usage Examples
See [examples][examples-link] for the ones below plus more.

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

Properties returned by an attached closure can be overridden in a child object via either `h.create()` or `h.attach()`, see [examples][examples-link].

### Checking Interfaces
`h.checkImpl()` checks a value against an "interface" and determines if the value is a valid implementation of the interface.

    var IMovie = {
        type: 'object',
        contents: {
            title: {
                type: 'string'
            },
            details: {
                type: 'object',
                contents: {
                    summary: {type: 'string'},
                    year: {type: 'number'}
                }
            },
            play: {
                type: 'function',
                minArity: 2
            }
        }
    };

    var minorityReport = {
        title: 'Minority Report',
        details: {
            summary: 'In a future where a special police unit is able to arrest murderers before ' +
                'they commit their crimes, an officer from that unit is himself accused of a future murder.',
            year: 2002,
            cast: [
                'Tom Cruise',
                'Colin Farrell',
                'Samantha Morton',
                'Max von Sydow'
            ]
        },
        play: function(startTime, fullScreen, showSubtitles) {}
    };

    var warOfTheWorlds = {
        title: 'War of the Worlds',
        details: {
            summary: 'As Earth is invaded by alien tripod fighting machines, one family fights for survival.',
            year: 2005
        },
        play: function(fullScreen) {}
    };

    h.checkImpl(minorityReport, IMovie); // true
    h.checkImpl(warOfTheWorlds, IMovie); // At key ["play"]: Function does not accept at least 2 parameters

See [examples][examples-link] for more.

[examples-link]: examples/index.html