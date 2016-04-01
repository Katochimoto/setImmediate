var context = require('../context');
var Timer = require('../timer');

exports.init = function() {
    var channel = new context.MessageChannel();

    channel.port1.onmessage = function(event) {
        Timer.run(Number(event.data));
    };

    var polifill = function() {
        var handleId = Timer.create(arguments);
        channel.port2.postMessage(handleId);
        return handleId;
    };
    polifill.usePolifill = 'messageChannel';
    return polifill;
};

// For web workers, where supported
exports.canUse = function() {
    return Boolean(context.MessageChannel);
};
