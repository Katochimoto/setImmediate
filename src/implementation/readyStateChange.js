/* global handleManager, doc */

handleManager.implementation.readyStateChange = function() {
    var html = doc.documentElement;

    return function() {
        var handleId = handleManager.register(arguments);
        // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
        // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
        var script = doc.createElement('script');
        script.onreadystatechange = function() {
            handleManager.runIfPresent(handleId);
            script.onreadystatechange = null;
            html.removeChild(script);
            script = null;
        };
        html.appendChild(script);
        return handleId;
    };
};
