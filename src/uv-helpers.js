function createUV(selector, data) {
  var uv;
  var isFullScreen = false;
  var container = document.getElementById(selector);
  container.innerHTML = "";
  var parent = document.createElement("div");
  container.appendChild(parent);
  var uv = document.createElement("div");
  parent.appendChild(uv);

  function resize() {
    if (uv) {
      if (isFullScreen) {
        parent.style.width = window.innerWidth + "px";
        parent.style.height = window.innerHeight + "px";
      } else {
        parent.style.width = container.offsetWidth + "px";
        parent.style.height = container.offsetHeight + "px";
      }
      uv.resize();
    }
  }

  window.addEventListener("resize", function() {
    resize();
  });

  window.addEventListener("orientationchange", function() {
    setTimeout(function() {
      resize();
    }, 100);
  });

  uv = new UV.Viewer({
    target: uv,
    data: data
  });

  uv.on("create", function(obj) {}, false);

  uv.on(
    "created",
    function(obj) {
      resize();
    },
    false
  );

  uv.on(
    "openedMedia",
    function() {
      setTimeout(function() {
        resize();
      }, 100);
    },
    false
  );

  uv.on(
    "collectionIndexChanged",
    function(collectionIndex) {
      uv.dataProvider.set("c", collectionIndex);
    },
    false
  );

  uv.on(
    "manifestIndexChanged",
    function(manifestIndex) {
      uv.dataProvider.set("m", manifestIndex);
    },
    false
  );

  uv.on(
    "sequenceIndexChanged",
    function(sequenceIndex) {
      uv.dataProvider.set("s", sequenceIndex);
    },
    false
  );

  uv.on(
    "canvasIndexChanged",
    function(canvasIndex) {
      uv.dataProvider.set("cv", canvasIndex);
    },
    false
  );

  uv.on(
    "rangeChanged",
    function(rangeId) {
      uv.dataProvider.set("rid", rangeId);
    },
    false
  );

  uv.on(
    "openseadragonExtension.rotationChanged",
    function(rotation) {
      uv.dataProvider.set("r", rotation);
    },
    false
  );

  uv.on(
    "openseadragonExtension.xywhChanged",
    function(xywh) {
      uv.dataProvider.set("xywh", xywh);
    },
    false
  );

  uv.on(
    "openseadragonExtension.currentViewUri",
    function(data) {
      //console.log('openseadragonExtension.currentViewUri', obj);
    },
    false
  );

  uv.on(
    "reload",
    function(data) {
      data.isReload = true;
      uv.set(data);
    },
    false
  );

  uv.on(
    "toggleFullScreen",
    function(data) {
      isFullScreen = data.isFullScreen;

      if (data.overrideFullScreen) {
        return;
      }

      if (isFullScreen) {
        var requestFullScreen = getRequestFullScreen(parent);
        if (requestFullScreen) {
          requestFullScreen.call(parent);
          resize();
        }
      } else {
        var exitFullScreen = getExitFullScreen();
        if (exitFullScreen) {
          exitFullScreen.call(document);
          setTimeout(function() {
            resize();
          }, 100);
          // firefox needs extra time when exiting a full screen embed
          setTimeout(function() {
            resize();
          }, 1000);
        }
      }
    },
    false
  );

  uv.on(
    "error",
    function(message) {
      console.error(message);
    },
    false
  );

  uv.on(
    "bookmark",
    function(data) {
      var absUri = parent.document.URL;
      var parts = Utils.Urls.getUrlParts(absUri);
      var relUri =
        parts.pathname + parts.search + parent.document.location.hash;

      if (!relUri.startsWith("/")) {
        relUri = "/" + relUri;
      }

      data.path = relUri;

      console.log("bookmark", data);
    },
    false
  );

  $(document).on(
    "fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange",
    function(e) {
      if (
        (e.type === "webkitfullscreenchange" && !document.webkitIsFullScreen) ||
        (e.type === "fullscreenchange" && !document.fullscreenElement) ||
        (e.type === "mozfullscreenchange" && !document.mozFullScreen) ||
        (e.type === "MSFullscreenChange" &&
          document.msFullscreenElement === null)
      ) {
        uv.exitFullScreen();
      }
    }
  );

  return uv;
}

function getRequestFullScreen(elem) {
  if (elem.webkitRequestFullscreen) {
    return elem.webkitRequestFullscreen;
  }

  if (elem.mozRequestFullScreen) {
    return elem.mozRequestFullScreen;
  }

  if (elem.msRequestFullscreen) {
    return elem.msRequestFullscreen;
  }

  if (elem.requestFullscreen) {
    return elem.requestFullscreen;
  }

  return false;
}

function getExitFullScreen() {
  if (document.webkitExitFullscreen) {
    return document.webkitExitFullscreen;
  }

  if (document.msExitFullscreen) {
    return document.msExitFullscreen;
  }

  if (document.mozCancelFullScreen) {
    return document.mozCancelFullScreen;
  }

  if (document.exitFullscreen) {
    return document.exitFullscreen;
  }

  return false;
}
