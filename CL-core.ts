/**
 * CL-core provides a simple content retrieval model for browser and Deno.
 * It is used by CL-feeds for access to <feeds.library.caltech.edu> content.
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

import { version } from "./version.ts";

// IPayload describes the input and output object for Pipeline functions.
export interface IPayload {
  ok: boolean;
  error: string;
  data: any;
}

// IPiplineFunction is function that accepts a IPayLoad and returns an IPayLoad.
export interface IPipelineFunction {
  (payload: IPayload): Promise<IPayload>;
}

export interface CLInterface {
  Version: string;
  _attributes?: Map<string, any>;
  BaseURL?: string;

  pipeline(
    payload: IPayload,
    ...pipelineFns: IPipelineFunction[]
  ): Promise<IPayload>;
  setAttribute(name: string, value: any): void;
  getAttribute(name: string): any;
  hasAttribute(name: string): boolean;
  httpGet(url: string | URL, contentType: string): Promise<IPayload>;
  httpPost(
    url: string | URL,
    contentType: string,
    src: string,
  ): Promise<IPayload>;
}

export const CL: CLInterface = {
  Version: `${version}`,

  async pipeline(
    payload: IPayload,
    ...pipelineFns: IPipelineFunction[]
  ): Promise<IPayload> {
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

  setAttribute(name: string, value: any) {
    if (this._attributes === undefined) {
      this._attributes = new Map();
    }
    this._attributes.set(name, value);
  },

  getAttribute(name: string): any {
    if (this._attributes !== undefined && this._attributes.has(name)) {
      return this._attributes.get(name);
    }
  },

  hasAttribute(name: string): boolean {
    if (this._attributes !== undefined) {
      return this._attributes.has(name);
    }
    return false;
  },

  async httpGet(url: string | URL, contentType: string): Promise<IPayload> {
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
        ...(url instanceof URL &&
            (url.pathname.includes(".json.gz") ||
              url.pathname.includes(".js.gz"))
          ? { "Content-Encoding": "gzip" }
          : {}),
      },
    });
    if (response.ok === undefined || !response.ok) {
      if (response.body !== undefined && response.body !== null) {
        await response.body.cancel();
      }
      return {
        ok: response.ok,
        error: `${url} -> ${response.status} ${response.statusText}`,
        data: null,
      };
    }
    let data: any = null;
    let src = await response.text();
    if (contentType === "application/json" && src !== undefined && src !== "") {
      try {
        data = JSON.parse(src);
      } catch (err) {
        return { ok: false, error: `${url} -> ${err}`, data: src };
      }
      return { ok: true, error: "", data: data };
    }
    return { ok: true, error: "", data: src };
  },

  async httpPost(
    url: string | URL,
    contentType: string,
    src: string,
  ): Promise<IPayload> {
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
        "Content-Type": contentType,
      },
      body: src,
    });

    if (!response.ok) {
      return { ok: response.ok, error: response.statusText, data: undefined };
    }

    let data = await response.text();
    if (contentType === "application/json" && data !== "") {
      data = JSON.parse(data);
    }
    return { ok: response.ok, error: "", data: data };
  },
};
