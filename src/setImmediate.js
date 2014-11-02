/* jshint -W067 */
/* jshint unused: false */
(function(global, undefined) {
    'use strict';

    if (!notUseNative() && (global.msSetImmediate || global.setImmediate)) {
        if (!global.setImmediate) {
            global.setImmediate = global.msSetImmediate;
            global.clearImmediate = global.msClearImmediate;
        }

        return;
    }

    var doc = global.document;
    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;
    var Timer = {};

    Timer.polifill = {};
    Timer.nextId = 1;
    Timer.tasks = {};
    Timer.lock = false;

    Timer.run = function(handleId) {
        if (Timer.lock) {
            global.setTimeout( Timer.wrap( Timer.run, handleId ), 0 );

        } else {
            var task = Timer.tasks[ handleId ];

            if (task) {
                Timer.lock = true;

                try {
                    task();

                } finally {
                    Timer.clear( handleId );
                    Timer.lock = false;
                }
            }
        }
    };

    Timer.wrap = function(handler) {
        var args = slice.call(arguments, 1);

        return function() {
            handler.apply(undefined, args);
        };
    };

    Timer.create = function(args) {
        Timer.tasks[ Timer.nextId ] = Timer.wrap.apply(undefined, args);
        return Timer.nextId++;
    };

    Timer.clear = function(handleId) {
        delete Timer.tasks[ handleId ];
    };

    /*! borschik:include:polifill/messageChannel.js */
    /*! borschik:include:polifill/nextTick.js */
    /*! borschik:include:polifill/postMessage.js */
    /*! borschik:include:polifill/readyStateChange.js */
    /*! borschik:include:polifill/setTimeout.js */



    function canUsePostMessage() {
        if (global.postMessage && !global.importScripts) {
            var asynch = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                asynch = false;
            };
            global.postMessage('', '*');
            global.onmessage = oldOnMessage;
            return asynch;
        }
    }

    function notUseNative() {
        // @see http://codeforhire.com/2013/09/21/setimmediate-and-messagechannel-broken-on-internet-explorer-10/
        return (global.navigator && /Trident/.test(global.navigator.userAgent));
    }


    var polifill;

    if (notUseNative()) {
        polifill = 'setTimeout';

    // Don't get fooled by e.g. browserify environments.
    // For Node.js before 0.9
    } else if (toString.call(global.process) === '[object process]') {
        polifill = 'nextTick';

    // For non-IE10 modern browsers
    } else if (canUsePostMessage()) {
        polifill = 'postMessage';

    // For web workers, where supported
    } else if (global.MessageChannel) {
        polifill = 'messageChannel';

    // For IE 6–8
    } else if (doc && ('onreadystatechange' in doc.createElement('script'))) {
        polifill = 'readyStateChange';

    // For older browsers
    } else {
        polifill = 'setTimeout';
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = (attachTo && attachTo.setTimeout ? attachTo : global);

    attachTo.setImmediate = Timer.polifill[ polifill ]();
    attachTo.setImmediate.usePolifill = polifill;
    attachTo.msSetImmediate = attachTo.setImmediate;

    attachTo.clearImmediate = Timer.clear;
    attachTo.msClearImmediate = Timer.clear;

}(function() {
    return this || (1, eval)('this');
}()));
