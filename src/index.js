var context = require('./context');
var useNative = require('./useNative');
var Timer = require('./timer');
var setTimeoutPolifill = require('./polifill/setTimeout');
var polifills = [
    require('./polifill/nextTick'),
    require('./polifill/postMessage'),
    require('./polifill/messageChannel'),
    require('./polifill/readyStateChange'),
    require('./polifill/image')
];
var setImmediate;
var clearImmediate;

if (useNative()) {
    setImmediate = context.setImmediate ||
        context.msSetImmediate ||
        usePolifill(polifills, setTimeoutPolifill);

    clearImmediate = context.clearImmediate ||
        context.msClearImmediate ||
        Timer.clear;

} else {
    setImmediate = setTimeoutPolifill.init();
    clearImmediate = Timer.clear;
}

exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;

exports.msSetImmediate = setImmediate;
exports.msClearImmediate = clearImmediate;

function usePolifill(polifills, def) {
    for (var i = 0; i < polifills.length; i++) {
        var polifill = polifills[ i ];
        if (polifill.canUse()) {
            return polifill.init();
        }
    }

    return def.init();
}
