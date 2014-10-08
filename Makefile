src_js := $(shell find src -type f -name "*.js")

all: node_modules \
    setImmediate.js \
    setImmediate.min.js

node_modules: package.json
	npm install
	touch node_modules

test: node_modules
	./node_modules/.bin/jshint .
	./node_modules/.bin/jscs .
	./node_modules/karma/bin/karma start --single-run --browsers PhantomJS

clean:
	rm -f setImmediate.js
	rm -f setImmediate.min.js

setImmediate.js: node_modules $(src_js)
	./node_modules/.bin/borschik -m no -i src/setImmediate.js > setImmediate.js

setImmediate.min.js: setImmediate.js
	./node_modules/.bin/borschik -i setImmediate.js -o setImmediate.min.js


.PHONY: all test clean
