test:
	mocha test/* --require should --reporter spec --recursive #--grep [VALUE]

watch:
	mocha -w --require should --reporter spec --recursive #--grep [VALUE]

.PHONY: test