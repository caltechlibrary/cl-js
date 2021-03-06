
# CL-js 

Below are the javascript files that form **cl-js** library. 

## Individually

[CL-core.js](CL-core.js)
: forms the first part of the CL.js library. Core focuses on the low level plumbing of retrieving and pipelining data for processing. 

[CL-ui.js](CL-ui.js)
: provides functions for generating ui elements as well as a simple handlebars-like template substitution scheme for describing HTML elements. E.g. a template string of `"<input value="{{catname}}">` which is given an object like `{"catname": "fred"}` would be rendered `<input value="fred">`. The substituion happens at function envocation.

[CL-feeds.js](CL-feeds.js) 
: provides the low level content retrieval functions needed to integration content from https://feeds.library.caltech.edu.  If you are reading the source to understand how to integrate content from feeds.library.caltech.edu in other languages (e.g. Go, Python, PHP, R or Julia) this is the place to look.

[CL-feeds-ui.js](CL-feeds-ui.js)
: forms third part of CL.js. It is UI focused. It wraps DOM manipulations to provide support for configurable views of the data retrieved by CL-feeds.js.  It's main purpose is to support building other widgets as well as making the code generated by the widgets easy to understand when embedding in your own pages.


## All together

[CL.js](CL.js) 
: is a concatenation of [CL-core.js](CL-core.js), [CL-ui.js](CL-ui.js), [CL-feeds.js](CL-feeds.js), and [CL-feeds-ui.js](CL-feeds-ui.js) into a single file for faster download.


## Widgets

Widgets are JavaScript libraries for generating HTML, CSS
and JavaScript for integrating system specific 
Caltech Library content (e.g. feeds.library.caltech.edu). 

[CL-BuilderWidget.js](CL-BuilderWidget.js)
: is our first widget built to generate HTML and JavaScript to make it easier to embed or re-use our content in your webpage. It makes extensive use of [CL.js](CL.js). The generated code is for making the library content embeddable in your own webpage.

