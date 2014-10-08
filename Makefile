
all: node_modules

node_modules: package.json
	npm install
	touch node_modules

test: node_modules
	./node_modules/.bin/jshint .
	./node_modules/.bin/jscs .
	./node_modules/karma/bin/karma start --single-run --browsers PhantomJS

.PHONY: all test
