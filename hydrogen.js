(function(undefined) {
    'use strict';

    var h, // public functions
        hasModule = (typeof exports !== 'undefined');

    function extend(target, props) {
        for(var key in props) {
            if (props.hasOwnProperty(key)) {
                target[key] = props[key];
            }
        }
    }

    function instantiate(obj, args) {
        function F() {
            return obj.apply(this, args);
        }
        F.prototype = obj.prototype;
        return new F();
    }

    h = {

        create: function (Obj, arg1, arg2) {
            var SuperObj,
                superInst,
                props;
            if (undefined === arg2) {
                props = arg1;
            } else {
                SuperObj = arg1;
                props = arg2;
            }

            if (SuperObj) {
                if ('function' === typeof SuperObj.makeInst) {
                    superInst = SuperObj.makeInst();
                } else {
                    superInst = new SuperObj();
                }
                Obj.prototype = superInst;
                Obj.prototype.super = {
                    constructor: SuperObj
                };
            }

            extend(Obj.prototype, props);

            Obj.makeInst = function makeInst() {
                return instantiate(Obj, arguments);
            };

            return h;
        },

        attach: function(Obj, closure) {
            if ('function' !== typeof closure) {
                throw new Error('closure is of type ' + (typeof closure) + ', expected to be a function');
            }

            Obj.makeInst = function makeInst() {
                var instance = instantiate(Obj, arguments);

                var closureProps = closure.call(instance);
                extend(instance, closureProps);

                return instance;
            };

            return h;
        }
    };

    if (hasModule) {
        module.exports = h;
    } else {
        this.h = h;
    }

}).call(this);