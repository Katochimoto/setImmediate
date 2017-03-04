import context from '../context';
import * as Timer from '../timer';

export function init() {
  const polifill = function () {
    const handleId = Timer.create(arguments);
    context.process.nextTick( Timer.wrap( Timer.run, handleId ) );
    return handleId;
  };

  polifill.usePolifill = 'nextTick';

  return polifill;
};

// Don't get fooled by e.g. browserify environments.
// For Node.js before 0.9
export function canUse() {
  return (Object.prototype.toString.call(context.process) === '[object process]');
};
