Change log for REPOSITORY
=========================

Version 0.2.1
-------------

+ Added missing "Show publisher" to Builder Widget

Version 0.2.0
-------------

+ Implemented Advisor lists
+ Title linking always uses resolver link
+ Show DOI will link itself if DOI avialable
+ Added Direct Link option for primary digital object in repository record


Version 0.1.2
-------------

+ Migrated CL-BuilderWidget.js to cl-js repository
+ Fixed bugs in http versus https reference in DOI media player

Version 0.1.1
-------------

+ Re-organized CL-core.js and CL-ui.js into CL-core.js, CL-ui.js, CL-feeds.js, CL-feeds-ui.js
+ Added CL-doi-media.js for embedding a media player for DOI hosted in CaltechDATA that have media metadata


Version 0.1.0
-------------

+ Forked CL-core.js, CL-ui.js, CL-BuilderWidget.js and CL-SearchWidget.js out from feeds.library.caltech.edu
+ Moved feeds.library.caltech.edu specific features out of CL-core.js and CL-ui.js into CL-feeds.js and CL-feeds-ui.js
+ Added new CL-ui.js to simplify form building in And/Or prototype
+ JavaScript API Changes for CL object
    + `CL.FeedsBaseURL` has been added for fetching feeds content in `CL-feeds.js`
    + `CL.get()` renamed `CL.httpGet()`
    + `CL.BaseURL` is a fallback prefix in  `CL.httpGet()`
