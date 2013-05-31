(function(undefined) {
    'use strict';

    var h, // public functions
        hasModule = (typeof module !== 'undefined' && module.exports);

    function extend (target, props) {
        for(var key in props) {
            if (props.hasOwnProperty(key)) {
                target[key] = props[key];
            }
        }
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
                Obj.super = SuperObj;
                if ('function' === typeof SuperObj.makeInst) {
                    superInst = SuperObj.makeInst();
                } else {
                    superInst = new SuperObj();
                }
                Obj.prototype = superInst;
            }

            extend(Obj.prototype, props);

            Obj.makeInst = function makeInst() {
                return new Obj();
            };

            return h;
        },

        attach: function(Obj, closure) {
            Obj.makeInst = function makeInst() {
                var instance = new Obj();

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