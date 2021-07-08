#
# Simple Makefile
#

PROJECT = cl-js

VERSION = $(shell jq .version codemeta.json)

BRANCH = $(shell git branch | grep "* " | cut -d\   -f 2)

build: scripts/CL.js 

scripts/CL.js: .FORCE
	cat scripts/CL-core.js scripts/CL-ui.js scripts/CL-feeds.js scripts/CL-feeds-ui.js scripts/CL-doi-media.js > scripts/CL.js
	./mk-website.py

lint:
	jshint scripts/CL-core.js
	jshint scripts/CL-ui.js
	jshint scripts/CL-feeds.js
	jshint scripts/CL-feeds-ui.js
	jshint scripts/CL-doi-media.js
	jshint scripts/CL-feeds-lunr.js


status:
	git status

save:
	if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

clean:
	if [ -f scripts/CL.js ]; then rm scripts/CL.js; fi
	if [ -d dist ]; then rm -fR dist; fi

dist/webbrowser: build
	mkdir -p dist
	cp -vR scripts dist/
	cd dist && zip -r $(PROJECT)-$(VERSION)-webbrowser.zip *.md scripts/* gallery/*


distribute_docs:
	mkdir -p dist/gallery
	cp -v README.md dist/
	cp -v LICENSE dist/
	cp -v CHANGES.md dist/
	if [ -f INSTALL.md ]; then cp -v INSTALL.md dist/; fi
	cp -v CONTRIBUTING.md dist/
	cp -v CODE_OF_CONDUCT.md dist/
	cp -vR gallery/* dist/gallery/

release: clean website distribute_docs dist/webbrowser

deployment: clean build
	mkdir -p dist/htdocs/scripts/
	cp -vR scripts/*.js dist/htdocs/scripts/
	cp -vR scripts/*.md dist/htdocs/scripts/
	if [ -f dist/htdocs/scripts/nav.md ]; then rm dist/htdocs/scripts/nav.md; fi
	cd dist && zip -r $(PROJECT)-$(VERSION)-deployment.zip htdocs/scripts/*

website:
	./mk-website.py

publish:
	./mk-website.py
	./publish.bash

.FORCE:
