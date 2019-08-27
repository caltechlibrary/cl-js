Change log for REPOSITORY
=========================

Version 0.1.0
-------------

+ Forked CL-core.js, CL-ui.js, CL-BuilderWidget.js and CL-SearchWidget.js out from feeds.library.caltech.edu
+ Moved feeds.library.caltech.edu specific features out of CL-core.js and CL-ui.js into CL-feeds.js
+ Added CL-fields.js for simplify form building in And/Or prototype
+ JavaScript API Changes
    + `CL.FeedsBaseURL` has been added for fetching feeds content in `CL-feeds.js`
    + `CL.get()` renamed `CL.httpGet()`
        + If `CL.BaseURL` exists and you pass a root relative URL `CL.BaseURL` will be prefixed before making the httpGet() call.
