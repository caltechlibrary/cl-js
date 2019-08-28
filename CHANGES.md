Change log for REPOSITORY
=========================

Version 0.1.0
-------------

+ Forked CL-core.js, CL-ui.js, CL-BuilderWidget.js and CL-SearchWidget.js out from feeds.library.caltech.edu
+ Moved feeds.library.caltech.edu specific features out of CL-core.js and CL-ui.js into CL-feeds.js and CL-feeds-ui.js
+ Added new CL-ui.js to simplify form building in And/Or prototype
+ JavaScript API Changes for CL object
    + `CL.FeedsBaseURL` has been added for fetching feeds content in `CL-feeds.js`
    + `CL.get()` renamed `CL.httpGet()`
    + `CL.BaseURL` is a fallback prefix in  `CL.httpGet()`
