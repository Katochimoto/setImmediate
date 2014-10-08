/* global global, Timer */

Timer.polifill.setTimeout = function() {
    return function() {
        var handleId = Timer.create(arguments);
        global.setTimeout( Timer.wrap( Timer.run, handleId ), 0 );
        return handleId;
    };
};
