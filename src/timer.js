var context = require('./context');
var nextId = 1;
var tasks = {};
var lock = false;

function wrap(handler) {
    var args = Array.prototype.slice.call(arguments, 1);
    var fn;
    switch (args.length){
        case 0:
            fn = function() {
                handler.call(undefined);
            };
            break;
        case 1:
            fn = function() {
                handler.call(undefined, args[0]);
            };
            break;
        case 2:
            fn = function() {
                handler.call(undefined, args[0], args[1]);
            };
            break;
        case 3:
            fn = function() {
                handler.call(undefined, args[0], args[1], args[2]);
            };
            break;
        default: fn = function() {
            handler.apply(undefined, args);
        };
    }
    return fn;
}

function create(args) {
    tasks[ nextId ] = wrap.apply(undefined, args);
    return nextId++;
}

function clear(handleId) {
    delete tasks[ handleId ];
}

function run(handleId) {
    if (lock) {
        context.setTimeout( wrap( run, handleId ), 0 );

    } else {
        var task = tasks[ handleId ];

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

exports.run = run;
exports.wrap = wrap;
exports.create = create;
exports.clear = clear;
