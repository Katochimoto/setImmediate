import lib from '../../src/index';

describe('setImmediate', function() {

    it('простой вызов', function(done) {
        lib.setImmediate(function() {
            done();
        });
    });

    it('передача аргументов', function(done) {
        lib.setImmediate(function(a, b) {
            expect(a).to.equal(1);
            expect(b).to.equal('a');
            done();
        }, 1, 'a');
    });

    it('простой вызов', function() {
        var timerId = lib.setImmediate(function() {});
        expect(timerId).to.be.a('number');
        expect(timerId).to.be.above(0);
    });

    it('проверка вызова с задержкой', function(done) {
        var stub = sinon.stub();
        lib.setImmediate(stub);

        setTimeout(function() {
            expect(stub.called).to.equal(true);
            done();
        }, 100);
    });

    it('отмена вызова', function(done) {
        var stub = sinon.stub();
        var timerId = lib.setImmediate(stub);
        lib.clearImmediate(timerId);

        setTimeout(function() {
            expect(stub.called).to.equal(false);
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
            lib.setImmediate(function() {
                realCalled.push(n);
            });
        });

        setTimeout(function() {
            expect(called.toString()).to.equal(realCalled.toString());
            done();
        }, 0);
    });
});
