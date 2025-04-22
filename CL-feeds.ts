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
 */


// NOTE: We use the jsr import so we can bundle this as CL.js and CL-feeds.js.
import * as path from "jsr:@std/path";

import { CL, type CLInterface, IPayload } from "./CL-core.ts";

interface CLFeedsInterface extends CLInterface {
  FeedsBaseURL: string;

  getFeed(feedURL: string): Promise<IPayload>;
  getPeopleList(): Promise<IPayload>;
  getPeopleInfo(peopleID: string): Promise<IPayload>;
  getPeopleInclude(personID: string, feedName: string): Promise<IPayload>;
  getPeopleJSON(personID: string, feedName: string): Promise<IPayload>;
  getPeopleCustomJSON(
    peopleID: string,
    feedName: string,
    idList: string[],
  ): Promise<IPayload>;
  // NOTE: getPeopleKeys is depreciated, we stopped producing the keys files in Fall 2023, RSD 2025-04-22
  // getPeopleKeys(personID: string, feedName: string): Promise<IPayload>;

  getGroupsList(): Promise<IPayload>;
  getGroupInfo(groupID: string): Promise<IPayload>;
  getGroupSummary(groupID: string): Promise<IPayload>;
  getGroupInclude(groupID: string, feedName: string): Promise<IPayload>;
  getGroupJSON(groupID: string, feedName: string): Promise<IPayload>;
  getGroupCustomJSON(
    groupID: string,
    feedName: string,
    idList: string[],
  ): Promise<IPayload>;
  // NOTE: getGroupKeys is depreciated, we stopped producing the keys files in Fall 2023, RSD 2025-04-22
  // getGroupKeys(groupID: string, feedName: string): Promise<IPayload>;
  // NOTE: Depreciated, we're not maintaining the original ORCID based person paths for at least five years. RSD 2025-04-22
  // getPersonInclude(orcid: string, feedName: string): Promise<IPayload>;
  // getPersonJSON(orcid: string, feedName: string): Promise<IPayload>;
}

export const MimeTypes: { [key: string]: string } = {
  ".json": "application/json",
  ".md": "text/plain",
  ".html": "text/html",
  ".include": "text/plain",
  ".bib": "text/plain",
  ".rss": "application/rss+xml",
};

