﻿function runAll() {
	asyncTest("does setImmediate call the handler", 1, function () {
		function pass() {
			if (timer) clearTimeout(timer);
			ok(true, 'it worked! the handler was called');
			start();		
		}
		function fail() {
			ok(false, 'FAILED! the handler was never called');	
			start();		
		}

		var timer = setTimeout(fail, 1000);
		setImmediate(pass);
	});

	asyncTest("does setImmediate call the handler WITH one argument", 1, function () {
		var timer;
		function pass(abc) {
			if (timer) {clearTimeout(timer);}
			if (abc === "abc") {
				ok(true, 'it worked! the handler was called with the correct arguments');
			} else {
				ok(false, 'the handler was called but the arguments were incorrect');
			}
			start();		
		}
		setImmediate(pass, "abc");
	});

	asyncTest("does setImmediate call the handler WITH two arguments", 1, function () {
		var timer;
		function pass(abc, num) {
			if (timer) {clearTimeout(timer);}
			if (abc === "abc" && num === 123) {
				ok(true, 'it worked! the handler was called with the correct arguments');
			} else {
				ok(false, 'the handler was called but the arguments were incorrect');
			}
			start();		
		}
		setImmediate(pass, "abc", 123);
	});

	asyncTest("does clearImmediate clear a setImmediate that was just set", 1, function () {
		function pass() {
			if (timer) clearTimeout(timer);
			ok(false, 'FAILED! the handler was called');	
			start();		
		}
		function fail() {
			start();
			ok(true, 'it worked! the handler was correctly never called');
		}

		var timer = setTimeout(fail, 1000);
		var handle = setImmediate(pass);
		clearImmediate(handle);
	});
			
	asyncTest("does clearImmediate clear a non-sequential setImmediate", 2, function () {

		var y = 1;

		function pass(x) {
			switch (x) {
			case 1:
				strictEqual(y, 1, "setImmediate(pass, 1)");
				break;
			case 2:
				ok(false, 'oops! should not be here. x={0} y={1}'.format(x,y));
				break;
			case 3:
				strictEqual(y, 2, "setImmediate(pass, 3)");
				start();
				break;
			}
			y++;
		}

		setImmediate(pass, 1);
		var handle = setImmediate(pass, 2);
		clearImmediate(handle);
		setImmediate(pass, 3);
	});
}
