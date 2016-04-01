var context = require('../context');
var Timer = require('../timer');

exports.init = function() {
    var html = context.document.documentElement;
    var polifill = function() {
        var handleId = Timer.create(arguments);
        var script = context.document.createElement('script');

        script.onreadystatechange = function() {
            Timer.run(handleId);
            script.onreadystatechange = null;
            html.removeChild(script);
            script = null;
        };

        html.appendChild(script);
        return handleId;
    };

    polifill.usePolifill = 'readyStateChange';
    return polifill;
};

// For IE 6–8
exports.canUse = function() {
    return (context.document && ('onreadystatechange' in context.document.createElement('script')));
};
