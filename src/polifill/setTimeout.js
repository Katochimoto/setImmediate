var context = require('../context');
var Timer = require('../timer');

exports.init = function() {
    var polifill = function() {
        var handleId = Timer.create(arguments);
        context.setTimeout( Timer.wrap( Timer.run, handleId ), 0 );
        return handleId;
    };
    polifill.usePolifill = 'setTimeout';
    return polifill;
};

exports.canUse = function() {
    return true;
};
