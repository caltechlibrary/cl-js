
# NAME

CL-feeds.ts, CL-feeds.js

# SYNOPSIS

TypeScript

~~~TypeScript
import { CLFeeds } from "https://caltechlibrary.github.io/CL-feeds.ts";
~~~

JavaScript

~~~JavaScript
import { CLFeeds } from "https://feeds.library.caltech.edu/models/CL-feeds.js";
~~~

# DESCRIPTION

This is a module written in TypeScript and also transpiled to JavaScript. It is targeting both evergreen web browsers that support ES6 or better JavaScript run times as well as TypeScript runtime like Deno 2.2. It provides a simple wrapper various feeds.library.caltech.edu end points that are useful for working with Bibliographic data from various Caltech Library repositories. It relies on `CL-core.js` library.

From JavaScript `CL-core.js` and `CL-feeds.js` are not usually used directly. Instead you would usually use the bundled form, [CL-v1.js](modules/CL-v1.js).  From TypeScript you can import the `CL.ts` module that exports both `CL-core.ts` and `CL-feeds.ts`.

# EXAMPLE

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

