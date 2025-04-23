
# Installation

**CL-js** provides a Javascript ESM for working with Caltech Library content. It is implemented as a TypeScript module.  Installation is usually a matter of unzipping the lastest release and copying the `CL-v1.js` or `CL-v1.ts` into your web tree or project directory where you normally place you JavaScript or TypeScript files. Then you reference that location to include it in your web pages.

## The basic recipe

If you want to use the production version we use at Caltech Library you can use the following script element in
your web page.

```html
    <script type="module" src="https://feeds.library.caltech.edu/scripts/CL-v1.js"></script>
```

## The not so basic recipe

The latest releases can always be found at 

>    https://github.com/caltechlibrary/dataset/releases/latest


In the following steps I'm assuming you're working in JavaScript and your web directory is located at `/var/www/htdocs`. I assume you are storing your JavaScript modules in `/var/www/htdocs/modules` and you have permission to read/write files in those directories.

1. Goto https://github.com/caltechlibrary/cl-js/releases/latest 
2. Download the cl-js-VERSION.zip file (VERSION is replaced with the current version number, e.g. v1.0.0)
3. Unzip the cl-js-VERSION.zip file
4. Copy module/CL-v1.js to /var/www/htdocs/modules/
5. Update your web page and you're done

Here are the command line steps I took for version v1.0.0.


```bash
    curl -O https://github.com/caltechlibrary/cl-js/releases/download/v1.0.0/cl-js-v1.0.0.zip
    unzip cl-js-v1.0.0.zip
    cp modules/*.js /var/www/htdocs/modules/
```

From here I can include the JavaScript in the web pages that need it.

```html
    <script type="module" src="/scripts/CL-v1.js"></script>
```

