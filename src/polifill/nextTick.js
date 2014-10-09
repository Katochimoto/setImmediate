/* global global, Timer */

Timer.polifill.nextTick = function() {
    return function() {
        var handleId = Timer.create(arguments);
        global.process.nextTick( Timer.wrap( Timer.run, handleId ) );
        return handleId;
    };
};
