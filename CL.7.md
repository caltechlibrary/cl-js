
# NAME

CL.ts, CL-v1.js

# SYNOPSIS

TypeScript

~~~TypeScript
import { CL, CLFeeds, type CLInterface, type IPayload } from "https://caltechlibrary.github.io/CL.ts";
~~~

JavaScript

~~~JavaScript
import { CL, CLFeeds } from "https://feeds.library.caltech.edu/models/CL-v1.js";
~~~

# DESCRIPTION

The modules provide a bundled JavaScript library for working with Caltech Library content and a single module package for TypeScript. The TypeScript module [CL.ts] is used to bundle [CL-core.ts](CL-core.ts) and [CL-feeds.ts](CL-feeds.ts) into JavaScript as [CL-v1.js](modules/CL-v1.js). The JavaScript implementation targets evergreen web browsers that support ES6 or better JavaScript runtime as well as TypeScript runtime like Deno 2.2. The module provides a means of access web content, particularly content on <https://feeds.library.caltech.edu> in a convenient payload structure. The payload has three attributes, `ok` indicates success or failure of an action (e.g. `CL.httpGet` and `CLFeeds.getPeopleList`), `error` will contain an error message if one is provided and `data` that contains the retrieved. The CL-core module is used by CL-feeds to create the CLFeeds object that wraps the supported end points for working with content published on <https://feeds.library.caltech.edu>. 

# EXAMPLE

This a JavaScript example is how shows how to use `CL.httpGet` to retrieve and display the RSS feed of recently published content in [CaltechAUTHORS](https://authors.library.caltech.edu) repository. 

~~~JavaScript
import { CL } from "https://feeds.library.caltech.edu/models/CL-core.js";

let payload = await CL.httpGet("https://feeds.library.caltech.edu/recent/article.rss");

if (payload.ok) {
    // Display the RSS feed
    console.log(payload.data);
} else {
    // something when wrong
    console.error(payload.error);
}
~~~


This a JavaScript example shows how to use `CLFeeds.getPeopleList` to retrieve a list of CaltechPEOPLE that have bibliographic data available from [CaltechAUTHORS](https://authors.library.caltech.edu), [CaltechTHESIS](https://thesis.library.caltech.edu) and
[CaltechDATA](https://data.caltech.edu).

~~~JavaScript
import { CLFeeds } from "https://feeds.library.caltech.edu/models/CL-feeds.js";

let payload = await CLFeeds.getPeopleList();

if (payload.ok) {
    // Display the object listing CaltechPEOPLE
    console.log(JSON.stringify(payload.data, null, 2));
} else {
    // something when wrong
    console.error(payload.error);
}
~~~

