
# Hello World.

This is a "hello world" type of example showing how to bind
a simple form input element to a object.


<div id="example-output">
Example output goes here.
</div>

<!-- START: Example using CL-ui.js to build a form field -->

<script src="../scripts/CL.js"></script>

<script>
(function( document, window) {
'use strict';
// Setup an element and objects to receive our simple form.
let div = document.getElementById('example-output'),
    person = {"name": ""},
    field = CL.field(person, `Hello, what is your name? <input id="name" type="text" name="name" value="{{name}}">`, function () {
        let obj = this,
            child = document.createElement("div");
        child.setAttribute("id", "greetings");
        if (obj.name !== undefined && obj.name.length > 0) {

            child.innerHTML = "Hi " + obj.name;
        } else {
            child.innerHTML = "Hello World!";
        }
        div.appendChild(child)
    });
    //div.appendChild(field.html());

// Create and render our simple form into div.example-output
let x = CL.assembleFields(div, field);

// From here on we're writing vanilla JavaScript for processing
// the form and behaviors.
let name_element = document.getElementById('name'),
    greetings = document.getElementById('greetings');;
name_element.addEventListener("change", 
    function(evt) {
        // In this example we update our example-output element.
        if (name_element.value === "") {
            greetings.innerHTML = "Hello World!";
        } else {
            greetings.innerHTML = "Hi " + name_element.value + "!";
        } 

        // NOTE: Normally we'd run some validation and if it returns 
        // true we'd use CL.httpGet() or CL.httpPost() to transmit
        // our results.
    });
}(document, window));
</script>

<!--   END: Example using CL-ui.js to build a form field -->
