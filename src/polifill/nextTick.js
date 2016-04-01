var context = require('../context');
var Timer = require('../timer');

exports.init = function() {
    var polifill = function() {
        var handleId = Timer.create(arguments);
        context.process.nextTick( Timer.wrap( Timer.run, handleId ) );
        return handleId;
    };
    polifill.usePolifill = 'nextTick';
    return polifill;
};

// Don't get fooled by e.g. browserify environments.
// For Node.js before 0.9
exports.canUse = function() {
    return (Object.prototype.toString.call(context.process) === '[object process]');
};
