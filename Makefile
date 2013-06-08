hint:
	@./node_modules/.bin/jshint src/ test/ --config jshint.json

test:
	@./node_modules/.bin/mocha

release: hint test

.PHONY: hint test release