export const CLFeeds: CLFeedsInterface = {
  ...CL,
  FeedsBaseURL: "https://feeds.library.caltech.edu",

  async getFeed(feedURL: string): Promise<IPayload> {
    let mimeType: string = "text/plain";
    let ext: string = "";
    const u = URL.parse(feedURL);
    if (u !== null) {
      ext = path.extname(u.pathname);
      if (ext in MimeTypes) {
        mimeType = MimeTypes[ext];
      }
    }
    return this.httpGet(feedURL, mimeType);
  },

  async getPeopleList(): Promise<IPayload> {
    const url = `${this.FeedsBaseURL}/people/people_list.json`;
    return await this.httpGet(url, "application/json");
  },

  async getPeopleInfo(peopleID: string): Promise<IPayload> {
    const url = `${this.FeedsBaseURL}/people/${peopleID}/people.json`;
    return await this.httpGet(url, "application/json");
  },

  async getPeopleInclude(
    personID: string,
    feedName: string,
  ): Promise<IPayload> {
    const url =
      `${this.FeedsBaseURL}/people/${personID}/${feedName.toLowerCase()}.include`;
    return await this.httpGet(url, "text/plain");
  },

  async getPeopleJSON(personID: string, feedName: string): Promise<IPayload> {
    const url =
      `${this.FeedsBaseURL}/people/${personID}/${feedName.toLowerCase()}.json`;
    return await this.httpGet(url, "application/json");
  },

  //NOTE: I would like to depreciate this but need to check with Cynthia and Katarina before I do just incase they used it. RSD 2025-04-22
  async getPeopleCustomJSON(
    peopleID: string,
    feedName: string,
    idList: string[],
  ): Promise<IPayload> {
    const url =
      `${this.FeedsBaseURL}/people/${peopleID}/${feedName.toLowerCase()}.json`;
    const payload: IPayload = await this.httpGet(url, "application/json");
    if (!payload.ok) {
      return payload;
    }
    const object_map: { [key: string]: any } = {};
    const filtered_list: any[] = [];

    payload.data.forEach((obj: any) => {
      const key = obj.id;
      object_map[key] = obj;
    });

    idList.forEach((id) => {
      const key = id.toString();
      if (key in object_map) {
        filtered_list.push(object_map[key]);
      }
    });
    return { ok: true, error: "", data: filtered_list };
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
    */

  async getGroupsList(): Promise<IPayload> {
    const url = `${this.FeedsBaseURL}/groups/group_list.json`;
    return this.httpGet(url, "application/json");
  },

  async getGroupInfo(groupID: string): Promise<IPayload> {
    const url = `${this.FeedsBaseURL}/groups/${groupID}/group.json`;
    return this.httpGet(url, "application/json");
  },

  async getGroupSummary(groupID: string): Promise<IPayload> {
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

  async getGroupInclude(groupID: string, feedName: string): Promise<IPayload> {
    const url =
      `${this.FeedsBaseURL}/groups/${groupID}/${feedName.toLowerCase()}.include`;
    return this.httpGet(url, "text/plain");
  },

  async getGroupJSON(groupID: string, feedName: string): Promise<IPayload> {
    const url =
      `${this.FeedsBaseURL}/groups/${groupID}/${feedName.toLowerCase()}.json`;
    return this.httpGet(url, "application/json");
  },

  //NOTE: I would like to depreciate this but need to check with Cynthia and Katarina before I do just incase they used it. RSD 2025-04-22
  async getGroupCustomJSON(
    groupID: string,
    feedName: string,
    idList: string[],
  ): Promise<IPayload> {
    const url =
      `${this.FeedsBaseURL}/groups/${groupID}/${feedName.toLowerCase()}.json`;
    const payload = await this.httpGet(url, "application/json");
    if (!payload.ok) {
      return payload;
    }

    const object_map: { [key: string]: any } = {};
    const filtered_list: any[] = [];

    payload.data.forEach((obj: any) => {
      if (obj.id !== undefined) {
        const key = noramalize_repo_record_id(obj.id);
        object_map[key] = obj;
      }
    });

    idList.forEach((id) => {
      const key = id.toString();
      if (key in object_map) {
        filtered_list.push(object_map[key]);
      }
    });
    return { ok: true, error: payload.error, data: filtered_list };
  },
  // NOTE: getGroupKeys is depreciated, we stopped producing the keys files in Fall 2023, RSD 2025-04-22
  /*
    async getGroupKeys(groupID: string, feedName: string): Promise<IPayload> {
        const url = `${this.FeedsBaseURL}/groups/group_list.json`;
        const payload = await this.httpGet(url, "application/json");
        if (!payload.ok) {
            return payload;
        }
        let key_list: string[] = [];
        for (let obj of payload.data) {
            if ('clgid' in obj) {
                key_list.push(obj.clgid);
            }
        }
        return { ok: payload.ok, error: payload.error, data: key_list.join('\n') };
   }.
   */

  /*NOTE: Depreciated, we're not maintaining the original ORCID based person paths for at least five years. RSD 2025-04-22
    async getPersonInclude(orcid: string, feedName: string): Promise<IPayload> {
        const url = `${this.FeedsBaseURL}/person/${orcid}/${feedName.toLowerCase()}.include`;
        return this.httpGet(url, "text/plain");
    },

    async getPersonJSON(orcid: string, feedName: string): Promise<IPayload> {
        const url = `${this.FeedsBaseURL}/person/${orcid}/${feedName.toLowerCase()}.json`;
        return this.httpGet(url, "application/json");
    }
    */
};

function noramalize_repo_record_id(txt: string): string {
  if (txt.startsWith("https://")) {
    const u: URL = URL.parse(txt) || new URL("");
    if (u.pathname !== undefined) {
      const pid = path.basename(u.pathname);
      let parts = u.hostname.split(".");
      return `${parts[0]}:${pid}`;
    }
  }
  return txt;
}
