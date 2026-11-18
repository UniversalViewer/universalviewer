// One handler for a page's intercepted requests, for the e2e test helpers
// that each need a say in them (testHls's asFirefox refuses some,
// testTiming's delayResponses holds some back): each adds a rule, and the
// handler resolves each request once, by all of them. (Puppeteer's own way of
// sharing intercepted requests, cooperative interception, doesn't hold a
// request back for a delay an action adds.)

// Adds a rule for the page's requests: given a request, it returns "abort" to
// refuse it, a number of milliseconds to hold it back for, or nothing to let
// it through. Call before loading the page.
const interceptRequests = async (page, rule) => {
  if (!page.requestRules) {
    page.requestRules = [];
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const outcomes = page.requestRules.map((rule) => rule(request));
      if (outcomes.includes("abort")) {
        request.abort("failed").catch(() => {});
        return;
      }
      const delay = Math.max(
        0,
        ...outcomes.filter((outcome) => typeof outcome === "number")
      );
      // A request the page has given up on meanwhile can't be continued.
      const resolve = () => request.continue().catch(() => {});
      if (delay) {
        setTimeout(resolve, delay);
      } else {
        resolve();
      }
    });
  }
  page.requestRules.push(rule);
};

module.exports = { interceptRequests };
