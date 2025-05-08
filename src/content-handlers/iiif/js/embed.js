(function (funcName, baseObj) {
  // The public function name defaults to window.docReady
  // but you can pass in your own object and own function name and those will be used
  // if you want to put them in a different namespace
  funcName = funcName || "docReady";
  baseObj = baseObj || window;
  var readyList = [];
  var readyFired = false;
  var readyEventHandlersInstalled = false;

  // call this when the document is ready
  // this function protects itself against being called more than once
  function ready() {
    if (!readyFired) {
      // this must be set to true before we start calling callbacks
      readyFired = true;
      for (var i = 0; i < readyList.length; i++) {
        // if a callback here happens to add new ready handlers,
        // the docReady() function will see that it already fired
        // and will schedule the callback to run right after
        // this event loop finishes so all handlers will still execute
        // in order and no new ones will be added to the readyList
        // while we are processing the list
        readyList[i].fn.call(window, readyList[i].ctx);
      }
      // allow any closures held by these functions to free
      readyList = [];
    }
  }

  function readyStateChange() {
    if (document.readyState === "complete") {
      ready();
    }
  }

  // This is the one public interface
  // docReady(fn, context);
  // the context argument is optional - if present, it will be passed
  // as an argument to the callback
  baseObj[funcName] = function (callback, context) {
    // if ready has already fired, then just schedule the callback
    // to fire asynchronously, but right away
    if (readyFired) {
      setTimeout(function () {
        callback(context);
      }, 1);
      return;
    } else {
      // add the function and context to the list
      readyList.push({ fn: callback, ctx: context });
    }
    // if document already ready to go, schedule the ready function to run
    if (document.readyState === "complete") {
      setTimeout(ready, 1);
    } else if (!readyEventHandlersInstalled) {
      // otherwise if we don't have event handlers installed, install them
      if (document.addEventListener) {
        // first choice is DOMContentLoaded event
        document.addEventListener("DOMContentLoaded", ready, false);
        // backup is window load event
        window.addEventListener("load", ready, false);
      } else {
        // must be IE
        document.attachEvent("onreadystatechange", readyStateChange);
        window.attachEvent("onload", ready);
      }
      readyEventHandlersInstalled = true;
    }
  };
})("docReady", window);

docReady(function () {
  // only run this script once per page.
  if (window.embedScriptIncluded) return;
  window.embedScriptIncluded = true;

  // get the script location.
  var s = document.getElementById("embedUV");
  var scriptUri = /.*src="(.*)"/.exec(s.outerHTML)[1];
  var absScriptUri = s.src;
  var loaded = false;
  if (!s) {
    var scripts = document.getElementsByTagName("script");
    s = scripts[scripts.length - 1];
  }
  //get the part preceding 'lib/embed.js'
  var baseUri = /(.*)lib\/embed.js/.exec(scriptUri)[1];
  appUri = baseUri + "uv.html";
  var a = document.createElement("a");
  a.href = absScriptUri;
  var domain = a.hostname;
  //window.isHomeDomain = document.domain === domain;
  var uvDiv = document.getElementsByClassName("uv");

  Array.prototype.forEach.call(uvDiv, function (ud) {
    var z = ud.getAttribute("data-uri");
    var ci = ud.getAttribute("data-collectionindex") || 0;
    var mi = ud.getAttribute("data-manifestindex") || 0;
    var si = ud.getAttribute("data-sequenceindex") || 0;
    var cvi = ud.getAttribute("data-canvasindex") || 0;
    var xywh = ud.getAttribute("data-xywh");
    var r = ud.getAttribute("data-rotation");
    var cfg = ud.getAttribute("data-config") || "";
    var dl = ud.getAttribute("data-locale");
    var manifestUrl = z;

    var fullUrl =
      appUri +
      "#?manifest=" +
      manifestUrl +
      "&c=" +
      ci +
      "&m=" +
      mi +
      "&s=" +
      si +
      "&cv=" +
      cvi +
      "&config=" +
      cfg +
      "&locales=" +
      dl;

    var iframe = document.createElement("iframe");
    iframe.src = fullUrl;
    iframe.width = ud.style.width;
    iframe.height = ud.style.height;
    iframe.setAttribute("allowfullscreen", true);
    ud.appendChild(iframe);
  });
});
