hint:
	@.node_modules/.bin/jshint hydrogen.js test/ --config jshint.json

test:
	@./node_modules/.bin/mocha

.PHONY: hint test