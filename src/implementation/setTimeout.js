/* global handleManager */

handleManager.implementation.setTimeout = function() {
    return function() {
        var handleId = handleManager.register(arguments);
        setTimeout( handleManager.partiallyApplied( handleManager.runIfPresent, handleId ), 0 );
        return handleId;
    };
};
