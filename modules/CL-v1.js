const version = '1.0.0', licenseText = `
Copyright (c) 2025, Caltech
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
            method: "GET",
            headers: {
                "Content-Type": contentType,
                ...url instanceof URL && (url.pathname.includes(".json.gz") || url.pathname.includes(".js.gz")) ? {
                    "Content-Encoding": "gzip"
                } : {}
            }
        });
        if (response.ok === undefined || !response.ok) {
            if (response.body !== undefined && response.body !== null) {
                await response.body.cancel();
            }
            return {
                ok: response.ok,
                error: `${url} -> ${response.status} ${response.statusText}`,
                data: null
            };
        }
        let data = null;
        let src = await response.text();
        if (contentType === "application/json" && src !== undefined && src !== "") {
            try {
                data = JSON.parse(src);
            } catch (err) {
                return {
                    ok: false,
                    error: `${url} -> ${err}`,
                    data: src
                };
            }
            return {
                ok: true,
                error: "",
                data: data
            };
        }
        return {
            ok: true,
            error: "",
            data: src
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
            method: "POST",
            headers: {
                "Content-Type": contentType
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
            error: "",
            data: data
        };
    }
};
const isWindows = globalThis.Deno?.build.os === "windows" || globalThis.navigator?.platform?.startsWith("Win") || globalThis.process?.platform?.startsWith("win") || false;
function assertPath(path) {
    if (typeof path !== "string") {
        throw new TypeError(`Path must be a string, received "${JSON.stringify(path)}"`);
    }
}
function stripSuffix(name, suffix) {
    if (suffix.length >= name.length) {
        return name;
    }
    const lenDiff = name.length - suffix.length;
    for(let i = suffix.length - 1; i >= 0; --i){
        if (name.charCodeAt(lenDiff + i) !== suffix.charCodeAt(i)) {
            return name;
        }
    }
    return name.slice(0, -suffix.length);
}
function lastPathSegment(path, isSep, start = 0) {
    let matchedNonSeparator = false;
    let end = path.length;
    for(let i = path.length - 1; i >= start; --i){
        if (isSep(path.charCodeAt(i))) {
            if (matchedNonSeparator) {
                start = i + 1;
                break;
            }
        } else if (!matchedNonSeparator) {
            matchedNonSeparator = true;
            end = i + 1;
        }
    }
    return path.slice(start, end);
}
function assertArgs(path, suffix) {
    assertPath(path);
    if (path.length === 0) return path;
    if (typeof suffix !== "string") {
        throw new TypeError(`Suffix must be a string, received "${JSON.stringify(suffix)}"`);
    }
}
function stripTrailingSeparators(segment, isSep) {
    if (segment.length <= 1) {
        return segment;
    }
    let end = segment.length;
    for(let i = segment.length - 1; i > 0; i--){
        if (isSep(segment.charCodeAt(i))) {
            end = i;
        } else {
            break;
        }
    }
    return segment.slice(0, end);
}
function isPosixPathSeparator(code) {
    return code === 47;
}
function basename(path, suffix = "") {
    assertArgs(path, suffix);
    const lastSegment = lastPathSegment(path, isPosixPathSeparator);
    const strippedSegment = stripTrailingSeparators(lastSegment, isPosixPathSeparator);
    return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
}
function isPathSeparator(code) {
    return code === 47 || code === 92;
}
function isWindowsDeviceRoot(code) {
    return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function basename1(path, suffix = "") {
    assertArgs(path, suffix);
    let start = 0;
    if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (isWindowsDeviceRoot(drive)) {
            if (path.charCodeAt(1) === 58) start = 2;
        }
    }
    const lastSegment = lastPathSegment(path, isPathSeparator, start);
    const strippedSegment = stripTrailingSeparators(lastSegment, isPathSeparator);
    return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
}
function basename2(path, suffix = "") {
    return isWindows ? basename1(path, suffix) : basename(path, suffix);
}
function extname(path) {
    assertPath(path);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i = path.length - 1; i >= 0; --i){
        const code = path.charCodeAt(i);
        if (isPosixPathSeparator(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path.slice(startDot, end);
}
function extname1(path) {
    assertPath(path);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path.length >= 2 && path.charCodeAt(1) === 58 && isWindowsDeviceRoot(path.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i = path.length - 1; i >= start; --i){
        const code = path.charCodeAt(i);
        if (isPathSeparator(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path.slice(startDot, end);
}
function extname2(path) {
    return isWindows ? extname1(path) : extname(path);
}
const MimeTypes = {
    ".json": "application/json",
    ".md": "text/plain",
    ".html": "text/html",
    ".include": "text/plain",
    ".bib": "text/plain",
    ".rss": "application/rss+xml"
};
const CLFeeds = {
    ...CL,
    FeedsBaseURL: "https://feeds.library.caltech.edu",
    async getFeed (feedURL) {
        let mimeType = "text/plain";
        let ext = "";
        const u = URL.parse(feedURL);
        if (u !== null) {
            ext = extname2(u.pathname);
            if (ext in MimeTypes) {
                mimeType = MimeTypes[ext];
            }
        }
        return this.httpGet(feedURL, mimeType);
    },
    async getPeopleList () {
        const url = `${this.FeedsBaseURL}/people/people_list.json`;
        return await this.httpGet(url, "application/json");
    },
    async getPeopleInfo (peopleID) {
        const url = `${this.FeedsBaseURL}/people/${peopleID}/people.json`;
        return await this.httpGet(url, "application/json");
    },
    async getPeopleInclude (personID, feedName) {
        const url = `${this.FeedsBaseURL}/people/${personID}/${feedName.toLowerCase()}.include`;
        return await this.httpGet(url, "text/plain");
    },
    async getPeopleJSON (personID, feedName) {
        const url = `${this.FeedsBaseURL}/people/${personID}/${feedName.toLowerCase()}.json`;
        return await this.httpGet(url, "application/json");
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
            const key = obj.id;
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
        if ("_Key" in payload.data) {
            delete payload.data._Key;
        }
        if ("email" in payload.data) {
            delete payload.data.email;
        }
        if ("CaltechTHESIS" in payload.data) {
            delete payload.data.CaltechTHESIS;
        }
        if ("CaltechAUTHORS" in payload.data) {
            delete payload.data.CaltechAUTHORS;
        }
        if ("CaltechDATA" in payload.data) {
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
            if (obj.id !== undefined) {
                const key = noramalize_repo_record_id(obj.id);
                object_map[key] = obj;
            }
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
    }
};
function noramalize_repo_record_id(txt) {
    if (txt.startsWith("https://")) {
        const u = URL.parse(txt) || new URL("");
        if (u.pathname !== undefined) {
            const pid = basename2(u.pathname);
            let parts = u.hostname.split(".");
            return `${parts[0]}:${pid}`;
        }
    }
    return txt;
}
export { CL as CL };
export { CLFeeds as CLFeeds };
