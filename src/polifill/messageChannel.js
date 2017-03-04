import context from '../context';
import * as Timer from '../timer';

export function init() {
  const channel = new context.MessageChannel();

  channel.port1.onmessage = function (event) {
    Timer.run(Number(event.data));
  };

  const polifill = function () {
    const handleId = Timer.create(arguments);
    channel.port2.postMessage(handleId);
    return handleId;
  };

  polifill.usePolifill = 'messageChannel';

  return polifill;
};

// For web workers, where supported
export function canUse() {
  return Boolean(context.MessageChannel);
};
