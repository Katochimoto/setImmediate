import context from '../context';
import * as Timer from '../timer';

export function init() {
  const messagePrefix = 'setImmediate$' + Math.random() + '$';

  const onGlobalMessage = function (event) {
    if (event.source === context &&
      typeof(event.data) === 'string' &&
      event.data.indexOf(messagePrefix) === 0) {

      Timer.run(Number(event.data.slice(messagePrefix.length)));
    }
  };

  if (context.addEventListener) {
    context.addEventListener('message', onGlobalMessage, false);

  } else {
    context.attachEvent('onmessage', onGlobalMessage);
  }

  const polifill = function () {
    const handleId = Timer.create(arguments);
    context.postMessage(messagePrefix + handleId, '*');
    return handleId;
  };

  polifill.usePolifill = 'postMessage';

  return polifill;
};

// For non-IE10 modern browsers
export function canUse() {
  if (context.importScripts || !context.postMessage) {
    return false;
  }

  if (context.navigator && /Chrome/.test(context.navigator.userAgent)) {
    //skip this method due to heavy minor GC on heavy use.
    return false;
  }

  let asynch = true;
  const oldOnMessage = context.onmessage;
  context.onmessage = function () {
    asynch = false;
  };

  context.postMessage('', '*');
  context.onmessage = oldOnMessage;
  return asynch;
};
