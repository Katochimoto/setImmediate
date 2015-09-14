NPM_BIN=$(CURDIR)/node_modules/.bin
export NPM_BIN

src_js := $(shell find src -type f -name "*.js")

all: node_modules dist

node_modules: package.json
	npm install
	touch node_modules

test: node_modules
	$(NPM_BIN)/jshint .
	$(NPM_BIN)/jscs .
	./node_modules/karma/bin/karma start --single-run --browsers PhantomJS

clean:
	rm -rf dist

dist: node_modules $(src_js)
	$(NPM_BIN)/webpack src/index.js dist/setImmediate.js
	$(NPM_BIN)/webpack src/index.js dist/setImmediate.min.js --optimize-minimize
	touch dist

.PHONY: all test clean
