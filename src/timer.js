'use strict';

var context = require('./context');

var nextId = 1;
var tasks = {};
var lock = false;

function wrap(handler) {
    var args = Array.prototype.slice.call(arguments, 1);

    return function() {
        handler.apply(undefined, args);
    };
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
