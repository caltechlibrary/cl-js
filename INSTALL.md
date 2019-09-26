
# Installation

*cl-js* is a Javascript library for working with Caltech Library
content.  Installation is usually a matter of unzipping the lastest
release and copying the `CL.js` into your web tree where you normally
place you JavaScript files. Then you reference that location to include
it in your web pages.


## The basic recipe

In the following steps I'm assuming your web directory is
located at `/var/www/htdocs` and that you store your JavaScript
files in `/var/www/htdocs/js` and you have permission to read/write
files in those directories.

1. Goto https://github.com/caltechlibrary/cl-js/releases/latest 
2. Download the cl-js-VERSION-webbrowser.zip file (VERSION is replaced with the current version number, e.g. v0.1.2)
3. Unzip the cl-js-VERSION-webbrowser.zip file
4. Copy scripts/CL.js to /var/www/htdocs/js/
5. Update your web page and you're done

Here are the command line steps I took for version v0.1.2.


```bash
    curl -O https://github.com/caltechlibrary/cl-js/releases/download/v0.1.2/cl-js-v0.1.2-webbrowser.zip
    unzip cl-js-v0.1.2-webbrowser.zip
    cp scripts/CL.js /var/www/htdocs/js/
```

From here I can include the JavaScript in the web pages that need it.


>    https://github.com/caltechlibrary/dataset/releases/latest


