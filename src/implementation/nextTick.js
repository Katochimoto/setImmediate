/* global global, handleManager */

handleManager.implementation.nextTick = function() {
    return function() {
        var handleId = handleManager.register(arguments);
        global.process.nextTick( handleManager.partiallyApplied( handleManager.runIfPresent, handleId ) );
        return handleId;
    };
};
