/**
 * CL-SearchWidget.js defines the SearchWidget based on CL-core.js
 * and CL-ui.js. It is used to generate Lunrjs based search UI making
 * your JSON feeds searchable.
 *
 * CL.SearchWidget() creates a feed search widget embedded at element id.
 * @params element id to embed the search widget.
 *
 * CL-core.js provides browser side JavaScript access to 
 * feeds.library.caltech.edu and other Caltech Library resources.
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
(function (document, window) {
    "use strict";
    let CL = {};
    if (window.CL === undefined) {
        window.CL = {}
    } else {
        CL = Object.assign(CL, window.CL);
    }

    /**
     * CL.SearchWidget() creates a search widget in the element
     * indicated by element id and error_element_id.
     *
     * @param element_id the DOM element to render the Search Widget into
     * @param error_element_id is the DOM element to render errors message into.
     */
    CL.SearchWidget = function (element_id, error_element_id) {
        /* Widget code goes here */
        let widget_ui = document.getElementById(element_id, error_element_id),
            form,
            heading,
            div,
            label,
            input,
            select_aggregation,
            select_feed_id,
            select_feed_path;

        /* Widget event handlers */
        function update_feed_id( evt ) {
            let value = select_aggregation.value,
                option;
                select_feed_id.innerHTML = "";
                option = document.createElement("option");
                option.innerHTML = "Step 2. pick a feed";
                select_feed_id.appendChild(option);
                option = document.createElement("option");
                option.innerHTML = "Step 3. pick the feed type (e.g. recent/article, combined)";
                select_feed_path.innerHTML = "";
                select_feed_path.appendChild(option);
            if (value === "people") {
                CL.getPeopleList(function (people, err) {
                if (err != "") {
                    let elem = document.getElementById(error_element_id);
                    if (elem) {
                       elem.innerHTML = err;
                    } else {
                       console.log("ERROR", err);
                    }
                    return;
                }
                people.forEach(function( profile, i ) {
                    let option = document.createElement("option");
                    option.value = profile.id;
                    if ("orcid" in profile) {
                        option.innerHTML = profile.sort_name;
                    } else {
                        option.innerHTML = profile.sort_name + "(" + profile.orcid + ")";
                    }
                    select_feed_id.appendChild(option);
                });
                });
            } else if (value === "groups") {
                CL.getGroupsList(function (groups, err) {
                    if (err != "") {
                        let elem = document.getElementById(error_element_id);
                        if (elem) {
                            elem.innerHTML = err;
                        } else {
                            console.log("ERROR", err);
                        }
                        return;
                    }
                    groups.forEach(function( group, i ) {
                        let option = document.createElement("option");
                        option.value = group.key;
                        option.innerHTML = group.name;
                        select_feed_id.appendChild(option);
                    });
                });
            }
        }

        function update_feed_path( evt ) {
            let aggregation = select_aggregation.value,
                feed_id = select_feed_id.value,
                option;
                option = document.createElement("option");
                option.innerHTML = "Step 3. Pick feed type";
                select_feed_path.innerHTML = "";
                select_feed_path.appendChild(option);
            if (aggregation === "people") {
                CL.getPeopleInfo(feed_id, function (profile, err) {
                    if (err != "") {
                           let elem = document.getElementById(error_element_id);
                           if (elem) {
                              elem.innerHTML = err;
                           } else {
                              console.log("ERROR", err);
                           }
                           return;
                    }
                    if ("CaltechTHESIS" in profile) {
                        for (let feed_label in profile.CaltechTHESIS) {
                            let option = document.createElement("option");
                            option.innerHTML = "CaltechTHESIS: " + feed_label;
                            option.value = feed_label.toLocaleLowerCase().replace(/ /g, "_");
                            select_feed_path.appendChild(option);
                        }
                    }
                    if ("CaltechAUTHORS" in profile) {
                        for (let feed_label in profile.CaltechAUTHORS) {
                            let option = document.createElement("option");
                            option.innerHTML = "CaltechAUTHORS: " + feed_label;
                            option.value = feed_label.toLocaleLowerCase().replace(/ /g, "_");
                            select_feed_path.appendChild(option);
                        }
                    }
                    if ("CaltechDATA" in profile) {
                        for (let feed_label in profile.CaltechDATA) {
                            let option = document.createElement("option"),
                            feed_type = feed_label.toLocaleLowerCase().replace(/ /g, "_");
                            if (feed_type === "combined") {
                                feed_type = "data";
                            } else if (feed_type === "interactive_resource") {
                                feed_type = "interactiveresource";
                            }
                            option.innerHTML = "CaltechDATA: " + feed_label;
                            option.value = feed_type;
                            select_feed_path.appendChild(option);
                        }
                    }
                });
            } else if (aggregation === "groups") {
                CL.getGroupInfo(feed_id, function (group, err) {
                    if (err != "") {
                       let elem = document.getElementById(error_element_id);
                       if (elem) {
                          elem.innerHTML = err;
                       } else {
                          console.log("ERROR", err);
                       }
                       return;
                    }
                    if ("CaltechTHESIS" in group) {
                        for (let feed_label in group.CaltechTHESIS) {
                             let option = document.createElement("option");
                             option.innerHTML = "CaltechTHESIS: " + feed_label;
                             option.value = feed_label.toLocaleLowerCase().replace(/ /g, "_");
                             select_feed_path.appendChild(option);
                        }
                    }
                    if ("CaltechAUTHORS" in group) {
                        for (let feed_label in group.CaltechAUTHORS) {
                             let option = document.createElement("option");
                             option.innerHTML = "CaltechAUTHORS: " + feed_label;
                             option.value = feed_label.toLocaleLowerCase().replace(/ /g, "_");
                             select_feed_path.appendChild(option);
                        }
                    }
                    if ("CaltechDATA" in group) {
                        for (let feed_label in group.CaltechDATA) {
                            let option = document.createElement("option"),
                                feed_type = feed_label.toLocaleLowerCase().replace(/ /g, "_");
                            if (feed_type === "combined") {
                               feed_type = "data";
                            } else if (feed_type === "interactive_resource") {
                               feed_type = "interactiveresource";
                            }
                            option.innerHTML = "CaltechDATA: " + feed_label;
                            option.value = feed_type;
                            select_feed_path.appendChild(option);
                        }
                    }
                });
            }
        }

        function generate_code( evt ) {
            console.log("Generate the code goes here!!", evt);
        }


        /* Form holds our control panel for generating code */
        form = document.createElement("form");
        form.setAttribute("id", "feed-search-widget");
    
        heading = document.createElement("h1");
        heading.innerHTML = "Search Widget";
        form.appendChild(heading);
        heading = document.createElement("h2");
        heading.innerHTML = "Data Source";
        form.appendChild(heading);
    

        /* Step 1. Pick which aggregation you want to generate code for */
        div = CL.createCompositElement("div", ["label", "select"], ["", "aggregation"]);
        label = div.querySelector("label");
        label.setAttribute("for", "aggregation");
        label.setAttribute("title", "Step 1. pick an aggregation (people or groups)");
        label.innerHTML = "Aggregation:";
        select_aggregation = div.querySelector("#aggregation");
        select_aggregation.setAttribute("name", "aggregation");
        [ "", "Groups", "People" ].forEach(function(value, i) {
            let option = document.createElement("option");
            if (i === 0) {
                option.setAttribute("value", "");
                option.setAttribute("title", "clear selection");
                option.innerHTML = "Step 1. pick an aggregation";
            } else {
                option.setAttribute("value", value.toLocaleLowerCase());
                option.innerHTML = value;
            }
            select_aggregation.appendChild(option);
        });
        select_aggregation.addEventListener("change", update_feed_id, false);
        form.appendChild(div);

        /* Step 2. Pick a feed (e.g. GALCIT, Newman-D-K) */
        div = CL.createCompositElement("div",
            ["label", "select"],
            ["", "feed_id"]);
        label = div.querySelector("label");
        label.setAttribute("for", "feed_id");
        label.setAttribute("title", "Step 2. pick the feed id");
        label.innerHTML = "Feed:";
        select_feed_id = div.querySelector("#feed_id");
        select_feed_id.setAttribute("name", "feed_id");
        select_feed_id.setAttribute("title", "this list depends on the aggregation previously selected");
        select_feed_id.addEventListener("change", update_feed_path, false);
        form.appendChild(div);

        /* Step 3. Pick a feed type (e.g. article, recent/article, combined) */
        div = CL.createCompositElement("div",
            ["label", "select"],
            ["", "feed_path"]);
        label = div.querySelector("label");
        label.setAttribute("for", "feed_path");
        label.setAttribute("title", "Step 3. pick the feed type (e.g. recent/article, combined)");
        label.innerHTML = "Feed type:";
        select_feed_path = div.querySelector("#feed_path");
        select_feed_path.setAttribute("name", "feed_path");
        select_feed_path.setAttribute("title", "list of available feed paths");
        form.appendChild(div);

        heading = document.createElement("h2");
        heading.innerHTML = "Layout";
        heading.setAttribute("title", "Step 4. pick the fields to display");
        form.appendChild(heading);

        /* Step 4. Pick listing layout format */
        div = document.createElement("div");
        div.classList.add("checkbox-control");

        [ "Title Link", "Pub Date", "Authors", "Abstract" ].forEach(function (s, i) {
            let elem_id = s.toLocaleLowerCase().replace(/ /g, "-"),
                elem_name = s.toLocaleLowerCase().replace(/ /g, "_"),
                control, label, input;

            control = CL.createCompositElement("div",
                      [ "label", "input" ],
                      [ "", elem_id ]);
            control.classList.add("checkbox");
            input = control.querySelector("#" + elem_id);
            input.setAttribute("type", "checkbox");
            input.setAttribute("name", elem_name);
            input.setAttribute("label", s);
            if (i == 1) {
                input.setAttribute("checked", true);
            }
            label = control.querySelector("label");
            label.innerHTML = s + ":";
            div.append(control);
        });
        form.appendChild(div);

        /* Step 5. generate the code */
        div = CL.createCompositElement("div",
            ["input" ],
            ["generate"]);
        input = div.querySelector("#generate");
        input.setAttribute("type", "button");
        input.setAttribute("value", "Generate code");
        input.addEventListener("click", generate_code, false);
    
        form.appendChild(div);

        /* Finally instantiate the form! */
        widget_ui.appendChild(form);
    };

    /* Now add CL.SearchWidget to the CL in the window object. */
    if (window.CL === undefined) {
        window.CL = {};
    }
    window.CL = Object.assign(window.CL, CL);
}(document, window));

