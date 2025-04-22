import { assert, assertEquals, assertFalse } from "@std/assert";
import { CL, IPayload } from "./CL-core.ts"; // Adjust the import path as necessary
import { version } from "./version.ts";

Deno.test("CL Version", () => {
  assertEquals(CL.Version, version); // Replace with the actual version
});

Deno.test("CL setAttribute and getAttribute", () => {
  CL.setAttribute("testKey", "testValue");
  assertEquals(CL.getAttribute("testKey"), "testValue");
});

Deno.test("CL hasAttribute", () => {
  CL.setAttribute("testKey", "testValue");
  assert(CL.hasAttribute("testKey"));
  assertFalse(CL.hasAttribute("nonExistentKey"));
});

Deno.test("CL pipeline with successful functions", async () => {
  const payload: IPayload = { ok: true, error: "", data: "initial" };
  const fn1 = async (p: IPayload): Promise<IPayload> => ({
    ...p,
    data: p.data + " modified",
  });
  const result = await CL.pipeline(payload, fn1);
  assertEquals(
    result.ok,
    true,
    `expected result.ok === true, got ${JSON.stringify(result)}`,
  );
  assertEquals(
    result.error,
    "",
    `expected result.error === '', got ${JSON.stringify(result)}`,
  );
  assertEquals(
    result.data,
    "initial modified",
    `expected result.data === 'initial modified', got ${
      JSON.stringify(result)
    }`,
  );
});

Deno.test("CL pipeline with failing function", async () => {
  const payload: IPayload = { ok: true, error: "", data: "initial" };
  const fn1 = async (p: IPayload): Promise<IPayload> => ({
    ok: false,
    error: "Error occurred",
    data: null,
  });
  const result = await CL.pipeline(payload, fn1);
  assertEquals(
    result.ok,
    false,
    `expected result.ok === false, got ${JSON.stringify(result)}`,
  );
  assertEquals(
    result.error,
    "Error occurred",
    `expected result.error === 'Error occurred', got ${JSON.stringify(result)}`,
  );
  assertEquals(
    result.data,
    null,
    `expected result.data === 'initial modified', got ${
      JSON.stringify(result)
    }`,
  );
});

Deno.test("CL httpGet success", async () => {
  // Mock the fetch function if necessary
  const payload = await CL.httpGet(
    "https://feeds.library.caltech.edu/people/people_list.json",
    "application/json",
  );
  assertEquals(payload.ok, true);
  assert(payload.data);
});

Deno.test("CL httpGet failure", async () => {
  const payload = await CL.httpGet(
    "https://feeds.library.caltech.edu/invalid",
    "application/json",
  );
  assertEquals(
    payload.ok,
    false,
    `expected payload.ok === false, got payload -> ${JSON.stringify(payload)}`,
  );
});

/* FIXME: need to set up a service that processes this test.
Deno.test("CL httpPost success", async () => {
  // Mock the fetch function if necessary
  const payload = await CL.httpPost("https://jsonplaceholder.typicode.com/posts", "application/json", JSON.stringify({ title: "foo", body: "bar", userId: 1 }));
  assertEquals(payload.ok, true);
  assert(payload.data);
});

Deno.test("CL httpPost failure", async () => {
  await assertThrowsAsync(async () => {
    await CL.httpPost("https://jsonplaceholder.typicode.com/invalid", "application/json", JSON.stringify({ title: "foo", body: "bar", userId: 1 }));
  });
});
*/
