/**
 * CL-feeds-ui.ts builds on the CL and CLFeeds objects providing simple support for constructing DOM based UI.
 *
 * @author R. S. Doiel
 *
 * Copyright (c) 2025, Caltech
 * All rights not granted herein are expressly reserved by Caltech.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
//import { CL, type CLInterface, type IPipelineFunction, type IPayload } from "./CL-core.ts";
import { CLFeeds } from "./CL-feeds";


interface Record {
    collection?: string;
    id?: string;
    title?: string;
    type?: string;
    book_title?: string;
    official_url?: string;
    doi?: string;
    primary_object?: { mime_type?: string; url?: string };
    volume?: string;
    number?: string;
    series?: string;
    pagerange?: string;
    publisher?: string;
    publication?: string;
    issn?: string;
    isbn?: string;
    edition?: string;
    event_title?: string;
    event_dates?: string;
    event_location?: string;
    ispublished?: string;
    pmcid?: string;
    pmc_id?: string;
    date_type?: string;
    date?: string;
    creators?: { items?: Array<{ name?: { given?: string; family?: string }; id?: string; orcid?: string }> };
    abstract?: string;
    descriptions?: string[];
    resourceType?: { resourceTypeGeneral?: string };
    titles?: Array<{ title?: string }>;
    nameIdentifiers?: Array<{ nameIdentifierScheme?: string; nameIdentifier?: string }>;
}

interface View {
    href: string;
    title: string;
    creators: Array<{ id?: string; display_name: string; orcid?: string; pos: number }>;
    description: string;
    pub_date: string;
    collection: string;
    doi: string;
    primary_object: { url?: string; label?: string };
    resource_type: string;
    book_title?: string;
    volume?: string;
    number?: string;
    series?: string;
    page_range?: string;
    publisher?: string;
    publication?: string;
    issn?: string;
    isbn?: string;
    edition?: string;
    event_title?: string;
    event_dates?: string;
    event_location?: string;
    ispublished?: string;
    pmcid?: string;
}

interface Config {
    show_search_box?: boolean;
    filters?: Function[];
    feed_count?: boolean;
    show_year_headings?: boolean;
    creators?: boolean;
    pub_date?: boolean;
    title_link?: boolean;
    link?: boolean;
    publisher?: boolean;
    publication?: boolean;
    page_numbers?: boolean;
    chapters?: boolean;
    issue?: boolean;
    volume?: boolean;
    issn_or_isbn?: boolean;
    pmcid?: boolean;
    doi?: boolean;
    primary_object?: boolean;
    description?: boolean;
    parent_element?: HTMLElement;
}

interface CLType {
    createCompositElement: (element_type: string, child_element_types: string[], child_element_ids?: string[], child_element_classes?: string[]) => HTMLElement;
    normalize_view: (data: Record[]) => Promise<View[]>;
    recentN: (data: any[], N: number) => Promise<any[]>;
    viewer: (data: View[], config: Config) => Promise<void>;
    pipeline: (data: any, err: string, ...filters: Function[]) => Promise<any>;
}

export const CLFeedsUI: CLType = {
    createCompositElement(element_type, child_element_types, child_element_ids = [], child_element_classes = []) {
        const outer = document.createElement(element_type);
        child_element_types.forEach((child_element_type, i) => {
            const inner = document.createElement(child_element_type);
            if (i < child_element_ids.length && child_element_ids[i] !== "") {
                inner.setAttribute("id", child_element_ids[i]);
            }
            if (i < child_element_classes.length && child_element_classes[i] !== "") {
                const css_classes = child_element_classes[i].split(" ");
                css_classes.forEach((css_class) => {
                    inner.classList.add(css_class);
                });
            }
            outer.appendChild(inner);
        });
        return outer;
    },

    async normalize_view(data) {
        const normal_view: View[] = [];

        for (const record of data) {
            const view: View = {
                href: "",
                title: "",
                creators: [],
                description: "",
                pub_date: "",
                collection: "",
                doi: "",
                primary_object: {},
                resource_type: ""
            };

            if (isEPrintsRecord(record)) {
                view.collection = record.collection!;
                view.title = record.title!;
                if (record.type) view.resource_type = record.type;
                if (record.book_title) view.book_title = record.book_title;
                view.href = record.official_url!;
                if (record.doi) view.doi = record.doi;
                if (record.primary_object && record.primary_object.mime_type && record.primary_object.url) {
                    let label = record.primary_object.mime_type.split('/')[1].toUpperCase();
                    view.primary_object = { url: record.primary_object.url, label };
                }
                if (record.volume) view.volume = record.volume;
                if (record.number) view.number = record.number;
                if (record.series) view.series = record.series;
                if (record.pagerange) view.page_range = record.pagerange;
                if (record.publisher) view.publisher = record.publisher;
                if (record.publication) view.publication = record.publication;
                if (record.issn) view.issn = record.issn;
                if (record.isbn) view.isbn = record.isbn;
                if (record.edition) view.edition = record.edition;
                if (record.event_title) view.event_title = record.event_title;
                if (record.event_dates) view.event_dates = record.event_dates;
                if (record.event_location) view.event_location = record.event_location;
                if (record.ispublished === "inpress") view.ispublished = "(In Press)";
                if (record.ispublished === "submitted") view.ispublished = "(Submitted)";
                if (record.pmcid) view.pmcid = record.pmcid;
                else if (record.pmc_id) view.pmcid = record.pmc_id;
                view.pub_date = '';
                if (record.date_type && ['completed', 'published', 'inpress', 'submitted', 'degree'].includes(record.date_type)) {
                    view.pub_date = `(${record.date!.substring(0, 4)})`;
                } else if (record.type && record.date && ['conference_item', 'teaching_resource'].includes(record.type)) {
                    view.pub_date = `(${record.date.substring(0, 4)})`;
                }
                if (record.creators && record.creators.items) {
                    view.creators = record.creators.items.map((creator, i) => {
                        let display_name = "";
                        if (creator.name?.given && creator.name?.family) {
                            display_name = `${creator.name.family}, ${creator.name.given}`;
                        } else if (creator.name?.family) {
                            display_name = creator.name.family;
                        }
                        return {
                            id: creator.id,
                            display_name,
                            orcid: creator.orcid,
                            pos: i
                        };
                    });
                    if (record.type === 'conference_item') {
                        view.event_title = record.event_title;
                        view.event_dates = record.event_dates;
                        view.event_location = record.event_location;
                    }
                }
                view.description = record.abstract || "";
            } else {
                view.collection = "CaltechDATA";
                view.title = record.titles![0].title!;
                if (record.resourceType?.resourceTypeGeneral) view.resource_type = record.resourceType.resourceTypeGeneral;
                view.pub_date = record.publicationYear!;
                if (record.creators) {
                    view.creators = record.creators.map((creator, i) => {
                        let display_name = creator.creatorName || "";
                        let orcid = "";
                        if (creator.nameIdentifiers) {
                            const orcidIdentifier = creator.nameIdentifiers.find(id => id.nameIdentifierScheme === "ORCID");
                            if (orcidIdentifier) orcid = orcidIdentifier.nameIdentifier;
                        }
                        return { display_name, orcid, pos: i };
                    });
                }
                view.description = record.descriptions?.join("<p>") || "";
            }
            normal_view.push(view);
        }
        return normal_view;
    },

    async recentN(data, N) {
        if (N === undefined || !Number.isInteger(N) || N < 1) {
            throw new Error("recentN attribute not set properly, an integer greater than zero required");
        }
        if (Array.isArray(data)) {
            return data.slice(0, N);
        }
        throw new Error("data was not an array, can't take N of them");
    },

    async viewer(data, config) {
        const filters: Function[] = config.filters || [];
        const parent_element = config.parent_element || document.body;

        const __display = async (records: View[]) => {
            parent_element.innerHTML = "";
            const ul = document.createElement("ul");
            const feed_count = document.createElement("div");
            const year_jump_list = document.createElement("div");
            let year_heading = "";

            if (config.show_feed_count) {
                feed_count.innerHTML = `(${records.length} records)`;
                parent_element.append(feed_count);
            }

            if (config.show_year_headings) {
                parent_element.append(year_jump_list);
            } else {
                parent_element.appendChild(ul);
            }

            records.forEach(record => {
                const current_year = record.pub_date ? record.pub_date.substring(1, 5).trim() : "unknown year";
                const li = document.createElement("li");
                const css_prefix = record.collection;

                if (config.show_year_headings && current_year && year_heading !== current_year) {
                    if (!year_heading) {
                        parent_element.classList.add(css_prefix);
                        year_jump_list.classList.add("jump-list");
                    }
                    year_heading = current_year;
                    const a = document.createElement("a");
                    a.classList.add("jump-list-label");
                    if (current_year === "unknown year") a.classList.add("unknown-year");
                    a.setAttribute("href", `#${year_heading}`);
                    a.setAttribute("title", `Jump to year ${year_heading}`);
                    a.innerHTML = year_heading;
                    year_jump_list.append(a);

                    const div = document.createElement("div");
                    div.setAttribute("id", year_heading);
                    div.classList.add("year-heading");
                    if (current_year === "unknown year") div.classList.add("unknown-year");
                    div.innerHTML = year_heading;
                    parent_element.appendChild(div);
                    ul = document.createElement("ul");
                    parent_element.appendChild(ul);
                }

                if (config.show_creators && record.creators.length > 0) {
                    const creators = document.createElement("span");
                    creators.classList.add("creator");
                    record.creators.slice(0, 2).forEach((creator, i) => {
                        if (creator.display_name) {
                            const span = document.createElement("span");
                            if (i > 0) {
                                const separator = document.createElement("span");
                                separator.innerHTML = ";";
                                creators.appendChild(separator);
                            }
                            span.classList.add("creator-name");
                            if (creator.orcid) span.setAttribute("title", `orcid: ${creator.orcid}`);
                            span.innerHTML = creator.display_name;
                            creators.appendChild(span);
                        }
                    });
                    if (record.creators.length > 2) creators.append(" et al.");
                    li.appendChild(creators);
                }

                if (config.show_pub_date && record.pub_date) {
                    const pub_date = document.createElement("span");
                    pub_date.classList.add("pub-date");
                    pub_date.innerHTML = ` ${record.pub_date} `;
                    li.appendChild(pub_date);
                }

                const title = document.createElement("span");
                title.classList.add("title");
                const link = document.createElement("a");
                link.classList.add("link");
                link.setAttribute("href", record.href);
                link.setAttribute("title", `linked to ${record.collection}`);
                if (config.show_title_linked) {
                    link.innerHTML = record.title;
                    title.appendChild(link);
                } else {
                    title.innerHTML = `<em>${record.title}</em>`;
                }
                li.appendChild(title);

                if (record.book_title) {
                    const book_title = document.createElement("span");
                    book_title.classList.add("book-title");
                    book_title.innerHTML = `In: <em>${record.book_title}</em>`;
                    li.appendChild(book_title);
                }

                const citationKeys = [
                    "publisher", "publication", "series", "volume", "number",
                    "chapters", "page_range", "issn", "isbn", "pmcid",
                    "event_title", "event_dates", "event_location", "ispublished"
                ];

                citationKeys.forEach(key => {
                    if (record[key as keyof View]) {
                        const span = document.createElement("span");
                        span.classList.add(key);
                        let val = record[key as keyof View]!;
                        let label = "";
                        switch (key) {
                            case "ispublished":
                                span.innerHTML = val;
                                break;
                            case "publisher":
                                if (config.show_publisher) span.innerHTML = val;
                                break;
                            case "publication":
                                if (config.show_publication) span.innerHTML = config.show_title_linked ? val : `; ${val}`;
                                break;
                            case "volume":
                                if (config.show_volume) span.innerHTML = `; Vol. ${val}`;
                                break;
                            case "series":
                                if (config.show_volume) span.innerHTML = record.number ? `Series ${val}, ${record.number}.` : `Series ${val}.`;
                                break;
                            case "number":
                                if (config.show_issue && (!record.series || record.series === "")) span.innerHTML = `; No. ${val}`;
                                break;
                            case "chapters":
                                if (config.show_chapters) span.innerHTML = `; ch. ${val}`;
                                break;
                            case "page_range":
                                if (config.show_page_numbers) span.innerHTML = `; pp. ${val}`;
                                break;
                            case "issn":
                                if (config.show_issn) span.innerHTML = `ISSN ${val}`;
                                break;
                            case "isbn":
                                if (config.show_isbn) span.innerHTML = `ISBN ${val}`;
                                break;
                            case "pmcid":
                                if (config.show_pmcid) span.innerHTML = `PMCID ${val}`;
                                break;
                            case "event_title":
                                span.innerHTML = `In: ${val}`;
                                break;
                            case "event_dates":
                                span.innerHTML = `, ${val}`;
                                break;
                            case "event_location":
                                span.innerHTML = `, ${val}`;
                                break;
                            default:
                                label = titleCase(key.replace("_", " "));
                                span.innerHTML = `${label} ${val}`;
                                break;
                        }
                        if (span.innerHTML) li.appendChild(span);
                    }
                });

                if (config.show_description && record.description) {
                    const description = document.createElement("div");
                    description.classList.add("description");
                    description.innerHTML = record.description;
                    li.appendChild(description);
                }

                if (config.show_link) {
                    const span = document.createElement("span");
                    span.classList.add("official-url");
                    span.innerHTML = `<a href="${record.href}">${record.href}</a>`;
                    li.appendChild(span);
                }

                if (config.show_doi && record.doi) {
                    const span = document.createElement("span");
                    span.classList.add("doi");
                    span.innerHTML = `DOI <a href="https://doi.org/${record.doi}">${record.doi}</a>`;
                    li.appendChild(span);
                }

                if (config.show_primary_object && record.primary_object.url) {
                    const span = document.createElement("span");
                    span.classList.add("primary_object");
                    span.innerHTML = `<a href="${record.primary_object.url}">${record.primary_object.label}</a>`;
                    li.appendChild(span);
                }

                ul.appendChild(li);
            });
        };

        filters.push(__display);
        await this.pipeline(data, "", ...filters);
    },

    async pipeline(data: any, err: string, ...filters: Function[]) {
        let result = data;
        for (const filter of filters) {
            result = await filter(result, err);
        }
        return result;
    }
};

function isEPrintsRecord(record: Record): boolean {
    if (record.collection && (record.collection === "CaltechAUTHORS" || record.collection === "CaltechTHESIS")) {
        return true;
    }
    if (record.id && typeof record.id === "string" && record.id.includes("eprint")) {
        return true;
    }
    return false;
}

function titleCase(s: string): string {
    return s.split(" ").map(word => {
        if (word.endsWith(".")) return word;
        if (["of", "the", "a", "and", "or"].includes(word)) return word.toLowerCase();
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }).join(" ");
}

