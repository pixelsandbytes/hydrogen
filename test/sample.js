/* jshint unused: false */
var path =      require('path'),
    should =    require('should'),
    h =         require(path.resolve(__dirname, '../src/hydrogen.js'));

/* global describe, before, it */
describe('Prototype', function() {
    'use strict';

    var mcclane;

    before(function() {
        function Character (name, mediumName, otherName) {
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

        mcclane = Character.makeInst('John McClane', 'Die Hard');
    });

    it('should have a public variable', function() {
        mcclane.name.should.eql('John McClane');
    });

    it('should have a public function', function() {
        mcclane.getDescription().should.eql('John McClane is from "Die Hard"');
    });
});

describe('Inheritance', function() {
    'use strict';

    var vader;

    before(function() {
        function Character (name, mediumName, otherName) {
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
        // Character is defined in the 'Prototype' section
        h.create(Villain, Character, {
            getDescription: function() {
                return this.getName() + ' is from "' + this.mediumName + '". Mwahahaha!';
            }
        });

        vader = Villain.makeInst('Darth Vader', 'Star Wars', 'Anakin Skywalker', true);
    });

    it('should override a public function', function() {
        vader.getDescription().should.eql('Darth Vader (a.k.a. Anakin Skywalker) is from "Star Wars". Mwahahaha!');
    });
});

describe('Private Variables', function() {
    'use strict';

    var bullwhip;

    before(function() {
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

        bullwhip = Weapon.makeInst('Bullwhip');
        bullwhip.addUser('Indiana Jones');
        bullwhip.addUser('Catwoman');
    });

    it('should have a private variable', function() {
        should.not.exist(bullwhip.users);
    });

    it('should be able to access a private variable via a public function', function() {
        bullwhip.getUsers().should.eql(['Indiana Jones', 'Catwoman']);
    });
});

describe('Private Functions', function() {
    'use strict';

    var batmobile, astonMartinDB5;

    before(function() {
        function Vehicle(name, topSpeed) {
            this.name = name;
            this.topSpeed = topSpeed;
        }
        h.create(Vehicle, {
            getDescription: function() {
                return this.name + ' has a top speed of ' + this.topSpeed + ' mph';
            }
        })
        .attach(Vehicle, function() {
            function getRelativeSpeed (me, otherTopSpeed) {
                if (me.topSpeed > otherTopSpeed) {
                    return 'faster than';
                } else if (me.topSpeed < otherTopSpeed) {
                    return 'slower than';
                } else { // this.topSpeed == otherTopSpeed
                    return 'has the same top speed as';
                }
            }

            return {
                compare: function(otherVehicle) {
                    return this.name + ' is ' + getRelativeSpeed(this, otherVehicle.topSpeed) + ' the ' +
                        otherVehicle.name;
                }
            };
        });

        batmobile = Vehicle.makeInst('Batmobile', 330);
        astonMartinDB5 = Vehicle.makeInst('Aston Martin DB5', 143);
    });

    it('should be able to call a public function', function() {
        batmobile.getDescription().should.eql('Batmobile has a top speed of 330 mph');
    });

    it('should be able to call a private function from a public function', function() {
        batmobile.compare(astonMartinDB5).should.eql('Batmobile is faster than the Aston Martin DB5');
    });
});

describe('Overriding Attached Properties', function() {
    'use strict';

    var sherlock, stark;

    before(function() {
        function Hero(name) {
            this.name = name;
        }
        h.attach(Hero, function() {
            var enemies = [];

            return {
                addEnemy: function(enemy) {
                    enemies.push(enemy);
                },
                getEnemies: function() {
                    return enemies;
                },
                getDescription: function() {
                    return this.name + ' is hated by ' + enemies.join(', ');
                }
            };
        });

        function Superhero(name) {
            this.super.constructor.call(this, name);
        }
        h.create(Superhero, Hero, {
            getDescription: function() {
                return this.name + ' is hated by ' + this.getEnemies().join(', ') +
                    '; is also the arch-enemy of ' + this.getSuperEnemies().join(', ');
            }
        })
        .attach(Superhero, function() {
            var parentAddEnemy = this.addEnemy; // Preserve Hero.addEnemy
            var superEnemies = [];

            return {
                addEnemy: function(enemy, isSuperVillain) {
                    if (isSuperVillain) {
                        superEnemies.push(enemy);
                    } else {
                        parentAddEnemy(enemy);
                    }
                },
                getSuperEnemies: function() {
                    return superEnemies;
                }
            };
        });

        sherlock = Hero.makeInst('Sherlock Holmes');
        sherlock.addEnemy('James Moriarty');
        sherlock.addEnemy('Sebastian Moran');
        stark = Superhero.makeInst('Iron Man');
        stark.addEnemy('Mandarin', true);
        stark.addEnemy('Iron Monger', true);
        stark.addEnemy('Justin Hammer');
    });

    it('should be able to call a public function from attached closure', function() {
        sherlock.getDescription().should.eql('Sherlock Holmes is hated by James Moriarty, Sebastian Moran');
    });

    it('should be able to override a public function from attached closure', function() {
        stark.getDescription().should.eql('Iron Man is hated by Justin Hammer; ' +
            'is also the arch-enemy of Mandarin, Iron Monger');
    });
});