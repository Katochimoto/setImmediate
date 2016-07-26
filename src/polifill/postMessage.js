var context = require('../context');
var Timer = require('../timer');

exports.init = function() {
    var messagePrefix = 'setImmediate$' + Math.random() + '$';

    var onGlobalMessage = function(event) {
        if (event.source === context &&
            typeof(event.data) === 'string' &&
            event.data.indexOf(messagePrefix) === 0) {

            Timer.run(Number(event.data.slice(messagePrefix.length)));
        }
    };

    if (context.addEventListener) {
        context.addEventListener('message', onGlobalMessage, false);

    } else {
        context.attachEvent('onmessage', onGlobalMessage);
    }

    var polifill = function() {
        var handleId = Timer.create(arguments);
        context.postMessage(messagePrefix + handleId, '*');
        return handleId;
    };
    polifill.usePolifill = 'postMessage';
    return polifill;
};

// For non-IE10 modern browsers
exports.canUse = function() {
    if (context.importScripts || !context.postMessage) {
        return false;
    }
    if (ontext.navigator && /Chrome/.test(context.navigator.userAgent)) {
        //skip this method due to heavy minor GC on heavy use.
        return false;
    }

    var asynch = true;
    var oldOnMessage = context.onmessage;
    context.onmessage = function() {
        asynch = false;
    };

    context.postMessage('', '*');
    context.onmessage = oldOnMessage;
    return asynch;
};
