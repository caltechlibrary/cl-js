
# Example form for People info

In this example we'll create a people object for Richard Feynman
and populate a form with this object's attributes. 

<div id="example-output">
Form will go here.
</div>

<!-- START: Example People Info Form built with CL-ui.js -->
<script src="../scripts/CL.js"></script>
<script>
(function (document, window) {
'use strict';
let cl = Object.assign({}, window.CL),
    div = document.getElementById('example-output');
cl.useChecked = true;
let people = {
        "family_name": "Feynman",
        "given_name": "Richard",
        "cl_people_id": "Feynman-R-P",
        "thesis_id": "",
        "authors_id": "Feynman-R-P",
        "archivesspace_id": "",
        "directory_id": "",
        "viaf": "",
        "lcnaf": "",
        "isni": "0000 0001 2096 0218",
        "wikidata": "Q39246",
        "snac": "w6v69kzn",
        "orcid": "",
        "image_url": "",
        "educated_at": "",
        "caltech": true,
        "jpl": false,
        "faculty": true,
        "alumn": false,
        "notes": ""
    },
    field = CL.field(people, `
<div>
    <label for="family_name">Family Name:</label>
    <input type="text" id="family_name" name="family_name" value="{{family_name}}">
</div>
<div>
    <label for="given_name">Given Name:</label>
    <input type="text" id="given_name" name="given_name" value="{{given_name}}">
</div>
<div>
    <label for="cl_people_id">CL ID:</label>
    <input type="text" id="cl_people_id" name="cl_people_id" value="{{cl_people_id}}">
    <a id="cl_people_url"></a>
</div>
<div>
    <label for="thesis_id">Thesis ID:</label>
    <input type="text" id="thesis_id" name="thesis_id" value="{{thesis_id}}">
    <a id="thesis_url"></a>
</div>
<div>
    <label for="authors_id">Authors ID:</label>
    <input type="text" id="authors_id" name="authors_id" value="{{authors_id}}">
    <a id="authors_url"></a>
</div>
<div>
    <label for="archivesspace_id">ArchivesSpace ID</label>
    <input type="text" id="archivesspace_id" name="archivesspace_id" value="{{archivesspace_id}}">
    <a id="archivesspace_url"></a>
</div>
<div>
    <label for="directory_id">Directory ID</label>
    <input type="text" id="directory_id" name="directory_id" value="{{directory_id}}">
    <a id="directory_url"></a>
</div>
<div>
    <label for="viaf">VIAF ID</label>
    <input type="text" id="viaf" name="viaf" value="{{viaf}}">
    <a id="viaf_url"></a>
</div>
<div>
    <label for="lcnaf">LCNAF:</label>
    <input type="text" id="lcnaf" name="lcnaf" value="{{lcnaf}}">
</div>
<div>
    <label for="isni">ISNI:</label>
    <input type="text" id="isni" name="isni" value="{{isni}}">
</div>
<div>
    <label for="wikidata">Wikidata:</label>
    <input type="text" id="wikidata" name="wikidata" value="{{wikidata}}">
    <a id="wikidata_url"></a>
</div>
<div>
    <label for="snac">SNAC:</label>
    <input type="text" id="snac" name="snac" value="{{snac}}">
</div>
<div>
    <label for="orcid">ORCID:</label>
    <input type="text" id="orcid" name="orcid" value="{{orcid}}">
    <a id="orcid_url"></a>
</div>
<div> 
    <label for="image_url">Image:</label>
    <input type="url" id="image_url" name="image_url" value="{{image_url}}">
    <a id="image_url"></a>
</div>
<div>
    <label for="educated_at">Educated At:</label>
    <textarea id="educated_at" name="educated_at">{{educated_at}}</textarea>
</div>
<div>
    <label for="caltech">Caltech:</label>
    <input type="checkbox" id="caltech" name="caltech" {{caltech}}>
</div>
<div>
    <label for="jpl">JPL:</label>
    <input type="checkbox" id="jpl" name="jpl" {{jpl}}>
</div>
<div>
    <label for="faculty">Faculty:</label>
    <input type="checkbox" id="faculty" name="faculty" {{faculty}}>
</div>
<div>
    <label for="alumn">Alumn:</label>
    <input type="checkbox" id="alumn" name="alumn" {{alumn}}>
</div>
<div>
    <label for="notes">Notes:</label>
    <textarea id="notes" name="notes">{{notes}}</textarea>
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
