
# NAME

CL-core.ts, CL-core.js

# SYNOPSIS

TypeScript

~~~TypeScript
import { CL, type CLInterface, type IPayload } from "https://caltechlibrary.github.io/CL-core.ts";
~~~

JavaScript

~~~JavaScript
import { CL } from "https://feeds.library.caltech.edu/models/CL-core.js";
~~~

# DESCRIPTION

This is a low level module written in TypeScript and also transpiled to JavaScript. It is targeting both evergreen web browsers that support ES6 or better JavaScript run times as well as TypeScript runtime like Deno 2.2. It provides a simple wrapper around fetch operations that returns a consistent object called payload. The payload has three attributes, `ok` indicates success or failure of an action (e.g. `CL.httpGet` and `CL.httpPost`), `error` will contain an error message if one is provided and `data` that contains the retrieved. The CL-core module is used by CL-feeds to create the CLFeeds object that wraps the supported end points for working with content published on <https://feeds.library.caltech.edu>. 

From JavaScript `CL-core.js` and `CL-feeds.js` are not usually used directly. Instead you would usually use the bundled form, [CL-v1.js](modules/CL-v1.js).  From TypeScript you can import the `CL.ts` module that exports both `CL-core.ts` and `CL-feeds.ts`.

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


