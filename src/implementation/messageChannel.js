/* global handleManager */

handleManager.implementation.messageChannel = function() {
    var channel = new MessageChannel();

    channel.port1.onmessage = function(event) {
        var handle = event.data;
        handleManager.runIfPresent(handle);
    };

    return function() {
        var handleId = handleManager.register(arguments);
        channel.port2.postMessage(handleId);
        return handleId;
    };
};
