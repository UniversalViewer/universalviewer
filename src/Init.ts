import { Events } from "./Events";
import { UniversalViewer } from "./UniversalViewer";

export const init = (el: string | HTMLDivElement, data) => {
  let isFullScreen = false;
  let overrideFullScreen = false;
  const container = typeof el === "string" ? document.getElementById(el) : el;

  if (!container) {
    throw new Error("UV target element not found");
  }

  container.innerHTML = "";
  const parent = document.createElement("div");
  container.appendChild(parent);
  // extra div is needed for safari full screen
  const uvDiv = document.createElement("div");
  parent.appendChild(uvDiv);

  const uv = new UniversalViewer({
    target: uvDiv,
    data: data,
  });

  const resize = () => {
    if (!uv) {
      return;
    }

    if (isFullScreen && !overrideFullScreen) {
      // is full screen and not overridden.
      parent.style.width = window.innerWidth + "px";
      parent.style.height = window.innerHeight + "px";
    } else {
      // either we're not full screen or scaling to the window size is overridden
      parent.style.width = container.offsetWidth + "px";
      parent.style.height = container.offsetHeight + "px";
    }
    uv.resize();
  };

  window.addEventListener("resize", function () {
    resize();
  });

  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      resize();
    }, 100);
  });

  // todo: can we remove the following two event listeners
  // by using css to scale the parent div?
  uv.on(
    Events.CREATED,
    function (_obj) {
      resize();
    },
    false
  );

  uv.on(
    Events.EXTERNAL_RESOURCE_OPENED,
    function (_obj) {
      setTimeout(function () {
        resize();
      }, 100);
    },
    false
  );

  uv.on(
    Events.TOGGLE_FULLSCREEN,
    function (data) {
      isFullScreen = data.isFullScreen;
      overrideFullScreen = data.overrideFullScreen;

      if (!data.overrideFullScreen) {
        if (isFullScreen) {
          const requestFullScreen = getRequestFullScreen(parent);
          if (requestFullScreen) {
            requestFullScreen.call(parent);
            // resize();
          }
        } else {
          const exitFullScreen = getExitFullScreen();
          if (exitFullScreen) {
            exitFullScreen.call(document);
            // firefox needs extra time when exiting a full screen embed
            // setTimeout(function() {
            //   resize();
            // }, 100);
          }
        }
      }

      setTimeout(function () {
        resize();
      }, 100);
    },
    false
  );

  uv.on(
    Events.ERROR,
    function (message) {
      console.error(message);
    },
    false
  );

  function fullScreenChange(e) {
    if (
      (e.type === "webkitfullscreenchange" && !document.webkitIsFullScreen) ||
      (e.type === "fullscreenchange" && !document.fullscreenElement) ||
      (e.type === "mozfullscreenchange" && !document.mozFullScreen) ||
      (e.type === "MSFullscreenChange" && document.msFullscreenElement === null)
    ) {
      uv.exitFullScreen();
    }
  }

  document.addEventListener("fullscreenchange", fullScreenChange, false);
  document.addEventListener("webkitfullscreenchange", fullScreenChange, false);
  document.addEventListener("mozfullscreenchange", fullScreenChange, false);
  document.addEventListener("MSFullscreenChange", fullScreenChange, false);

  return uv;
};

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
