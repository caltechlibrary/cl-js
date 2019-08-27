/**
 * CL-fields.js provides browser side JavaScript form building
 * functions for Caltech Library resources (e.g. feeds.library.caltech.edu).
 * It depends on [Handlerbars](https://handlebarsjs.com).
 *
 * @author R. S. Doiel
 *
Copyright (c) 2019, Caltech
All rights not granted herein are expressly reserved by Caltech.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/* jshint esversion: 6 */
(function(document, window) {
    "use strict";
    let CL = {};
    if (window.CL === undefined) {
        window.CL = {};
    } else {
        CL = Object.assign({}, window.CL);
    }

    /**
     * field takes a default_attributes object, a Handlebars template
     * string and an optional validation function. It returns an object
     * that has the following functions - get(), set(), html(), and json().
     *
     * Example
     *      creator = CL.field({
     *          last_name: "",
     *          first_name: "",
     *          orcid: ""
     *          },
     *          `<div>
     *             <label>Last Name:</label>
     *             <input name="last_name" value="{last_name}">
     *           </div>
     *           <div>
     *             <label>First Name:</label>
     *             <input name="first_name" value="{first_name}">
     *           </div>
     *           <div>
     *             <label>ORCID:</label>
     *             <input name="orcid" value="{orcid}">
     *           </div>`,
     *          function(obj) {
     *             if ('orcid' in obj) {
     *                return validate_orcid(obj.orcid);
     *             }
     *             return true;
     *          });
     *          
     *     // Render as HTML
     *     elem.innerHTML = creator.html();
     *     // payload as json
     *     payload = creator.json();
     */
    CL.field = function(attributes, template_string, validate_function) {
        if (Handlebars === undefined) {
            throw("Need to have HandlebarJS available");
        }
        let obj = new Object(),
            template = Handlebars.compile(template_string);
        // Shallow copy of object attributes
        for (let key in attributes) {
            obj[key] = attributes[key];
        }
        // Attach our validation_function
        if (validate_function === undefined) {
            obj.validate = function () { return true; };
        } else {
            obj.validate = validate_function;
        }
        // Add our get(), set(), html(), and json functions()
        obj.get = function(key, error_value) {
            let self = this;

            if (key in self) {
                return self[key];
            }
            if (error_value == undefined) {
                return null;
            }
            return error_value;
        }
        obj.set = function(key, value){
            let self = this;
            obj[key] = value;
        }
        obj.html = function() {
            let obj = this;
            return template(obj);
        }
        obj.json = function() {
            let self = this;
            return JSON.stringify(self);
        }
        return obj;
    }

    /* NOTE: we need to update the global CL after adding our methods */
    if (window.CL === undefined) {
        window.CL = {};
    }
    window.CL = Object.assign(window.CL, CL);
}(document, window));
