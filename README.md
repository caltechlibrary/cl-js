CL-js - Vanilla JavaScript ESM for Caltech Library metadata
===========================================================

This repository provides a vanilla JavaScript ESM and TypeScript module for integrating Caltech Library metadata and public resources. The production deployment is hosted on Caltech Library's [feeds.library.caltech.edu](https://feeds.library.caltech.edu) website.

[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg?style=flat-square)](https://choosealicense.com/licenses/bsd-3-clause)
[![Latest release](https://img.shields.io/badge/Latest_release-1.0.0-b44e88.svg?style=flat-square)](http://shields.io)


Table of contents
-----------------

* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
* [Known issues and limitations](#known-issues-and-limitations)
* [Getting help](#getting-help)
* [Contributing](#contributing)
* [License](#license)
* [Authors and history](#authors-and-history)
* [Acknowledgments](#authors-and-acknowledgments)


Introduction
------------

CL-js started as a vanilla JavaScript for integrating bibliographic content for CaltechAUTHORS and CaltechTHESIS in Caltech Campus websites. Today CL-js provides TypeScript and JavaScript ESM continuing the original project. It includes support for metadata from CaltechAUTHORS, CaltechTHESIS and CaltechDATA via <https://feeds.library.caltech.edu>. The modules are written and maintained in TypeScript. The TypeScript is [transpiled](https://en.wikipedia.org/wiki/Source-to-source_compiler "source to source translation") to JavaScript using [Deno](https://deno.com)'s [emit](https://jsr.io/@deno/emit) package. TypeScript has been chosen because structured metadata benefits from type safety which JavaScript doesn't provide. The TypeScript modules can be used with Deno.

This project is complementary to [CL-web-components](https://github.com/caltechlibrary/CL-web-components "web components shared between Caltech Library projects"). CL-web-components provides web components for integrating content from Caltech Library.

As of v1 CL-js comes with two modules. [CL-core.ts](CL-core.ts)/[CL-core.js](modules/CL-core.js) and [CL-feeds.ts](CL-feeds.ts)/[CL-feeds.js](modules/CL-feeds.js). CL-core provides the low level transport calls using ES6 promises. CL-feeds extends the object with specific feeds related methods. 

In prior versions of CL-js models like [CL-doi-media.js](scripts/CL-doi-media.js) and [CL-feeds-ui.js](scripts/CL-feeds-ui.js), were provided. This functionality is migrating to the [CL-web-components](https://github.com/caltechlibrary/CL-web-components) project.

CL-js, can be use from a modern web browser that supports ES6 or better JavaScript or from JavaScript/TypeScript run times like Deno.

Here's an example of importing this package into you're JavaScript project.

~~~JavaScript
import { CL } from "https://feeds.library.caltech.edu/modules/CL.js";
import { CLFeeds } from "https://feeds.library.caltech.edu/modules/CL-feeds.js";
~~~

Or in the web page with 

~~~HTML
    <script type="module" src="https://feeds.library.caltech.edu/modules/CL.js"></script>
    <script type="module" src="https://feeds.library.caltech.edu/modules/CL-feeds.js"></script>
~~~

The TypeScript modules can be imported similarly.

~~~JavaScript
import { CL } from "https://feeds.library.caltech.edu/modules/CL-core.ts";
import { CLFeeds } from "https://feeds.library.caltech.edu/modules/CL-feeds.ts";`.
~~~

Installation
------------

If you want a local copy you can download the GitHub repository.

1. Clone the **CL-js** repository
2. Change to the repository directory
3. Copy the desired modules into your website document tree where you store your JavaScript code

Here is an example of installing **CL-js** in the `/var/www/htdocs/js` directory.

```bash
    git clone https://github.com/caltechlibrary/CL-js CL-js
    cd CL-js
    cp -vR modules/CL-*.js /var/www/htdocs/js/
```

The `CL-feeds.js` module imports `CL-core.js` using as a relative import

Usage
-----

The CL-js JavaScript modules target ES6 or better evergreen web browsers. The TypeScript non-UI modules target Deno. UI modules require a browser DOM so are not supported in Deno (other other headless runtime).

The recommended approach to using CL-js is to point your script elements at our production version of `CL-v1.js`.

```html
    <script type="module" src="https://feeds.library.caltech.edu/modules/CL-v1.js"></script>
```

If you want to work on a local copy (e.g. you're adapting, enhancing, debugging or customizing our JavaScript library) can also copy the JavaScript files into your local web document root.  The library is contained in a "scripts" folder in our GitHub repository for [CL-js](https://github.com/caltechlibrary/CL-js). Copy or symbolically link the "modules" to your web document root. Then you can easily include the content in your HTML pages.

You can create a new "CL-v1.js" by running Make in the repository root which will use Deno to convert the TypeScript to JavaScript before copying them into the modules directory.

Known issues and limitations
----------------------------

CL-js is maintained in TypeScript and relies on Deno for conversion to JavaScript. I do not test with NodeJS or provide an NPM version of this library.

If you are contributing a bug fix the fix needs to be implemented in the TypeScript since the JavaScript provided is rendered output from the TypeScript.

Starting with release v1 the [scripts](scripts/) directory content is provided as a legacy implementation of CL-js. It is included for historical reference.

Getting help
------------

If you run into a problems use the [GitHub](https://github.com/caltechlibrary/cl-js/issues) issue tracker for
reports and contact.

Contributing
------------

For information about contributing see [CONTRIBUTING.md](contributing.html)
and [CODE_OF_CONDUCT.md](code-of-conduct.html) in this repository.


License
-------

Software produced by the Caltech Library is Copyright (C) 2019, Caltech.  This software is freely distributed under a BSD/MIT type license.  Please see the [LICENSE](LICENSE) file for more information.


Authors and history
---------------------------

The CL JavaScript object evolved out of our [feeds.library.caltech.edu](https://feeds.library.caltech.edu) aggregation project. It's primary goal is to provide an easy to use vanilla JavaScript library for working with Caltech Library services and content.  It was split from the feeds.library.caltech.edu repository into its own repository in the Summer of 2019.

- R. S. Doiel, <rsdoiel@caltech.edu>

Acknowledgments
---------------

This work was funded by the California Institute of Technology Library.

(If this work was also supported by other organizations, acknowledge them here.  In addition, if your work relies on software libraries, or was inspired by looking at other work, it is appropriate to acknowledge this intellectual debt too.)

<div align="center">
  <br>
  <a href="https://www.caltech.edu">
    <img width="100" height="100" src="assets/caltech-round.svg">
  </a>
</div>
