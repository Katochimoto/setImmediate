import context from './context';

let nextId = 1;
let lock = false;
const TASKS = {};

export function wrap (handler) {
  const args = Array.prototype.slice.call(arguments, 1);
  const len = args.length;

  return do {
    if (!len) {
      () => handler.call(undefined);
    } else if (len === 1) {
      () => handler.call(undefined, args[0]);
    } else if (len === 2) {
      () => handler.call(undefined, args[0], args[1]);
    } else if (len === 3) {
      () => handler.call(undefined, args[0], args[1], args[2]);
    } else {
      () => handler.apply(undefined, args);
    }
  };
}

export function create (args) {
  TASKS[ nextId ] = wrap.apply(undefined, args);
  return nextId++;
}

export function clear (handleId) {
  delete TASKS[ handleId ];
}

export function run (handleId) {
  if (lock) {
    context.setTimeout( wrap( run, handleId ), 0 );

  } else {
    const task = TASKS[ handleId ];

    if (task) {
      lock = true;

      try {
        task();

      } finally {
        clear( handleId );
        lock = false;
      }
    }
  }
}
