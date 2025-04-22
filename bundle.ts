/**
 * bundle.ts is an example of "bundling" the TypeScript into a single JavaScript file.
 */
import * as path from "@std/path";
import { bundle } from "@deno/emit";
import { GREEN, ERROR_COLOR } from "./colors.ts";

// Now I need to bundle CL.ts as modules/CL-v1.js
let ts_name = "CL.ts";
let js_name = path.join("modules", "CL-v1.js");
try {
	const result = await bundle(ts_name);
	const { code } = result;
	await Deno.writeTextFile(js_name, code);
	console.log(`%cbundle ${js_name} success!`, GREEN);
} catch (err) {
	console.log(`%c bundling ${ts_name} failed, ${err}`, ERROR_COLOR);
	Deno.exit(1);
}
