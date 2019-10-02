
# Introducing the Builder Widget

The [Builder Widget](builder-widget.html) is a tool for embedding 
https://feeds.library.caltech.edu content. It generates CSS, 
HTML and JavaScript for embedding in your 
own webpage. Feeds provides content for groups and individuals
in the various Caltech Library repositories. The data is bibliographic 
and collection related. The Builder Widget lets you choose the source 
of data you want to include (group or person), the type of data you 
want to include (e.g. article, book, combined publication list or 
data collections) as well as the number of items and some layout options 
for displaying the listings.


<!-- START: Builder Widget -->

<section id="builder-widget" class="widget">
<!-- This is where "the widget" should display -->
</section>

<noscript>JavaScript is required to display and use the Builder Widget</noscript>

<script src="../scripts/CL.js"></script>

<script src="../scripts/CL-BuilderWidget.js"></script>

<script>
(function (document, window) {
    let cl = Object.assign({}, window.CL),
        widget_element = document.getElementById("builder-widget");

    /* NOTE: We want the builder to be hosted
     * where our code is deployed */
    cl.BaseURL = "";
    cl.BuilderWidget(widget_element);
}(document, window));
</script>



<!--   END: Builder Widget -->

The [Builder Widget JavaScript](CL-Builder-Widget.js "link to source code of Builder Widget") is an example of a JavaScript program based on
[CL.js](../scripts/CL.js "link to source code for CL.js").

