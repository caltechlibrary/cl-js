CL-js - A vanilla JavaScript library for Caltech Library projects
=====================================================

This repository provides a vanilla JavaScript library 
used across some of Caltech Library projects including 
[feeds.library.caltech.edu](https://feeds.library.caltech.edu)
and the [And/Or](https://github.com/caltechlibrary/andor) prototype.

[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg?style=flat-square)](https://choosealicense.com/licenses/bsd-3-clause)
[![Latest release](https://img.shields.io/badge/Latest_release-0.1.2-b44e88.svg?style=flat-square)](http://shields.io)


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

CL-js provides a lightweight JavaScript library used across several
Caltech Library projects. All functionality is bound to a common CL
object.  This allows it to be used with 3rd party JavaScript 
libraries (e.g. handlebarjs, jQuery) without stepping on their toes.
The core CL object is defined in `CL-core.js`. Optional features
are privided in their own files (e.g. `CL-feeds.js`, 
`CL-feeds-ui.js`, `CL-fields.js`). A concatenated version of all
the `CL-*.js` files is provided as `CL.js`.

Installation
------------

1. Clone the **cl-js** repository
2. Change to the repository directory
3. Copy [scripts](scripts/) to your website document root

Here is an example of installing **cl-js** and 
Handlebars in `/var/www/htdocs` directory.

```bash
    git clone https://github.com/caltechlibrary/cl-js
    cd cl-js
    cp -vR cl-js/scripts /var/www/htdocs/
```

Usage
-----

The CL-js JavaScript library is targetting evergreen web browser
without requiring build tools beyond simple concatentation and make.
Non-UI elements may run in headless environments like NodeJS
but they is not guaranteed. UI elements require a DOM so will only
run in your web browser unless you are willing to jump some
hurdles.

In your web browser you'll use a script elements like

```html
    <script src="/scripts/cl-core.js"></script>
    <script src="/scripts/cl-ui.js"></script>
    <script src="/scripts/cl-feeds.js"></script>
    <script src="/scripts/cl-feeds-ui.js"></script>
```

Or if you use the concatenated version

```html
    <script src="/scripts/cl.js"></script>
```


Known issues and limitations
----------------------------

The `CL-*.js` library is limited to web browser environment 
running on evergreen web browser. 


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

The CL JavaScript object evolved out of our [feeds.library.caltech.edu](https://feeds.library.caltech.edu) aggregation project. As enhanced vanilla 
JavaScript functions were needed in other projects, some of which
included content from feeds the CL object was extended. It was split
into its own repository during the prototyping of [And/Or](https://github.com/caltechlibrary/andor) in Summer 2019.


Acknowledgments
---------------

This work was funded by the California Institute of Technology Library.

(If this work was also supported by other organizations, acknowledge them here.  In addition, if your work relies on software libraries, or was inspired by looking at other work, it is appropriate to acknowledge this intellectual debt too.)

<div align="center">
  <br>
  <a href="https://www.caltech.edu">
    <img width="100" height="100" src="/assets/caltech-round.svg">
  </a>
</div>
