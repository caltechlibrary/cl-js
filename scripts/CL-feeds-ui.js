/**
 * CL-feeds-ui.js builds on the CL object providing simple support
 * for constructing DOM based UI.
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
/*jshint esversion: 6 */
(function(document, window) {
    "use strict";
    let CL = {};
    if (window.CL === undefined) {
        window.CL = {};
    } else {
        CL = Object.assign({}, window.CL);
    }

    /** 
     * CL.createCompositElement() takes an element type (e.g.
     * div, span, h1, a) and append children based on an array
     * of type information, ids and CSS classes.
     *
     * @param element_type (string, required) string
     * @param child_element_types (array of string, required)
     * @param child_element_ids (array of string, optional)
     * @param child_element_classes (array of string, optional)
     * @return DOM element containing children
     */
    CL.createCompositElement = function(element_type, child_element_types, child_element_ids = [], child_element_classes = []) {
        let outer = document.createElement(element_type);
        child_element_types.forEach(function(child_element_type, i) {
            let inner = document.createElement(child_element_type);
            if (i < child_element_ids.length && child_element_ids[i] !== "") {
                inner.setAttribute("id", child_element_ids[i]);
            }
            if (i < child_element_classes.length && child_element_classes[i] !== "") {
                let css_classes = [];
                if (child_element_classes[i].indexOf(" ") > -1) {
                    css_classes = child_element_classes[i].split(" ");
                } else {
                    css.classes.push(child_element_classes[i]);
                }
                css_classes.forEach(function(css_class) {
                    inner.classList.add(css_class);
                });
            }
            outer.appendChild(inner);
        });
        return outer;
    };


    /* isEPrintsRecord is an interal function, not exported. */
    function isEPrintsRecord(record) {
        if (record.collection !== undefined &&
            (record.collection === "CaltechAUTHORS" ||
                record.collection === "CaltechTHESIS")) {
            return true;
        }
        if (record.id !== undefined && typeof record.id === "string" &&
            record.id.indexOf("eprint") > -1) {
            return true;
        }
        return false;
    }

    /**
     * normalize_view is a function to use with a CL.pipeline. It expects
     * data and error parameters and will envoke `this.nextCallbackFn(data, err)`
     * before existing. The purpose of normalize_view is to extract titles, links,
     * pub_date, creator and description from both Invenion and EPrints style JSON 
     * lists.
     */
    CL.normalize_view = function(data, err) {
        let self = this,
            normal_view = [];

        for (let i in data) {
            let record = data[i],
                view = {
                    "href": "",
                    "title": "",
                    "creators": [],
                    "description": "",
                    "pub_date": "",
                    "collection": "",
                    "doi": "",
                    "citation_info": {},
                    "resource_type": ""
                };
            /* Normalize our view between EPrint and Invenio style records */
            /*NOTE: maybe creating the view should be its own filter function? */
            if (isEPrintsRecord(record) === true) {
                view.collection = record.collection;
                view.title = record.title;
                if (record.type !== undefined && record.type !== "") {
                    view.resource_type = record.type;
                }
                /* NOTE: we should prefer the DOI if available */
                view.href = record.official_url;
                if (record.doi !== undefined && record.doi !== "") {
                    view.doi = record.doi;
                    if (record.doi.indexOf("://") > -1) {
                        view.href = record.doi;
                    } else {
                        view.href = "https://doi.org/" + record.doi;
                    }
                }
                /* NOTE: we accumulate the possible citation fields
                 * before adding them to the view */
                let citation_info = {};
                if (record.volume !== undefined && record.volume !== "") {
                    citation_info.volume = record.volume;
                }
                /* number is issue number in Journals, Magazines */
                if (record.number !== undefined && record.number !== "") {
                    citation_info.number = record.number;
                }
                if (record.series !== undefined && record.series !== "") {
                    citation_info.series = record.series;
                }
                if (record.pages !== undefined && record.pages !== "") {
                    citation_info.pages = record.pages;
                }
                if (record.pagerange !== undefined && record.pagerange !== "") {
                    citation_info.page_range = record.pagerange;
                }
                if (record.publication !== undefined && record.publication !== "") {
                    citation_info.publication = record.publication;
                }
                if (record.publisher !== undefined && record.publisher !== "") {
                    citation_info.publisher = record.publisher;
                }
                if (record.issn !== undefined && record.issn !== "") {
                    citation_info.issn = record.issn;
                }
                if (record.isbn !== undefined && record.isbn !== "") {
                    citation_info.isbn = record.isbn;
                }
                if (record.edition !== undefined && record.edition !== "") {
                    citation_info.edition = record.edition;
                }
                //FIXME: we had this field wrongly labeled in our EPrint 
                // output, it was called .pmc_id rather than .pmcid we
                // can simplify this if/else when that has propagated
                // throughout our collections.
                if (record.pmcid !== undefined && record.pmcid !== "") {
                    citation_info.pmcid = record.pmcid;
                } else if (record.pmc_id !== undefined && record.pmc_id !== "") {
                    citation_info.pmcid = record.pmc_id;
                }
                if (Object.keys(citation_info).length > 0) {
                    view.citation_info = citation_info;
                }
                // NOTE: Some records have no publication date because 
                // there is no date in the material provided
                // when it was digitized and added to the repository.
                view.pub_date = '';
                if (record.date_type !== undefined &&
                    (record.date_type === 'completed' ||
                        record.date_type === 'published' ||
                        record.date_type === 'inpress' ||
                        record.date_type === 'submitted' ||
                        record.date_type === 'degree')) {
                    view.pub_date = '(' + record.date.substring(0, 4) + ')';
                } else if (record.type !== undefined && record.date !== undefined &
                    (record.type === 'conference_item' || record.type === 'teaching_resource') && record.date !== '') {
                    view.pub_date = '(' + record.date.substring(0, 4) + ')';
                }
                if (record.creators !== undefined && record.creators.items !== undefined) {
                    view.creators = [];
                    record.creators.items.forEach(function(creator, i) {
                        let display_name = "",
                            orcid = "",
                            id = "";

                        if (creator.name.given !== undefined && creator.name.family !== undefined) {
                            display_name = creator.name.family + ", " + creator.name.given;
                        } else if (creator.name.family !== undefined) {
                            display_name = creator.name.family;
                        }
                        if (creator.id !== undefined) {
                            id = creator.id;
                        }
                        if (creator.orcid !== undefined) {
                            orcid = creator.orcid;
                        }
                        view.creators.push({
                            "id": id,
                            "display_name": display_name,
                            "orcid": orcid,
                            "pos": i
                        });
                    });
                }
                view.description = record.abstract;
            } else {
                view.collection = "CaltechDATA";
                view.title = record.titles[0];
                if (record.resourceType !== undefined && record.resourceType.resourceTypeGeneral !== undefined && record.resourceType.resourceTypeGeneral !== "") {
                    view.resource_type = record.resourceType.resourceTypeGeneral;
                }
                /* NOTE: we should prefer the DOI if available */
                if (record.identifier !== undefined &&
                    (record.identifier.identifierType === "DOI")) {
                    view.href = "https://doi.org/" + record.identifier.identifier;
                } else {
                    view.href = "";
                }
                view.pub_date = record.publicationYear;
                if (record.creators !== undefined) {
                    view.creators = [];
                    record.creators.forEach(function(creator, i) {
                        let display_name = "",
                            orcid = "";

                        if (creator.creatorName !== undefined) {
                            display_name = creator.creatorName;
                        }
                        if (creator.nameIdenitifiers !== undefined) {
                            creator.nameIdentifiers.forEach(function(identifier) {
                                if (identifier.nameIdentifierScheme === "ORCID") {
                                    orcid = identifier.nameIdentifier;
                                }
                            });
                        }
                        view.creators.push({
                            "display_name": display_name,
                            "orcid": orcid,
                            "pos": i
                        });
                    });
                }
                view.description = record.descriptions.join("<p>");
            }
            normal_view.push(view);
        }
        self.nextCallbackFn(normal_view, "");
    };

    /**
     * recentN is a function to use with CL.pipeline. It expects data and error parameters and will
     * envoke `this.nextCallbackFn(data, error)` before exiting.
     *
     * @param data (a JS data type, required) this is usually a list to iterate filter for N items.
     * @param err (string, required) is an error string which is empty of no errors present.
     */
    CL.recentN = function(data, err) {
        let self = this,
            N = 0;

        if (err !== "") {
            self.nextCallbackFn(data, err);
            return;
        }
        N = self.getAttribute("recentN");
        if (N === undefined || Number.isInteger(N) === false || N < 1) {
            self.nextCallbackFn(data, "recentN attribute not set properly, an integer greater than zero required");
            return;
        }
        if (Array.isArray(data) === true) {
            self.nextCallbackFn(data.slice(0, N), err);
        }
        self.nextCallbackFn(data, "data was not an array, can't take N of them");
    };

    /**
     * titleCase is a naive title case function. Splits in spaces,
     * capitalizes each first let, lower casing the rest of the string and
     * finally joins the array of strings with spaces.
     */
    function titleCase(s) {
        return s.split(" ").map(function(word) {
            if (word.endsWith(".")) {
                return word;
            }
            if (word in ["of", "the", "a", "and", "or"]) {
                return word.toLowerCase();
            }
            return word[0].toUpperCase() + word.substr(1).toLowerCase();
        }).join(" ");
    }


    /**
     * viewer is a callback suitible to be used by functions like getPeopleJSON() and getGroupJSON().
     * it takes a configuration from the attribute "viewer" and will apply a filter pipeline if provided.
     * If no configuration provided then viewer will display unlinked titles.
     *
     * @param data (object, required) the data received from the calling function
     * @param err (string, required) holds any existing error message passed to it by calling function.
     */
    CL.viewer = function(data, err) {
        let self = this,
            filters = [],
            show_feed_count = false,
            show_year_headings = false,
            show_creators = false,
            show_pub_date = false,
            show_title_linked = false,
            show_citation = false,
            show_issn = false,
            show_isbn = false,
            show_pmcid = false,
            show_doi = false,
            show_description = false,
            show_search_box = false,
            config = {},
            parent_element,
            __display;
        config = self.getAttribute("viewer");
        /* To be cautious we want to validate our configuration object */
        if (config.show_search_box !== undefined && config.show_search_box === true) {
            show_search_box = true;
        }
        if (config.filters !== undefined && Array.isArray(config.filters)) {
            filters = config.filters;
        }
        if (config.feed_count !== undefined && config.feed_count === true) {
            show_feed_count = true;
        }
        if (config.show_year_headings !== undefined && config.show_year_headings === true) {
            show_year_headings = true;
        }
        if (config.creators !== undefined && config.creators === true) {
            show_creators = true;
        }
        if (config.pub_date !== undefined && config.pub_date === true) {
            show_pub_date = true;
        }
        if (config.title_link !== undefined && config.title_link === true) {
            show_title_linked = true;
        }
        if (config.citation_details !== undefined && config.citation_details === true) {
            show_citation = true;
        }
        if (config.issn_or_isbn !== undefined && config.issn_or_isbn === true) {
            show_issn = true;
            show_isbn = true;
        }
        if (config.pmcid !== undefined && config.pmcid === true) {
            show_pmcid = true;
        }
        if (config.doi !== undefined && config.doi === true) {
            show_doi = true;
        }
        if (config.description !== undefined && config.description === true) {
            show_description = true;
        }
        /* FIXME: add the following toggled fields
         * + show_citaition_fields
         *     + page_number
         *     + chapter
         *     + vol no
         *     + issue no
         *     + version number
         * + show_doi
         * + show_issn
         * + show_isbn
         */
        if (config.parent_element !== undefined) {
            parent_element = config.parent_element;
        } else if (self.element !== undefined) {
            parent_element = self.element;
        } else {
            /* Worst case append a section element to body with a class CL-Library-Feed */
            let body = document.querySelector("body");
            parent_element = document.createElement("section");
            parent_element.classList.add("CL-library-Feed");
            body.appendChild(parent_element);
        }


        __display = function(records, err) {
            if (err != "") {
                parent_element.classList.addClass("error");
                parent_element.innerHTML = err;
                return;
            }
            let ul = document.createElement("ul"),
                feed_count = document.createElement("div"),
                year_jump_list = document.createElement("div"),
                year_heading = "";
            /* Handle Managing Year Jump List */
            if (show_year_headings === true) {
                year_heading = "";
                parent_element.append(year_jump_list);
            }
            /* Handle feed count */
            if (show_feed_count === true) {
                feed_count.innerHTML = "(" + records.length + " items)";
                parent_element.append(feed_count);
            }
            /* Add our ul to parent_element */
            parent_element.appendChild(ul);
            records.forEach(function(record) {
                let view = {},
                    current_year = "",
                    li = document.createElement("li"),
                    a,
                    span,
                    div,
                    creators,
                    pub_year,
                    pub_date,
                    title,
                    link,
                    description,
                    css_prefix = record.collection;
                if (record.pub_date !== undefined && record.pub_date !== "") {
                    current_year = record.pub_date.substring(1, 5).trim();
                } else {
                    current_year = "unknown year";
                }
                if (show_year_headings === true && current_year != "" && year_heading !== current_year) {
                    if (year_heading === "") {
                        parent_element.classList.add(css_prefix);
                        year_jump_list.classList.add("jump-list");
                    }
                    /* Add link to jump list */
                    year_heading = current_year;
                    a = document.createElement("a");
                    a.classList.add("jump-list-label");
                    if (current_year === "unknown year") {
                        a.classList.add("unknown-year");
                    }
                    a.setAttribute("href", "#" + year_heading);
                    a.setAttribute("title", "Jump to year " + year_heading);
                    a.innerHTML = year_heading;
                    year_jump_list.append(a);

                    /* Add local year element to parent */
                    div = document.createElement("div");
                    div.setAttribute("id", year_heading);
                    div.classList.add("year-heading");
                    if (current_year === "unknown year") {
                        div.classList.add("unknown-year");
                    }
                    div.innerHTML = year_heading;
                    /* Add a new UL list after heading */
                    parent_element.appendChild(div);
                    ul = document.createElement("ul");
                    parent_element.appendChild(ul);
                }
                /* Create our DOM elements, add classes and populate from our common view */
                if (show_creators === true && record.creators.length > 0) {
                    creators = document.createElement("span");
                    creators.classList.add("creator");
                    record.creators.slice(0, 3).forEach(function(creator, i) {
                        if (creator.display_name !== undefined && creator.display_name !== "") {
                            let span = document.createElement("span");
                            if (i > 0) {
                                span.innerHTML = "and";
                                creators.appendChild(span);
                                span = document.createElement("span");
                            }
                            span.classList.add("creator-name");
                            if (creator.orcid !== undefined) {
                                span.setAttribute("title", "orcid: " + creator.orcid);
                            }
                            span.innerHTML = creator.display_name;
                            creators.appendChild(span);
                        }
                    });
                    if (record.creators.length > 3) {
                        creators.append(" et al.");
                    }
                    li.appendChild(creators);
                }
                if (show_pub_date === true && record.pub_date !== undefined && record.pub_date !== "") {
                    pub_date = document.createElement("span");
                    pub_date.classList.add("pub-date");
                    pub_date.innerHTML = " " + record.pub_date + " ";
                    li.appendChild(pub_date);
                }

                title = document.createElement("span");
                title.classList.add("title");
                link = document.createElement("a");
                link.classList.add("link");
                link.setAttribute("href", record.href);
                link.setAttribute("title", "linked to " + record.collection);
                if (show_title_linked === true) {
                    link.innerHTML = record.title;
                    title.appendChild(link);
                    li.appendChild(title);
                } else {
                    title.innerHTML = record.title;
                    link.innerHTML = record.href;
                    li.appendChild(title);
                    li.appendChild(link);
                }
                if (show_citation === true && Object.keys(record.citation_info).length > 0) {
                    ["publication", "series", "volume", "number",
                        "page_range", "pages", "issn", "isbn", "pmcid"
                    ].forEach(function(key) {
                        if (record.citation_info[key] !== undefined &&
                            record.citation_info[key] !== "") {
                            let span = document.createElement("span"),
                                val = record.citation_info[key],
                                label = "";
                            span.classList.add(key);
                            switch (key) {
                                case "publication":
                                    span.innerHTML = val;
                                    break;
                                case "volume":
                                    span.innerHTML = val;
                                    break;
                                case "number":
                                    span.innerHTML = "(" + val + ")";
                                    break;
                                case "page_range":
                                    span.innerHTML = "pp. " + val;
                                    break;
                                case "pages":
                                    span.innerHTML = "pg. " + val;
                                    break;
                                case "issn":
                                    if (show_issn === true) {
                                        span.innerHTML = "ISSN " + val;
                                    }
                                    break;
                                case "isbn":
                                    if (show_isbn === true) {
                                        span.innerHTML = "ISBN " + val;
                                    }
                                    break;
                                case "pmcid":
                                    if (show_pmcid === true) {
                                        span.innerHTML = "PMCID " + val;
                                    }
                                    break;
                                default:
                                    label = titleCase(key.replace("_", " "));
                                    span.innerHTML = label + " " + val;
                                    break;
                            }
                            /* only add the span if we have content */
                            if (span.innerHTML !== "") {
                                li.appendChild(span);
                            }
                        }
                    });
                } else if (show_citation === false && Object.keys(record.citation_info).length > 0) {
                    ["issn", "isbn", "pmcid"].forEach(function(key) {
                        if (record.citation_info[key] !== undefined &&
                            record.citation_info[key] !== "") {
                            let span = document.createElement("span"),
                                val = record.citation_info[key],
                                label = "";
                            span.classList.add(key);
                            switch (key) {
                                case "issn":
                                    if (show_issn === true) {
                                        span.innerHTML = "ISSN " + val;
                                    }
                                    break;
                                case "isbn":
                                    if (show_isbn === true) {
                                        span.innerHTML = "ISBN " + val;
                                    }
                                    break;
                                case "pmcid":
                                    if (show_pmcid === true) {
                                        span.innerHTML = "PMCID " + val;
                                    }
                                    break;
                            }
                            /* only add the span if we have content */
                            if (span.innerHTML !== "") {
                                li.appendChild(span);
                            }
                        }
                    });
                }

                if (show_doi === true && record.doi !== undefined && record.doi !== "") {
                    span = document.createElement("span");
                    span.classList.add("doi");
                    span.innerHTML = record.doi;
                    li.appendChild(span);
                }
                if (show_description === true && record.description !== undefined && record.description !== "") {
                    description = document.createElement("div");
                    description.classList.add("description");
                    description.innerHTML = record.description;
                    li.appendChild(description);
                }
                /* Now add our li to the list */
                ul.appendChild(li);
            });
        };
        /* Add it as our final display element in the pipeline */
        filters.push(__display);
        /* Now run our pipeline */
        self.pipeline(data, err, ...filters);
    };

    /* NOTE: we need to update the global CL after adding our methods */
    if (window.CL === undefined) {
        window.CL = {};
    }
    window.CL = Object.assign(window.CL, CL);
}(document, window));
