import context from '../context';
import * as Timer from '../timer';

export function init() {
  const polifill = function () {
    const handleId = Timer.create(arguments);
    context.setTimeout( Timer.wrap( Timer.run, handleId ), 0 );
    return handleId;
  };

  polifill.usePolifill = 'setTimeout';

  return polifill;
};

export function canUse() {
  return ('setTimeout' in context);
};
