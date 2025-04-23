#!/usr/bin/env deno

import * as path from '@std/path';
import { transpile } from "@deno/emit";
import { GREEN, YELLOW, ERROR_COLOR } from "./colors.ts";

/* Transpile directory_client.ts to JavaScript to be used by the people edit form. */
const modules_path = "modules";

// transpileJavaScript accepts a list of TypeScript files to be rendered
// as JavaScript for use in the browser. It relies on the "emit" package.
// @params javaScriptFiles (array of string) to be processed
// @params targetPath (string) the target of where to render the JavaScript files to.
export async function transpileToJavaScript(
  javaScriptFiles: string[],
  targetPath: string,
): Promise<boolean> {
  console.log(
    `%ctranspiling ${javaScriptFiles} to ${modules_path}`,
    "color: green",
  );
  for (const fname of javaScriptFiles) {
    console.log(`%creading ${fname}`, "color: green");
    const url = new URL(fname, import.meta.url);
    let result: Map<string, string>;
    try {
      result = await transpile(url);
    } catch (err) {
      console.log(`%ctranspile error: ${err}`, ERROR_COLOR);
      return false;
    }
    const src: string | undefined = result.get(url.href);
    if (src === undefined) {
      console.log(`%cfailed to compile ${fname}, not output.`, ERROR_COLOR);
      return false;
    }
    const targetName = path.join(targetPath, fname.replace(/.ts$/, ".js"));
    console.log(`%cwriting ${targetName}`, YELLOW);
    try {
      await Deno.writeTextFile(targetName, src);
    } catch (err) {
      console.log(`%cfailed to write ${targetName}, ${err}`, ERROR_COLOR);
      return false;
    }
  }
  return true;
}

// Run build.ts
if (import.meta.main) {
  await Deno.mkdir(modules_path, { mode: 0o775, recursive: true });
  let transpileFiles = ["CL-core.ts", "CL-feeds.ts" ];
  let ok: boolean = await transpileToJavaScript(transpileFiles, modules_path);
  if (
    ok
  ) {
    console.log(`%ctranspile ${transpileFiles} success!`, GREEN);
  } else {
    console.log(`%cERROR: failed to transpile ${javaScriptFiles}`, ERROR_COLOR);
    Deno.exit(1);
  }
}
