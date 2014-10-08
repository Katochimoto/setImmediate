/* global global, handleManager */

handleManager.implementation.postMessage = function() {
    // Installs an event handler on `global` for the `message` event: see
    // * https://developer.mozilla.org/en/DOM/window.postMessage
    // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

    var messagePrefix = 'setImmediate$' + Math.random() + '$';
    var onGlobalMessage = function(event) {
        if (event.source === global &&
            typeof(event.data) === 'string' &&
            event.data.indexOf(messagePrefix) === 0) {

            handleManager.runIfPresent(Number(event.data.slice(messagePrefix.length)));
        }
    };

    if (global.addEventListener) {
        global.addEventListener('message', onGlobalMessage, false);

    } else {
        global.attachEvent('onmessage', onGlobalMessage);
    }

    return function() {
        var handleId = handleManager.register(arguments);
        global.postMessage(messagePrefix + handleId, '*');
        return handleId;
    };
};
