
# CL-feeds.js test

This is a test file for putting CL-feeds.js through its paces and to confirm
we have a working `CL` object. 

FIXME: Need to write the tests!

<style>
#status {
    font-size: 1em;
}
</style>
<code><pre id="status"></pre></code>

<!-- START: test sequence for CL-feeds.js -->

<script src="CL-core.js"></script>
<script src="CL-feeds.js"></script>
<script>

(function (document, window) {
"use strict";
let cl = Object.assign({}, window.CL),
    status = document.getElementById("status");

function println(...s) {
    s.forEach(function(s) {
        console.log(s);
        status.append(s + "\n");
    });
}

/*
 * Run the following test sequences
 */
let func_cnt = 0;
    
println("\nRunning tests in a pipeline\n");

function testStuff(tests,err) {
    let self = this;
    if (err !== "") {
        println("FAILED: error", err, tests);
        return;
    }
    tests.errors++;
    println("FAILED: testStuff() not implemented!");
    // tests.success++;
    // println("Testing testTitleField() OK");
    self.nextCallbackFn(tests, err);
}

function testSummary(tests, err) {
    let self = this;
    if (err !== "") {
        println("FAILED: error", err, tests);
        return;
    }
    println("Failures: " + tests.errors);
    println("Warnings: " + tests.warnings);
    println("Successful: " + tests.success + "/" + tests.count);
}

/* Run the rest of the tests in a pipeline */
let tests = {
        "success": 0,
        "warnings": 0,
        "errors": 0,
        "count": 0
    };
cl.pipeline(tests, "", 
    testStuff,
    testSummary);
}(document, window));

</script>

<!--   END: test sequence for CL-feeds.js -->
