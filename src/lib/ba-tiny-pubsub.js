/*! Tiny Pub/Sub - v0.7.0 - 2015-04-21
* https://github.com/cowboy/jquery-tiny-pubsub
* Copyright (c) 2015 "Cowboy" Ben Alman; Licensed MIT */
(function($) {

  var o = null;

  $.initPubSub = function() {
    o = $({});
  };

  $.subscribe = function() {
    if (!o) {
      $.initPubSub();
    }

    o.on.apply(o, arguments);
  };

  $.unsubscribe = function() {
    if (!o) {
      $.initPubSub();
    }

    o.off.apply(o, arguments);
  };

  $.disposePubSub = function() {
    o = null;
  };

  $.publish = function() {
    if (!o) {
      $.initPubSub();
    }

    o.trigger.apply(o, arguments);
  };

}(jQuery));