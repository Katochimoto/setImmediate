(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.immediate = factory());
}(this, (function () { 'use strict';

var context = (function () {
  /* eslint no-eval: 0 */
  return this || (1, eval)('this');
})();

// @see http://codeforhire.com/2013/09/21/setimmediate-and-messagechannel-broken-on-internet-explorer-10/
var useNative = (function () {
  return !(context.navigator && /Trident|Edge/.test(context.navigator.userAgent));
})();

var nextId = 1;
var lock = false;
var TASKS = {};

function wrap(handler) {
  var args = Array.prototype.slice.call(arguments, 1);
  var len = args.length;

  return !len ? function () {
    return handler.call(undefined);
  } : len === 1 ? function () {
    return handler.call(undefined, args[0]);
  } : len === 2 ? function () {
    return handler.call(undefined, args[0], args[1]);
  } : len === 3 ? function () {
    return handler.call(undefined, args[0], args[1], args[2]);
  } : function () {
    return handler.apply(undefined, args);
  };
}

function create(args) {
  TASKS[nextId] = wrap.apply(undefined, args);
  return nextId++;
}

function clear(handleId) {
  delete TASKS[handleId];
}

function run(handleId) {
  if (lock) {
    context.setTimeout(wrap(run, handleId), 0);
  } else {
    var task = TASKS[handleId];

    if (task) {
      lock = true;

      try {
        task();
      } finally {
        clear(handleId);
        lock = false;
      }
    }
  }
}

function init() {
  var polifill = function polifill() {
    var handleId = create(arguments);
    context.setTimeout(wrap(run, handleId), 0);
    return handleId;
  };

  polifill.usePolifill = 'setTimeout';

  return polifill;
}

function canUse() {
  return 'setTimeout' in context;
}

var setTimeoutPolifill = Object.freeze({
	init: init,
	canUse: canUse
});

function init$1() {
  var polifill = function polifill() {
    var handleId = create(arguments);
    context.process.nextTick(wrap(run, handleId));
    return handleId;
  };

  polifill.usePolifill = 'nextTick';

  return polifill;
}

// Don't get fooled by e.g. browserify environments.
// For Node.js before 0.9
function canUse$1() {
  return Object.prototype.toString.call(context.process) === '[object process]';
}

var nextTickPolifill = Object.freeze({
	init: init$1,
	canUse: canUse$1
});

function init$2() {
  var messagePrefix = 'setImmediate$' + Math.random() + '$';

  var onGlobalMessage = function onGlobalMessage(event) {
    if (event.source === context && typeof event.data === 'string' && event.data.indexOf(messagePrefix) === 0) {

      run(Number(event.data.slice(messagePrefix.length)));
    }
  };

  if (context.addEventListener) {
    context.addEventListener('message', onGlobalMessage, false);
  } else {
    context.attachEvent('onmessage', onGlobalMessage);
  }

  var polifill = function polifill() {
    var handleId = create(arguments);
    context.postMessage(messagePrefix + handleId, '*');
    return handleId;
  };

  polifill.usePolifill = 'postMessage';

  return polifill;
}

// For non-IE10 modern browsers
function canUse$2() {
  if (context.importScripts || !context.postMessage) {
    return false;
  }

  if (context.navigator && /Chrome/.test(context.navigator.userAgent)) {
    //skip this method due to heavy minor GC on heavy use.
    return false;
  }

  var asynch = true;
  var oldOnMessage = context.onmessage;
  context.onmessage = function () {
    asynch = false;
  };

  context.postMessage('', '*');
  context.onmessage = oldOnMessage;
  return asynch;
}

var postMessagePolifill = Object.freeze({
	init: init$2,
	canUse: canUse$2
});

function init$3() {
  var channel = new context.MessageChannel();

  channel.port1.onmessage = function (event) {
    run(Number(event.data));
  };

  var polifill = function polifill() {
    var handleId = create(arguments);
    channel.port2.postMessage(handleId);
    return handleId;
  };

  polifill.usePolifill = 'messageChannel';

  return polifill;
}

// For web workers, where supported
function canUse$3() {
  return Boolean(context.MessageChannel);
}

var messageChannelPolifill = Object.freeze({
	init: init$3,
	canUse: canUse$3
});

function init$4() {
  var html = context.document.documentElement;

  var polifill = function polifill() {
    var handleId = create(arguments);
    var script = context.document.createElement('script');

    script.onreadystatechange = function () {
      run(handleId);
      script.onreadystatechange = null;
      html.removeChild(script);
      script = null;
    };

    html.appendChild(script);
    return handleId;
  };

  polifill.usePolifill = 'readyStateChange';

  return polifill;
}

// For IE 6–8
function canUse$4() {
  return context.document && 'onreadystatechange' in context.document.createElement('script');
}

var readyStateChangePolifill = Object.freeze({
	init: init$4,
	canUse: canUse$4
});

var POLIFILLS = [nextTickPolifill, postMessagePolifill, messageChannelPolifill, readyStateChangePolifill];

var setImmediate = useNative ? context.setImmediate || context.msSetImmediate || usePolifill(POLIFILLS, setTimeoutPolifill) : init();

var clearImmediate = useNative ? context.clearImmediate || context.msClearImmediate || clear : clear;

function polifill() {
  if (context.setImmediate !== setImmediate) {
    context.setImmediate = setImmediate;
    context.msSetImmediate = setImmediate;
    context.clearImmediate = clearImmediate;
    context.msClearImmediate = clearImmediate;
  }
}

function usePolifill(list, def) {
  for (var i = 0; i < list.length; i++) {
    var _polifill = list[i];
    if (_polifill.canUse()) {
      return _polifill.init();
    }
  }

  return def.init();
}

var index = {
  setImmediate: setImmediate,
  clearImmediate: clearImmediate,
  polifill: polifill
};

return index;

})));
//# sourceMappingURL=setImmediate.js.map
