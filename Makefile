#
# Simple Makefile
#

PROJECT = cl-js

VERSION = $(shell grep -m1 "Version = " scripts/CL-core.js | cut -d\' -f 2)

BRANCH = $(shell git branch | grep "* " | cut -d\   -f 2)

build: scripts/CL.js 

scripts/CL.js: .FORCE
	cat scripts/CL-core.js scripts/CL-feeds.js scripts/CL-feeds-ui.js \
		scripts/CL-fields.js > scripts/CL.js
	./mk-website.py

lint:
	jshint scripts/CL-core.js
	jshint scripts/CL-feeds.js
	jshint scripts/CL-feeds-ui.js
	jshint scripts/CL-fields.js

handlebars: .FORCE
	curl -o scripts/handlebars.js "http://builds.handlebarsjs.com.s3.amazonaws.com/handlebars-v4.1.2.js"

status:
	git status

save:
	if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

clean:
	if [ -f scripts/CL.js ]; then rm scripts/CL.js; fi
	if [ -d dist ]; then rm -fR dist; fi

dist/webbrowser:
	mkdir -p dist
	cp -vR scripts dist/
	cd dist && zip -r $(PROJECT)-$(VERSION)-webbrowser.zip *.md scripts/* examples/*


distribute_docs:
	mkdir -p dist/examples
	cp -v README.md dist/
	cp -v LICENSE dist/
	cp -v CHANGES.md dist/
	cp -v INSTALL.md dist/
	cp -v CONTRIBUTING.md dist/
	cp -v CODE_OF_CONDUCT.md dist/
	cp -vR examples/* dist/examples/

release: clean website distribute_docs dist/webbrowser

website:
	./mk-website.py

publish:
	./mk-website.py
	./publish.bash

.FORCE:
