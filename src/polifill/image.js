'use strict';

var context = require('../context');
var Timer = require('../timer');

exports.init = function() {
    var polifill = function() {
        var handleId = Timer.create(arguments);
        var img = new context.Image();
        img.onload = img.onerror = Timer.wrap( Timer.run, handleId );
        img.src = '';

        return handleId;
    };
    polifill.usePolifill = 'image';
    return polifill;
};

exports.canUse = function() {
    return Boolean(context.window && context.Image);
};
