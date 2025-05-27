/*!
 * This is an edited version of source-chooser from the MediaElement plugin.
 * https://github.com/mediaelement/mediaelement-plugins/blob/master/dist/source-chooser/source-chooser.js
 * Version: v2.5.1
 * Last Copied: 2024-10-16
 * License: MIT (https://johndyer.mit-license.org)
 *
 * This was done to:
 * 1. fix the improper use of .siblings() on line 144 (of the original).
 * 2. improve keyboard support of the source chooser button and menu (line 67).
 *
 * These changes have been contributed upstream.
 * Once the issues are resolved, this file should be deleted.
 * https://github.com/mediaelement/mediaelement-plugins/pull/266
 *
 * Chris Hallberg (challber@villanova.edu)
 */

/*!
 * MediaElement.js
 * http://www.mediaelementjs.com/
 *
 * Wrapper that mimics native HTML5 MediaElement (audio and video)
 * using a variety of technologies (pure JavaScript, Flash, iframe)
 *
 * Copyright 2010-2017, John Dyer (http://j.hn/)
 * License: MIT
 *
 */ (function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (_dereq_, module, exports) {
        "use strict";

        mejs.i18n.en["mejs.source-chooser"] = "Source Chooser";

        Object.assign(mejs.MepDefaults, {
          sourcechooserText: null,
        });

        Object.assign(MediaElementPlayer.prototype, {
          buildsourcechooser: function buildsourcechooser(
            player,
            controls,
            layers,
            media
          ) {
            var t = this,
              sourceTitle = mejs.Utils.isString(t.options.sourcechooserText)
                ? t.options.sourcechooserText
                : mejs.i18n.t("mejs.source-chooser"),
              sources = [],
              children = t.mediaFiles ? t.mediaFiles : t.node.children;

            var hoverTimeout = void 0;

            for (var i = 0, total = children.length; i < total; i++) {
              var s = children[i];

              if (t.mediaFiles) {
                sources.push(s);
              } else if (s.nodeName === "SOURCE") {
                sources.push(s);
              }
            }

            if (sources.length <= 1) {
              return;
            }

            player.sourcechooserButton = document.createElement("div");
            player.sourcechooserButton.className =
              t.options.classPrefix +
              "button " +
              t.options.classPrefix +
              "sourcechooser-button";
            player.sourcechooserButton.innerHTML =
              '<button type="button" role="button" aria-haspopup="true" aria-owns="' +
              t.id +
              '" title="' +
              sourceTitle +
              '" aria-label="' +
              sourceTitle +
              '" tabindex="0"></button>' +
              ('<div class="' +
                t.options.classPrefix +
                "sourcechooser-selector " +
                t.options.classPrefix +
                'offscreen" role="menu" aria-expanded="false" aria-hidden="true"><ul></ul></div>');

            t.addControlElement(player.sourcechooserButton, "sourcechooser");

            for (var _i = 0, _total = sources.length; _i < _total; _i++) {
              var src = sources[_i];
              if (
                src.type !== undefined &&
                typeof media.canPlayType === "function"
              ) {
                player.addSourceButton(
                  src.src,
                  src.title,
                  src.type,
                  media.src === src.src
                );
              }
            }

            player.sourcechooserButton.addEventListener(
              "mouseover",
              function () {
                clearTimeout(hoverTimeout);
                player.showSourcechooserSelector();
              }
            );
            player.sourcechooserButton.addEventListener(
              "mouseout",
              function () {
                hoverTimeout = setTimeout(function () {
                  player.hideSourcechooserSelector();
                }, 0);
              }
            );

            player.sourcechooserButton.addEventListener(
              "keydown",
              function (e) {
                function focusNext(dir = 1) {
                  const radioEls = Array.from(
                    player.sourcechooserButton.querySelectorAll(
                      'input[type="radio"]'
                    )
                  );
                  const index = radioEls.indexOf(document.activeElement);
                  const next = dir === 1 ? 1 : radioEls.length - 1;
                  const nextIndex = (index + next) % radioEls.length;
                  radioEls[nextIndex].focus();
                }

                if (t.options.keyActions.length) {
                  var keyCode = e.which || e.keyCode || 0;

                  let stopPropagation = false;
                  switch (keyCode) {
                    case 13: // Enter
                    case 32: // Space Bar
                      if (!player.isSourcechooserSelectorOpen()) {
                        player.showSourcechooserSelector();
                        player.sourcechooserButton
                          .querySelector("input[type=radio]:checked")
                          .focus();
                        stopPropagation = true;
                      } else if (
                        document.activeElement.matches('input[type="radio"]') &&
                        player.sourcechooserButton.contains(
                          document.activeElement
                        )
                      ) {
                        // Handle keyboard selection of radio inputs
                        document.activeElement.click();
                        stopPropagation = true;

                        // a slight delay before close
                        // to show that the new source was selected
                        setTimeout(() => {
                          player.hideSourcechooserSelector();
                          player.sourcechooserButton
                            .querySelector("button")
                            .focus();
                        }, 150);
                      }
                      break;
                    case 27: // Escape
                      player.hideSourcechooserSelector();
                      player.sourcechooserButton
                        .querySelector("button")
                        .focus();
                      stopPropagation = true;
                      break;
                    case 9: // Tab
                      if (player.isSourcechooserSelectorOpen()) {
                        // Get focused element
                        const checked = document.activeElement;
                        // Focus next radio element
                        if (
                          checked.matches('input[type="radio"]') &&
                          player.sourcechooserButton.contains(checked)
                        ) {
                          focusNext(e.shiftKey ? -1 : 1);
                          stopPropagation = true;
                        }
                      }
                      break;

                    // Handle keyboard selection of radio inputs
                    case 37: // Left Arrow
                    case 38: // Up Arrow
                    case 39: // Right Arrow
                    case 40: // Down Arrow
                      if (!player.isSourcechooserSelectorOpen()) {
                        break;
                      }

                      if (
                        document.activeElement.matches('input[type="radio"]') &&
                        player.sourcechooserButton.contains(
                          document.activeElement
                        )
                      ) {
                        const dir = keyCode === 37 || keyCode === 38 ? -1 : 1;
                        focusNext(dir);
                        stopPropagation = true;
                      }
                      break;
                    default:
                      return true;
                  }

                  if (stopPropagation) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }

                  return true;
                }
              }
            );

            player.sourcechooserButton.addEventListener(
              "focusout",
              mejs.Utils.debounce(function () {
                setTimeout(function () {
                  var parent = document.activeElement.closest(
                    "." + t.options.classPrefix + "sourcechooser-selector"
                  );
                  if (!parent) {
                    player.hideSourcechooserSelector();
                  }
                }, 0);
              }, 100)
            );

            var radios =
              player.sourcechooserButton.querySelectorAll("input[type=radio]");

            for (var _i2 = 0, _total2 = radios.length; _i2 < _total2; _i2++) {
              radios[_i2].addEventListener("click", function () {
                this.setAttribute("aria-selected", true);
                this.checked = true;

                var otherRadios = this.closest(
                  "." + t.options.classPrefix + "sourcechooser-selector"
                ).querySelectorAll("input[type=radio]");

                for (
                  var j = 0, radioTotal = otherRadios.length;
                  j < radioTotal;
                  j++
                ) {
                  if (otherRadios[j] !== this) {
                    otherRadios[j].setAttribute("aria-selected", "false");
                    otherRadios[j].removeAttribute("checked");
                  }
                }

                var src = this.value;

                if (media.getSrc() !== src) {
                  var currentTime = media.currentTime;

                  var paused = media.paused,
                    canPlayAfterSourceSwitchHandler =
                      function canPlayAfterSourceSwitchHandler() {
                        if (!paused) {
                          media.setCurrentTime(currentTime);
                          media.play();
                        }
                        media.removeEventListener(
                          "canplay",
                          canPlayAfterSourceSwitchHandler
                        );
                      };

                  media.pause();
                  media.setSrc(src);
                  media.load();
                  media.addEventListener(
                    "canplay",
                    canPlayAfterSourceSwitchHandler
                  );
                }
              });
            }

            player.sourcechooserButton
              .querySelector("button")
              .addEventListener("click", function () {
                var t = this;

                if (
                  t.sourcechooserButton === undefined ||
                  !t.sourcechooserButton.querySelector("input[type=radio]")
                ) {
                  return false;
                }

                if (!player.isSourcechooserSelectorOpen()) {
                  player.showSourcechooserSelector();
                  player.sourcechooserButton
                    .querySelector("input[type=radio]:checked")
                    .focus();
                } else {
                  player.hideSourcechooserSelector();
                }
              });
          },
          addSourceButton: function addSourceButton(
            src,
            label,
            type,
            isCurrent
          ) {
            var t = this;
            if (label === "" || label === undefined) {
              label = src;
            }
            type = type.split("/")[1];

            t.sourcechooserButton.querySelector("ul").innerHTML +=
              "<li>" +
              ('<input type="radio" name="' +
                t.id +
                '_sourcechooser" id="' +
                t.id +
                "_sourcechooser_" +
                label +
                type +
                '" ') +
              ('role="menuitemradio" value="' +
                src +
                '" ' +
                (isCurrent ? 'checked="checked"' : "") +
                ' aria-selected="' +
                isCurrent +
                '"/>') +
              ('<label for="' +
                t.id +
                "_sourcechooser_" +
                label +
                type +
                '" aria-hidden="true">' +
                label +
                " (" +
                type +
                ")</label>") +
              "</li>";

            t.adjustSourcechooserBox();
          },
          adjustSourcechooserBox: function adjustSourcechooserBox() {
            var t = this;

            t.sourcechooserButton.querySelector(
              "." + t.options.classPrefix + "sourcechooser-selector"
            ).style.height =
              parseFloat(
                t.sourcechooserButton.querySelector(
                  "." + t.options.classPrefix + "sourcechooser-selector ul"
                ).offsetHeight
              ) + "px";
          },
          /**
           * @returns {boolean}
           */
          isSourcechooserSelectorOpen: function isSourcechooserSelectorOpen() {
            var t = this;

            if (
              t.sourcechooserButton === undefined ||
              !t.sourcechooserButton.querySelector("input[type=radio]")
            ) {
              return false;
            }

            var selectorEl = t.sourcechooserButton.querySelector(
              "." + t.options.classPrefix + "sourcechooser-selector"
            );
            return (
              mejs.Utils.hasClass(
                selectorEl,
                t.options.classPrefix + "offscreen"
              ) === false
            );
          },
          hideSourcechooserSelector: function hideSourcechooserSelector() {
            var t = this;

            if (
              t.sourcechooserButton === undefined ||
              !t.sourcechooserButton.querySelector("input[type=radio]")
            ) {
              return;
            }

            var selector = t.sourcechooserButton.querySelector(
                "." + t.options.classPrefix + "sourcechooser-selector"
              ),
              radios = selector.querySelectorAll("input[type=radio]");
            selector.setAttribute("aria-expanded", "false");
            selector.setAttribute("aria-hidden", "true");
            mejs.Utils.addClass(selector, t.options.classPrefix + "offscreen");

            for (var i = 0, total = radios.length; i < total; i++) {
              radios[i].setAttribute("tabindex", "-1");
            }
          },
          showSourcechooserSelector: function showSourcechooserSelector() {
            var t = this;

            if (
              t.sourcechooserButton === undefined ||
              !t.sourcechooserButton.querySelector("input[type=radio]")
            ) {
              return;
            }

            var selector = t.sourcechooserButton.querySelector(
                "." + t.options.classPrefix + "sourcechooser-selector"
              ),
              radios = selector.querySelectorAll("input[type=radio]");
            selector.setAttribute("aria-expanded", "true");
            selector.setAttribute("aria-hidden", "false");
            mejs.Utils.removeClass(
              selector,
              t.options.classPrefix + "offscreen"
            );

            for (var i = 0, total = radios.length; i < total; i++) {
              radios[i].setAttribute("tabindex", "0");
            }
          },
        });
      },
      {},
    ],
  },
  {},
  [1]
);
