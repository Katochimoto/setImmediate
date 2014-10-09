/* global global, Timer */

Timer.polifill.postMessage = function() {
    var messagePrefix = 'setImmediate$' + Math.random() + '$';

    var onGlobalMessage = function(event) {
        if (event.source === global &&
            typeof(event.data) === 'string' &&
            event.data.indexOf(messagePrefix) === 0) {

            Timer.run(Number(event.data.slice(messagePrefix.length)));
        }
    };

    if (global.addEventListener) {
        global.addEventListener('message', onGlobalMessage, false);

    } else {
        global.attachEvent('onmessage', onGlobalMessage);
    }

    return function() {
        var handleId = Timer.create(arguments);
        global.postMessage(messagePrefix + handleId, '*');
        return handleId;
    };
};
