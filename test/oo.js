/* jshint unused: false */
var path =      require('path'),
    should =    require('should'),
    h =         require(path.resolve(__dirname, '../lib/hydrogen.js'));

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

        it('should be instantiable via makeInst()', function() {
            var obj = Base.makeInst();
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

    describe('Simple object with constructor parameters', function() {
        var Base;

        before(function() {
            Base = function(val1, val2) {
                this.val1 = val1;
                this.val2 = val2;
            };
            h.create(Base, {});
        });

        it('should be able to pass parameters on to the constructor when using new', function() {
            var obj = new Base('foo', 'bar');
            obj.val1.should.eql('foo');
            obj.val2.should.eql('bar');
        });

        it('should be able to pass parameters on to the constructor when using makeInst()', function() {
            var obj = Base.makeInst('foo', 'bar');
            obj.val1.should.eql('foo');
            obj.val2.should.eql('bar');
        });
    });

    describe('Multiple instances', function() {
        var Base;

        before(function() {
            Base = function() {};
            h.create(Base, {

                someVar: 'A variable'

            });
        });

        it('should remain separate', function() {
            var obj1 = new Base();
            var obj2 = new Base();
            obj1.someVar = 'foo';
            obj2.someVar = 'bar';
            obj1.someVar.should.eql('foo');
            obj2.someVar.should.eql('bar');
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

    describe('Extend object with constructor parameters', function() {
        var Base, Derived;

        before(function() {
            Base = function(value) {
                this.value = value;
            };
            Derived = function(value) {
                this.super.constructor.call(this, value);
            };
            h.create(Derived, Base, {});
        });

        it('should be able to pass parameters on to the base object constructor', function() {
            var obj = new Derived('foo');
            obj.value.should.eql('foo');
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

    describe('Override properties in extended object', function() {
        var Base, Derived;

        before(function() {
            Base = function() {};
            h.create(Base, {

                someVar: 'A variable',

                anotherVar: 'Another variable',

                someFunc: function() {
                    return 'A function';
                }

            });
            Derived = function() {};
            h.create(Derived, Base, {

                someVar: 'Overridden variable',

                someFunc: function() {
                    return 'Overridden function';
                }

            });
        });

        it('should override properties from parent', function() {
            var obj = new Derived();
            obj.someVar.should.eql('Overridden variable');
            obj.anotherVar.should.eql('Another variable');
            obj.someFunc().should.eql('Overridden function');
        });
    });

    describe('Multiple levels of inheritance', function() {
        var Footwear, Flat, Emmie;

        before(function() {
            Footwear = function() {};
            h.create(Footwear, {
                sole: 'rubber',
                heel: 2,
                material: 'man-made'
            });
            Flat = function() {};
            h.create(Flat, Footwear, {
                heel: 1
            });
            Emmie = function() {};
            h.create(Emmie, Flat, {
                material: 'leather'
            });
        });

        it('should inherit properties from ancestors', function() {
            var coralEmmies = new Emmie();
            coralEmmies.sole.should.eql('rubber');
            coralEmmies.heel.should.eql(1);
            coralEmmies.material.should.eql('leather');
        });
    });

});

describe('#attach', function() {
    'use strict';

    describe('Simple closure', function() {
        var Base;

        before(function() {
            Base = function() {};
            h.attach(Base, function() {
                var privateVar = 'A private variable';

                return {
                    get: function() {
                        return privateVar;
                    },

                    set: function(value) {
                        privateVar = value;
                    }
                };
            });
        });

        it('should add closure to an instance', function() {
            var obj = Base.makeInst();
            obj.get().should.eql('A private variable');
        });

        it('should keep closures separate for separate instances', function() {
            var obj1 = Base.makeInst();
            var obj2 = Base.makeInst();
            obj1.set('foo');
            obj2.set('bar');
            obj1.get().should.eql('foo');
            obj2.get().should.eql('bar');
        });
    });

    describe('Closure containing references to the instance', function() {
        var Base;

        before(function() {
            Base = function() {};
            h.create(Base, {
                someVar: 'A public variable'
            })
            .attach(Base, function() {
                return {
                    get: function() {
                        return this.someVar;
                    }
                };
            });
        });

        it('should be able to access object-level properties', function() {
            var obj = Base.makeInst();
            obj.get().should.eql('A public variable');
        });
    });

    describe('Extend object with closure', function() {
        var Base, Derived;

        before(function() {
            Base = function() {};
            h.create(Base, {})
            .attach(Base, function() {
                var privateVar = 'A private variable';

                return {
                    get: function() {
                        return privateVar;
                    }
                };
            });
            Derived = function() {};
            h.create(Derived, Base, {});
        });

        it('should be able to access properties from parent closure', function() {
            var obj = Derived.makeInst();
            obj.get().should.eql('A private variable');
        });
    });

    describe('Extend object with closure and override in prototype', function() {
        var Base, Derived;

        before(function() {
            Base = function() {};
            h.create(Base, {})
            .attach(Base, function() {
                var privateVar = 'A private variable';

                return {
                    get: function() {
                        return privateVar;
                    }
                };
            });
            Derived = function() {};
            h.create(Derived, Base, {
                get: function() {
                    return 'Overridden get';
                }
            });
        });

        it('should access the overridden property', function() {
            var obj = Derived.makeInst();
            obj.get().should.eql('Overridden get');
        });
    });

    describe('Extend object with closure and override in another closure', function() {
        var Base, Derived;

        before(function() {
            Base = function() {};
            h.create(Base, {})
            .attach(Base, function() {
                var privateVar = 'A private variable';

                return {
                    get: function() {
                        return privateVar;
                    }
                };
            });
            Derived = function() {};
            h.create(Derived, Base, {})
            .attach(Derived, function() {
                var anotherPrivateVar = 'Private variable in override';

                return {
                    get: function() {
                        return anotherPrivateVar;
                    }
                };
            });
        });

        it('should access the overridden property', function() {
            var obj = Derived.makeInst();
            obj.get().should.eql('Private variable in override');
        });
    });

    describe('Closure is not a function', function() {
        var Base;

        before(function() {
            Base = function() {};
        });

        it('should throw an error if closure is undefined', function() {
            var tmp = function() {
                h.attach(function() {});
            };
            tmp.should.throwError();
        });

        it('should throw an error if closure is a string', function() {
            var tmp = function() {
                h.attach(Base, 'Not a function');
            };
            tmp.should.throwError();
        });

        it('should throw an error if closure is null', function() {
            var tmp = function() {
                h.attach(Base, null);
            };
            tmp.should.throwError();
        });
    });

});