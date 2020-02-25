"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Track the characters generated from keyboard input
 * @param  {Array} history List of (max 3) characters
 * @param  {KeyDownEvent} e Synthetic keyboard event from draftjs' `keyBindingFn`
 * @return {Array} The adjusted history
 */
function trackCharacters() {
  var history = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var e = arguments[1];
  var key = e.key;

  // Keep history to <= 3 items because we only need that much to determine
  // whether a list is being indicated

  if (history.length > 2) {
    history = history.slice(1);
  } else {
    history = history.slice();
  }

  history.push(key);
  return history;
}

exports.default = trackCharacters;