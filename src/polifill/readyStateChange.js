/* global Timer, doc */

Timer.polifill.readyStateChange = function() {
    var html = doc.documentElement;

    return function() {
        var handleId = Timer.create(arguments);
        var script = doc.createElement('script');

        script.onreadystatechange = function() {
            Timer.run(handleId);
            script.onreadystatechange = null;
            html.removeChild(script);
            script = null;
        };

        html.appendChild(script);

        return handleId;
    };
};
