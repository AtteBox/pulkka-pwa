/**
 * Create a new pine test suite
 * 
 * Pine is a simple testing framework for testing web pages, programmed for this project and runs in a browser.
 * 
 * @param {*} name 
 * @param {*} describeFunction 
 */
export function describe(name, describeFunction) {
    // TODO: Currently there can be only one describe block
    const testFrame = document.getElementById("testFrame");
    // @ts-ignore
    const testFrameWindow = testFrame.contentWindow;
    const tests = [];
    async function test(name, testFunction) {
        tests.push(async () => {
            const pine = createPine();
            const testResult = { name }
            try {
                await testFunction(pine);
                testResult.passed = true;
            } catch (error) {
                testResult.passed = false;
                testResult.errorMessage = error.message
            }
            return testResult;
        });
    }
    describeFunction({ test });

    testFrameWindow.addEventListener("load", async () => {
        const testResults = [];
        for (const test of tests) {
            testResults.push(await test());
        }
        testResults.forEach(renderTest);
        const stats = calcStats(testResults);
        renderStats(stats);
    }, { once: true });

    function createPine() {
        return {
            get: (/** @type {string} */ cssSelector) => {
                const element = testFrameWindow.document.querySelector(cssSelector);
                if (!element) {
                    throw new Error(`Element not found: ${cssSelector}`);
                }
                return element;
            },
            exists: (/** @type {string} */ cssSelector) => {
                const element = testFrameWindow.document.querySelector(cssSelector);
                return !!element;
            },
            localStorage: window.localStorage,
            reloadPage: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const newTestFrame = document.getElementById("testFrame");
                        newTestFrame.addEventListener("load", () => {
                            resolve();
                        }, { once: true });
                        // @ts-ignore
                        newTestFrame.contentWindow.location.reload();
                    }, 0);
                });
            },
            expect: createExpectObject,
        };
    }

    function createExpectObject(actual) {

        return {
            toEqual: (/** @type {any} */ expected, /** @type {string} */ message) => {
                if (actual !== expected) {
                    throw new Error(`Expected "${actual}" to equal "${expected}"${message ? ": " + message : ""}`);
                }
            },
            toContain: (/** @type {any} */ expected, /** @type {string} */ message) => {
                if (!actual.includes) {
                    throw new Error(`Expected "${actual}" to have the includes method ie. be an array or string`);
                }
                if (!actual.includes(expected)) {
                    throw new Error(`Expected "${actual}" to contain "${expected}"${message ? ": " + message : ""}`);
                }
            },
            not: {
                toEqual: (/** @type {any} */ expected, /** @type {string} */ message) => {
                    if (actual === expected) {
                        throw new Error(`Expected "${actual}" to not equal "${expected}"${message ? ": " + message : ""}`);
                    }
                },
                toContain: (/** @type {any} */ expected, /** @type {string} */ message) => {
                    if (!actual.includes) {
                        throw new Error(`Expected "${actual}" to have the includes method ie. be an array or string`);
                    }
                    if (actual.includes(expected)) {
                        throw new Error(`Expected "${actual}" to not contain "${expected}"${message ? ": " + message : ""}`);
                    }
                }
            }
        }
    }

    function renderTest(testResult) {
        const ulTestResults = document.getElementById("ulTestResults");
        const liTestResult = document.createElement("li");
        liTestResult.innerText = testResult.name;
        if (testResult.passed) {
            liTestResult.className = "pass";
            liTestResult.innerText += ": \u{1F44D}";
        } else {
            liTestResult.className = "fail";
            liTestResult.innerText += `: \u{274C} ${testResult.errorMessage}`;
        }
        ulTestResults.appendChild(liTestResult);
    }

    function calcStats(testResults) {
        const totalTests = testResults.length;
        const totalPasses = testResults.filter((testResult) => testResult.passed).length;
        const totalFails = totalTests - totalPasses;
        return { totalTests, totalPasses, totalFails };
    }

    function renderStats(stats) {
        const spanTotalTests = document.getElementById("spanTotalTests");
        const spanTotalPasses = document.getElementById("spanTotalPasses");
        const spanTotalFails = document.getElementById("spanTotalFails");
        spanTotalTests.innerText = stats.totalTests.toString();
        spanTotalPasses.innerText = stats.totalPasses.toString();
        spanTotalFails.innerText = stats.totalFails.toString();
    }
}
