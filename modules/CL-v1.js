const version = '1.0.0', licenseText = `
Copyright (c) 2019, Caltech
All rights not granted herein are expressly reserved by Caltech.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors
may be used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.

`;
const CL = {
    Version: `${version}`,
    async pipeline (payload, ...pipelineFns) {
        const nextFunction = pipelineFns?.shift();
        if (nextFunction === undefined) {
            return payload;
        }
        const nextPayload = await nextFunction(payload);
        if (!nextPayload.ok) {
            console.error(nextPayload.error);
            return nextPayload;
        }
        return await this.pipeline(nextPayload, ...pipelineFns);
    },
    setAttribute (name, value) {
        if (this._attributes === undefined) {
            this._attributes = new Map();
        }
        this._attributes.set(name, value);
    },
    getAttribute (name) {
        if (this._attributes !== undefined && this._attributes.has(name)) {
            return this._attributes.get(name);
        }
    },
    hasAttribute (name) {
        if (this._attributes !== undefined) {
            return this._attributes.has(name);
        }
        return false;
    },
    async httpGet (url, contentType) {
        if (typeof url === "string") {
            if (url.startsWith("/") && this.BaseURL !== undefined) {
                url = new URL(this.BaseURL + url);
            } else {
                url = new URL(url);
            }
        }
        const response = await fetch(url instanceof URL ? url.toString() : url, {
            method: 'GET',
            headers: {
                'Content-Type': contentType,
                ...url instanceof URL && (url.pathname.includes(".json.gz") || url.pathname.includes(".js.gz")) ? {
                    'Content-Encoding': 'gzip'
                } : {}
            }
        });
        if (response.ok === undefined || !response.ok) {
            if (response.body !== undefined && response.body !== null) await response.body.cancel();
            return {
                ok: response.ok,
                error: response.statusText,
                data: null
            };
        }
        let data = await response.text();
        if (contentType === "application/json" && data !== undefined && data !== "") {
            data = JSON.parse(data);
        }
        return {
            ok: true,
            error: '',
            data: data
        };
    },
    async httpPost (url, contentType, src) {
        if (typeof url === "string") {
            if (url.startsWith("/") && this.BaseURL !== undefined) {
                url = new URL(this.BaseURL + url);
            } else {
                url = new URL(url);
            }
        }
        const response = await fetch(url instanceof URL ? url.toString() : url, {
            method: 'POST',
            headers: {
                'Content-Type': contentType
            },
            body: src
        });
        if (!response.ok) {
            return {
                ok: response.ok,
                error: response.statusText,
                data: undefined
            };
        }
        let data = await response.text();
        if (contentType === "application/json" && data !== "") {
            data = JSON.parse(data);
        }
        return {
            ok: response.ok,
            error: '',
            data: data
        };
    }
};
const CLFeeds = {
    ...CL,
    FeedsBaseURL: 'https://feeds.library.caltech.edu',
    async getFeed (feedURL) {
        return this.httpGet(feedURL, "text/plain");
    },
    async getPeopleList () {
        const url = `${this.FeedsBaseURL}/people/people_list.json`;
        return this.httpGet(url, "application/json");
    },
    async getPeopleInfo (peopleID) {
        const url = `${this.FeedsBaseURL}/people/${peopleID}/people.json`;
        return this.httpGet(url, "application/json");
    },
    async getPeopleInclude (personID, feedName) {
        const url = `${this.FeedsBaseURL}/people/${personID}/${feedName.toLowerCase()}.include`;
        return this.httpGet(url, "text/plain");
    },
    async getPeopleJSON (personID, feedName) {
        const url = `${this.FeedsBaseURL}/people/${personID}/${feedName.toLowerCase()}.json`;
        return this.httpGet(url, "application/json");
    },
    async getPeopleCustomJSON (peopleID, feedName, idList) {
        const url = `${this.FeedsBaseURL}/people/${peopleID}/${feedName.toLowerCase()}.json`;
        const payload = await this.httpGet(url, "application/json");
        if (!payload.ok) {
            return payload;
        }
        const object_map = {};
        const filtered_list = [];
        payload.data.forEach((obj)=>{
            const key = obj._Key;
            object_map[key] = obj;
        });
        idList.forEach((id)=>{
            const key = id.toString();
            if (key in object_map) {
                filtered_list.push(object_map[key]);
            }
        });
        return {
            ok: true,
            error: "",
            data: filtered_list
        };
    },
    async getPeopleKeys (personID, feedName) {
        const url = `${this.FeedsBaseURL}/people/${personID}/${feedName.toLowerCase()}.keys`;
        const payload = await this.httpGet(url, "text/plain");
        if (!payload.ok) {
            return payload;
        }
        return {
            ok: payload.ok,
            error: payload.error,
            data: payload.data.split("\n")
        };
    },
    async getGroupsList () {
        const url = `${this.FeedsBaseURL}/groups/group_list.json`;
        return this.httpGet(url, "application/json");
    },
    async getGroupInfo (groupID) {
        const url = `${this.FeedsBaseURL}/groups/${groupID}/group.json`;
        return this.httpGet(url, "application/json");
    },
    async getGroupSummary (groupID) {
        const url = `${this.FeedsBaseURL}/groups/${groupID}/group.json`;
        const payload = await this.httpGet(url, "application/json");
        if (!payload.ok) {
            return payload;
        }
        if ('_Key' in payload.data) {
            delete payload.data._Key;
        }
        if ('email' in payload.data) {
            delete payload.data.email;
        }
        if ('CaltechTHESIS' in payload.data) {
            delete payload.data.CaltechTHESIS;
        }
        if ('CaltechAUTHORS' in payload.data) {
            delete payload.data.CaltechAUTHORS;
        }
        if ('CaltechDATA' in payload.data) {
            delete payload.data.CaltechDATA;
        }
        return payload;
    },
    async getGroupInclude (groupID, feedName) {
        const url = `${this.FeedsBaseURL}/groups/${groupID}/${feedName.toLowerCase()}.include`;
        return this.httpGet(url, "text/plain");
    },
    async getGroupJSON (groupID, feedName) {
        const url = `${this.FeedsBaseURL}/groups/${groupID}/${feedName.toLowerCase()}.json`;
        return this.httpGet(url, "application/json");
    },
    async getGroupCustomJSON (groupID, feedName, idList) {
        const url = `${this.FeedsBaseURL}/groups/${groupID}/${feedName.toLowerCase()}.json`;
        const payload = await this.httpGet(url, "application/json");
        if (!payload.ok) {
            return payload;
        }
        const object_map = {};
        const filtered_list = [];
        payload.data.forEach((obj)=>{
            const key = obj._Key;
            object_map[key] = obj;
        });
        idList.forEach((id)=>{
            const key = id.toString();
            if (key in object_map) {
                filtered_list.push(object_map[key]);
            }
        });
        return {
            ok: true,
            error: payload.error,
            data: filtered_list
        };
    },
    async getGroupKeys (groupID, feedName) {
        const url = `${this.FeedsBaseURL}/groups/${groupID}/${feedName.toLowerCase()}.keys`;
        const payload = await this.httpGet(url, "text/plain");
        if (!payload.ok) {
            return payload;
        }
        return {
            ok: payload.ok,
            error: payload.error,
            data: payload.data.split("\n")
        };
    },
    async getPersonInclude (orcid, feedName) {
        const url = `${this.FeedsBaseURL}/person/${orcid}/${feedName.toLowerCase()}.include`;
        return this.httpGet(url, "text/plain");
    },
    async getPersonJSON (orcid, feedName) {
        const url = `${this.FeedsBaseURL}/person/${orcid}/${feedName.toLowerCase()}.json`;
        return this.httpGet(url, "application/json");
    }
};
export { CL as CL };
export { CLFeeds as CLFeeds };
