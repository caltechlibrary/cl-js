import { assert, assertEquals, assertNotEquals } from "@std/assert";
import { CLFeeds } from './CL-feeds.ts'; // Adjust the import path as necessary

Deno.test("CLFeeds getFeed method", async () => {
    const feedURL = "https://feeds.library.caltech.edu/recent/article.json";
    const result = await CLFeeds.getFeed(feedURL);
    assertEquals(result.ok, true, `getFeed should return a successful payload, ${JSON.stringify(result)}`);
    assertNotEquals(result.data, null, `expected feed data, ${JSON.stringify(result)}`); // Adjust based on expected data
});

Deno.test("CLFeeds getPeopleList method", async () => {
    const result = await CLFeeds.getPeopleList();
    assertEquals(result.ok, true, `getPeopleList should return a successful payload, ${JSON.stringify(result)}`);
    assertEquals(result.data.length > 0, true, `People list should not be empty, ${JSON.stringify(result)}`);
});

Deno.test(`CLFeeds getPeopleInfo method`, async () => {
    const peopleID = 'Wennberg-P-O';
    const result = await CLFeeds.getPeopleInfo(peopleID);
    assertEquals(result.ok, true, `getPeopleInfo should return a successful payload, ${JSON.stringify(result)}`);
    assertEquals(result.data.clpid, peopleID, `People info should match the requested ID, ${JSON.stringify(result)}`);
    // This test is for the transition period for cl_people_id being replaced with clpid.
    assertEquals(result.data.cl_people_id, peopleID, `People info should match the requested ID, ${JSON.stringify(result)}`);
});

Deno.test(`CLFeeds getPeopleInclude method`, async () => {
    const personID = 'Wennberg-P-O';
    const feedName = 'article'; //`software`; // I didn't use software because names collidate between CaltechAUTHORS and CaltechDATA.
    const result = await CLFeeds.getPeopleInclude(personID, feedName);
    assertEquals(result.ok, true, `getPeopleInclude should return a successful payload, ${JSON.stringify(result)}`);
    assertEquals(result.data.length > 0, true, `expected include data,\n${result.data}`); // Adjust based on expected data
});

Deno.test(`CLFeeds getPeopleJSON method`, async () => {
    const personID = `Wennberg-P-O`;
    const feedName = `article`;
    const result = await CLFeeds.getPeopleJSON(personID, feedName);
    assertEquals(result.ok, true, `getPeopleJSON should return a successful payload`);
    assertEquals(result.data.length > 0, true, `People JSON should not be empty`);
});

Deno.test(`CLFeeds getPeopleCustomJSON method`, async () => {
    const peopleID = `Adolphs-R`;
    const feedName = `publication_workingpaper`;
    const idList = [`authors:jpjvk-3df02`];
    const result = await CLFeeds.getPeopleCustomJSON(peopleID, feedName, idList);
    assertEquals(result.ok, true, `getPeopleCustomJSON should return a successful payload`);
    assertEquals(result.data.length, idList.length, `Filtered list should match the idList length`);
});

Deno.test(`CLFeeds getPeopleList method`, async () => {
    const result = await CLFeeds.getPeopleList();
    assertEquals(result.ok, true, `getPeopleList should return a successful payload`);
    assertEquals(result.data.length > 0, true, `People keys should not be empty`);
});


Deno.test(`CLFeeds getGroupsList method`, async () => {
    const result = await CLFeeds.getGroupsList();
    assertEquals(result.ok, true, `getGroupsList should return a successful payload`);
    assertEquals(result.data.length > 0, true, `Groups list should not be empty`);
});

Deno.test(`CLFeeds getGroupSummary method`, async () => {
    const groupID = `COVID-19`;
    const result = await CLFeeds.getGroupSummary(groupID);
    assertEquals(result.ok, true, `getGroupSummary should return a successful payload`);
    assertEquals(result.data._Key, undefined, `Group summary should not contain _Key`);
    assertEquals(result.data.CaltechAUTHORS, undefined, `Group summary should not contain CaltechAUTHORS`);
    assertEquals(result.data.CaltechDATA, undefined, `Group summary should not contain CaltechDATA`);
    assertEquals(result.data.CaltechTHESIS, undefined, `Group summary should not contain CaltechTHESIS`);
});

Deno.test(`CLFeeds getGroupInfo method`, async () => {
    const groupID = 'COVID-19';
    const result = await CLFeeds.getGroupInfo(groupID);
    assertEquals(result.ok, true, `getGroupInfo should return a successful payload, ${JSON.stringify(result)}`);
    assertEquals(result.data.key, groupID, `Group info .key is legacy and will go away, it should match the requested ID, ${JSON.stringify(result)}`);
    assertEquals(result.data.cl_group_id, groupID, `Group info .cl_group_id is legacy and will go away, it should match the requested ID, ${JSON.stringify(result)}`);
    assertEquals(result.data.clgid, groupID, `Group info .clgid should match the requested ID, ${JSON.stringify(result)}`);
});

/*

Deno.test(`CLFeeds getGroupInclude method`, async () => {
    const groupID = `COVID-19`;
    const feedName = `article`;
    const result = await CLFeeds.getGroupInclude(groupID, feedName);
    assertEquals(result.ok, true, `getGroupInclude should return a successful payload`);
    assertEquals(result.data.length > 0, true, `expected include data`); // Adjust based on expected data
});

Deno.test(`CLFeeds getGroupJSON method`, async () => {
    const groupID = `COVID-19`;
    const feedName = `article`;
    const result = await CLFeeds.getGroupJSON(groupID, feedName);
    assertEquals(result.ok, true, `getGroupJSON should return a successful payload`);
    assertEquals(result.data.length > 0, true, `Group JSON should not be empty, ${JSON.stringify(result)}`);
});

Deno.test(`CLFeeds getGroupCustomJSON method`, async () => {
    const groupID = 'COVID-19';
    const feedName = 'article';
    const idList = ['authors:eq67h-c9n23'];
    const result = await CLFeeds.getGroupCustomJSON(groupID, feedName, idList);
    assertEquals(result.ok, true, `getGroupCustomJSON should return a successful payload`);
    assertEquals(result.data.length, idList.length, `Filtered list should match the idList length, ${JSON.stringify(result)}, ${JSON.stringify(idList)}`);
});

Deno.test(`CLFeeds getGroupKeys method`, async () => {
    const groupID = `123`;
    const feedName = `exampleFeed`;
    const result = await CLFeeds.getGroupKeys(groupID, feedName);
    assertEquals(result.ok, true, `getGroupKeys should return a successful payload`);
    assertEquals(result.data.length > 0, true, `Group keys should not be empty`);
});

Deno.test(`CLFeeds getPersonInclude method`, async () => {
    const orcid = `123`;
    const feedName = `exampleFeed`;
    const result = await CLFeeds.getPersonInclude(orcid, feedName);
    assertEquals(result.ok, true, `getPersonInclude should return a successful payload`);
    assertEquals(result.data, `expected include data`); // Adjust based on expected data
});

Deno.test(`CLFeeds getPersonJSON method`, async () => {
    const orcid = `123`;
    const feedName = `exampleFeed`;
    const result = await CLFeeds.getPersonJSON(orcid, feedName);
    assertEquals(result.ok, true, `getPersonJSON should return a successful payload`);
    assertEquals(result.data.length > 0, true, `Person JSON should not be empty`);
});
*/

