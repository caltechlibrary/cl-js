
# Example form for People info

<div id="example-output">
Form will go here.
</div>

<!-- START: Example People Info Form built with CL-ui.js -->
<script src="../scripts/CL-core.js"></script>
<script src="../scripts/CL-ui.js"></script>
<script>
(function (document, window) {
'use strict';
let cl = Object.assign({}, window.CL),
    div = document.getElementById('example-output');

let people = {
        "cl_id": "Feynman-R-P",
        "cl_authors_id": "Feynman-R-P",
        "cl_thesis_id": "",
        "display_name": "Richard Feynman",
        "last_name": "Feynman",
        "first_name": "Richard",
        "orcid": "",
        "viaf": "",
        "isni": "0000 0001 2096 0218",
        "snac": "w6v69kzn",
        "wikidata": "Q39246"
    },

    field = CL.field(people, `
<div>
    <label for="cl_id">CL ID:</label>
    <input type="text" id="cl_id" name="caltechlibrary_id" value="{{cl_id}}">
</div>
<div>
    <label for="cl_authors_id">CL Authors ID:</label>
    <input type="text" id="cl_authors_id" name="cl_authors_id" value="{{cl_authors_id}}">
</div>
<div>
    <label for="cl_thesis_id">CL Thesis ID:</label>
    <input type="text" id="cl_thesis_id" name="cl_thesis_id" value="{{cl_thesis_id}}">
</div>
<div>
    <label for="display_name">Display Name:</label>
    <input type="text" id="display_name" name="display_name" value="{{display_name}}">
</div>
<div>
    <label for="last_name">Last Name:</label>
    <input type="text" id="last_name" name="last_name" value="{{last_name}}">
</div>
<div>
    <label for="first_name">First Name:</label>
    <input type="text" id="first_name" name="first_name" value="{{first_name}}">
</div>
<div>
    <label for="isni">ISNI:</label>
    <input type="text" id="isni" name="isni" value="{{isni}}">
</div>
<div>
    <label for="snac">SNAC:</label>
    <input type="text" id="snac" name="snac" value="{{snac}}">
</div>
<div>
    <label for="wikidata">Wikidata:</label>
    <input type="text" id="wikidata" name="wikidata" value="{{wikidata}}">
</div>
`,
        function(obj) {
            // Make sure no fields are empty...
            for (let key in obj) {
                if (obj[key].trim().length == 0) {
                    return false;
                }
            }
            return true;
        });
div.innerHTML = "";
let form = CL.assembleFields(
        div, field);
}(document, window));

</script>

<!--   END: Example People Info Form built with CL-ui.js -->
