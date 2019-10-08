CL-js - A vanilla JavaScript library for Caltech Library projects
=====================================================

This repository provides a vanilla JavaScript library 
used across some of Caltech Library projects including 
[feeds.library.caltech.edu](https://feeds.library.caltech.edu).

[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg?style=flat-square)](https://choosealicense.com/licenses/bsd-3-clause)
[![Latest release](https://img.shields.io/badge/Latest_release-0.1.2-b44e88.svg?style=flat-square)](http://shields.io)


Table of contents
-----------------

* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
* [Known issues and limitations](#known-issues-and-limitations)
* [Getting help](#getting-help)
    * [Gallery](gallery/) examples 
* [Contributing](#contributing)
* [License](#license)
* [Authors and history](#authors-and-history)
* [Acknowledgments](#authors-and-acknowledgments)


Introduction
------------

CL-js provides a lightweight JavaScript library used across several
Caltech Library projects. All functionality is bound to a common CL
object.  This allows it to be used with 3rd party JavaScript 
libraries (e.g. handlebarjs, jQuery) without stepping on their toes.
The core CL object is defined in `CL-core.js`. Additional features
are provided in their own files `CL-us.js`, `CL-feeds.js`, 
`CL-feeds-ui.js`, `CL-fields.js` and `CL-doi-media.js`. 
If you want to used our JavaScript library you should 
references the concatenated version of [CL.js](https://feeds.library.caltech.edu/scripts/CL.js "Production version of CL.js") hosted at
`https://feeds.library.caltech.edu/scripts/CL.js`.

Installation
------------

In your web page include the following script element to access
the **CL** object.

```html
    <script src="https://feeds.library.caltech.edu/scripts/CL.js"></script>
```

If you want a local copy of our library

1. Clone the **cl-js** repository
2. Change to the repository directory
3. Copy [scripts/CL.js](scripts/CL.js) to your website document tree where you store your JavaScript code

Here is an example of installing **cl-js** 
in the `/var/www/htdocs/js` directory.

```bash
    git clone https://github.com/caltechlibrary/cl-js
    cd cl-js
    cp -vR cl-js/scripts/CL.js /var/www/htdocs/js/
```

Usage
-----

The CL-js JavaScript library is targetting evergreen web browser
without requiring build tools beyond simple concatentation and make.
Non-UI elements may run in headless environments like NodeJS
but they is not guaranteed. UI elements require a DOM so will only
run in your web browser unless you are willing to jump some
hurdles.

The recommended approach to using CL-js is to point your script
elements at our production version of `CL.js`.

```html
    <script src="https://feeds.library.caltech.edu/scripts/CL.js"></script>
```

If you want to work on a local copy (e.g. you're adapting, enhancing, 
debugging or customizing our JavaScript library) can also copy the 
JavaScript files into your local web document root.  The library is 
contained in a "scripts" folder in our GitHub repository
for [CL-js](https://github.com/caltechlibrary/cl-js). Copy or symlink
the "scripts" to your web document root. Then you can easily include
the content in your HTML pages.

Using the concatenated version

```html
    <script src="/scripts/CL.js"></script>
```

You can create `CL.js` by concatenating the following 
files `CL-core.js`, `CL-ui.js`, `CL-feeds.js`, `CL-feeds-ui.js`
and `CL-doi-media.js`.


Known issues and limitations
----------------------------

The `CL.js` library is limited to web browser environment
running on evergreen web browser. Because of DOM usage
it is not intended to be used from server side environments
like [NodeJS](https://nodejs.org).


Getting help
------------

If you run into a problem use the [GitHub](https://github.com/caltechlibrary/cl-js/issues) issue tracker for
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

The CL JavaScript object evolved out of our [feeds.library.caltech.edu](https://feeds.library.caltech.edu) aggregation project. It's primary goal
is to provide an easy to use vanilla JavaScript library for working with
Caltech Library services and content.  It was split from the feeds.library.caltech.edu repository into its own repository in the Summer of 2019.

+ R. S. Doiel, <rsdoiel@library.caltech.edu>

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
