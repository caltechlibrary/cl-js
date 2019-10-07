
# DOI Video player

The DOI assigned via CaltechDATA repository can include media elements
such as videos. The [CL.js](../) JavaScript library makes it easy to 
embed those videos in your own website.

## Example embedded media player 

DOI: [10.22002/D1.1281](https://doi.org/10.22002/D1.1281 "link to DOI content")
Video is the first item in the media list.

<div id="video-demo"></div>

## Example JavaScript

```html
    <script src="https://feeds.library.caltech.edu/scripts/CL.js"></script>
    
    <script>
    /* Get the info we need to embed */
    let div = document.getElementById("video-demo");
    
    /* Embed our video with element, doi and item number */
    CL.doi_video_player(div, '10.22002/D1.1281', 0);
    </script>
```
<!-- START: Demo of DOI video player -->

<script src="../scripts/CL.js"></script>

<script>
/* Get the info we need to embed */
let div = document.getElementById("video-demo");
    
/* Embed our video with element, doi and item number */
CL.doi_video_player(div, '10.22002/D1.1281', 0);
</script>

<!--   END: Demo of DOI video player -->
