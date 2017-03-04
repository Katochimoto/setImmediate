import context from './context';
import useNative from './useNative';
import * as Timer from './timer';
import * as setTimeoutPolifill from './polifill/setTimeout';
import * as nextTickPolifill from './polifill/nextTick';
import * as postMessagePolifill from './polifill/postMessage';
import * as messageChannelPolifill from './polifill/messageChannel';
import * as readyStateChangePolifill from './polifill/readyStateChange';

const POLIFILLS = [
  nextTickPolifill,
  postMessagePolifill,
  messageChannelPolifill,
  readyStateChangePolifill
];

const setImmediate = do {
  if (useNative) {
    context.setImmediate || context.msSetImmediate || usePolifill(POLIFILLS, setTimeoutPolifill);
  } else {
    setTimeoutPolifill.init();
  }
};

const clearImmediate = do {
  if (useNative) {
    context.clearImmediate || context.msClearImmediate || Timer.clear;
  } else {
    Timer.clear;
  }
};

function polifill () {
  if (context.setImmediate !== setImmediate) {
    context.setImmediate = setImmediate;
    context.msSetImmediate = setImmediate;
    context.clearImmediate = clearImmediate;
    context.msClearImmediate = clearImmediate;
  }
}

function usePolifill (list, def) {
  for (let i = 0; i < list.length; i++) {
    const polifill = list[ i ];
    if (polifill.canUse()) {
      return polifill.init();
    }
  }

  return def.init();
}

export default {
  setImmediate,
  clearImmediate,
  polifill
};
