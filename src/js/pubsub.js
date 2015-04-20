/*! Tiny Pub/Sub - v0.7.0 - 2015-04-20
 * https://github.com/cowboy/jquery-tiny-pubsub
 * Copyright (c) 2015 "Cowboy" Ben Alman; Licensed MIT */
!function(a){var b=a({});a.subscribe=function(){b.off.apply(b,arguments),b.on.apply(b,arguments)},a.unsubscribe=function(){b.off.apply(b,arguments)},a.publish=function(){b.trigger.apply(b,arguments)}}(jQuery);