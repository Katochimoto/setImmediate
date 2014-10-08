/* jshint -W067 */
/* jshint unused: false */
(function(global, undefined) {
    'use strict';

    if (global.setImmediate) {
        return;
    }

    var doc = global.document;
    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;

    var handleManager = {
        implementation: {},
        nextId: 1,
        tasks: {},
        currentlyRunningATask: false,

        runIfPresent: function(handleId) {
            // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
            // So if we're currently running a task, we'll need to delay this invocation.
            if (handleManager.currentlyRunningATask) {
                // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
                // "too much recursion" error.
                setTimeout( handleManager.partiallyApplied( handleManager.runIfPresent, handleId ), 0 );

            } else {
                var task = handleManager.tasks[ handleId ];

                if (task) {
                    handleManager.currentlyRunningATask = true;

                    try {
                        task();

                    } finally {
                        handleManager.unregister( handleId );
                        handleManager.currentlyRunningATask = false;
                    }
                }
            }
        },

        // This function accepts the same arguments as setImmediate, but
        // returns a function that requires no arguments.
        partiallyApplied: function(handler) {
            var args = slice.call(arguments, 1);

            return function() {
                if (typeof(handler) === 'function') {
                    handler.apply(undefined, args);

                } else {
                    /* jshint -W054 */
                    (new Function(String(handler)))();
                }
            };
        },

        register: function(args) {
            handleManager.tasks[ handleManager.nextId ] = handleManager.partiallyApplied.apply(undefined, args);
            return handleManager.nextId++;
        },

        unregister: function(handleId) {
            delete handleManager.tasks[ handleId ];
        }
    };

    /*! borschik:include:implementation/messageChannel.js */
    /*! borschik:include:implementation/nextTick.js */
    /*! borschik:include:implementation/postMessage.js */
    /*! borschik:include:implementation/readyStateChange.js */
    /*! borschik:include:implementation/setTimeout.js */


    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage('', '*');
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }


    var implementation;

    // Don't get fooled by e.g. browserify environments.
    // For Node.js before 0.9
    if (toString.call(global.process) === '[object process]') {
        implementation = 'nextTick';

    // For non-IE10 modern browsers
    } else if (canUsePostMessage()) {
        implementation = 'postMessage';

    // For web workers, where supported
    } else if (global.MessageChannel) {
        implementation = 'messageChannel';

    // For IE 6–8
    } else if (doc && ('onreadystatechange' in doc.createElement('script'))) {
        implementation = 'readyStateChange';

    // For older browsers
    } else {
        implementation = 'setTimeout';
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = (attachTo && attachTo.setTimeout ? attachTo : global);

    attachTo.setImmediate = handleManager.implementation[ implementation ]();
    attachTo.clearImmediate = handleManager.unregister;

}(function() {
    return this || (1, eval)('this');
}()));
