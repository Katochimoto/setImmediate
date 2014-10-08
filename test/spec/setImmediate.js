/* global describe, it, expect, setImmediate, clearImmediate, sinon */
/* jshint strict: false */

describe('setImmediate', function() {

    it('простой вызов', function(done) {
        setImmediate(function() {
            done();
        });
    });

    it('передача аргументов', function(done) {
        setImmediate(function(a, b) {
            expect(a).to.be(1);
            expect(b).to.be('a');
            done();
        }, 1, 'a');
    });

    it('простой вызов', function() {
        var timerId = setImmediate(function() {});
        expect(timerId).to.be.a('number');
        expect(timerId).to.be.above(0);
    });

    it('проверка вызова с задержкой', function(done) {
        var stub = sinon.stub();
        setImmediate(stub);

        setTimeout(function() {
            expect(stub.called).to.be(true);
            done();
        }, 100);
    });

    it('отмена вызова', function(done) {
        var stub = sinon.stub();
        var timerId = setImmediate(stub);
        clearImmediate(timerId);

        setTimeout(function() {
            expect(stub.called).to.be(false);
            done();
        }, 100);
    });

    it('последовательность вызовов', function(done) {
        var called = [];
        var realCalled = [];

        for (var i = 0; i < 100; i++) {
            called.push(i);
        }

        called.forEach(function(n) {
            setImmediate(function() {
                realCalled.push(n);
            });
        });

        setTimeout(function() {
            expect(called.toString()).to.be(realCalled.toString());
            done();
        }, 0);
    });
});
