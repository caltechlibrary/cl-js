
# Introducing the Search Widget

The [Search Widget](https://feeds.library.caltech.edu/widgets/search-widget.html) is a tool for embedding a browser side search and result box
based on feeds hosted at feeds.library.caltech.edu. The widget generates 
CSS, HTML and JavaScript for embedding in your own webpage.
The embedded search is specific to a group or individual feed. It is
most useful when the individual or group has published allot of content
(e.g. hundreds of articles).  The Search Widget lets you choose the 
source of data you want to include (group or person), the type of data 
you want to include in results (e.g. article, book, combined publication 
list or data collections) as well as the number of items and some layout 
options for displaying the listings. The generated JavaScript includes 
building indexes on page load based on settings choosen using the 
search widget.


<!-- START: Search Widget -->

<section id="search-widget" class="widget">
<!-- This is where "the widget" should display -->
</section>

<noscript>JavaScript is required to display and use the Search Widget</noscript>

<!-- Required: the LunrJS library is needed to run our search and indexing!!! -->
<script src="https://unpkg.com/lunr/lunr.js"></script>

<script src="../scripts/CL.js"></script>

<script src="../scripts/CL-feeds-lunr.js"></script>

<script src="../scripts/CL-SearchWidget.js"></script>

<script>
(function (document, window) {
    let cl = Object.assign({}, window.CL),
        widget_element = document.getElementById("search-widget");

    /* NOTE: We want the Search Widget to be hosted
     * where our code is deployed */
    cl.BaseURL = "";
    cl.SearchWidget(widget_element);
}(document, window));
</script>

<!--   END: Search Widget -->

The [Search Widget JavaScript](CL-SearchWidget.js "link to source code of Search Widget") is an example of a JavaScript program based on
[CL.js](../scripts/CL.js "link to source code for CL.js").

