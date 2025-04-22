/**
 * CL-feeds.ts provides access to Caltech Library resources on <feeds.library.caltech.edu>.
 *
 * @author R. S. Doiel
 *
 * Copyright (c) 2025, Caltech
 *
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
 */ import * as path from "jsr:@std/path";
import { CL } from "./CL-core.ts";
export const MimeTypes = {
  ".json": "application/json",
  ".md": "text/plain",
  ".html": "text/html",
  ".include": "text/plain",
  ".bib": "text/plain",
  ".rss": "application/rss+xml"
};
export const CLFeeds = {
  ...CL,
  FeedsBaseURL: "https://feeds.library.caltech.edu",
  async getFeed (feedURL) {
    let mimeType = "text/plain";
    let ext = "";
    const u = URL.parse(feedURL);
    if (u !== null) {
      ext = path.extname(u.pathname);
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
  //NOTE: I would like to depreciate this but need to check with Cynthia and Katarina before I do just incase they used it. RSD 2025-04-22
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
  // NOTE: getPeopleKeys is depreciated, we stopped producing the keys files in Fall 2023, RSD 2025-04-22
  /*
    async getPeopleKeys(personID: string, feedName: string): Promise<IPayload> {
        const url = `${this.FeedsBaseURL}/people/people_list.json`;
        const payload: IPayload = await this.httpGet(url, "text/plain");
        if (!payload.ok) {
            return payload;
        }
        let key_list: string[] = [];
        for (let obj of payload.data) {
            if ('clpid' in obj) {
                key_list.push(obj.clpid);
            }
        }
        return {ok: payload.ok, error: payload.error, data: key_list.join('\n')};
    },
    */ async getGroupsList () {
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
  //NOTE: I would like to depreciate this but need to check with Cynthia and Katarina before I do just incase they used it. RSD 2025-04-22
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
      const pid = path.basename(u.pathname);
      let parts = u.hostname.split(".");
      return `${parts[0]}:${pid}`;
    }
  }
  return txt;
}
