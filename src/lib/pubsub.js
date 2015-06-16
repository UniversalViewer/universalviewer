/*! Tiny Pub/Sub - v0.7.0 - 2015-04-21
 * https://github.com/cowboy/jquery-tiny-pubsub
 * Copyright (c) 2015 "Cowboy" Ben Alman; Licensed MIT */
!function(a){var b=null;a.initPubSub=function(){b=a({})},a.subscribe=function(){b||a.initPubSub(),b.on.apply(b,arguments)},a.unsubscribe=function(){b||a.initPubSub(),b.off.apply(b,arguments)},a.disposePubSub=function(){b=null},a.publish=function(){b||a.initPubSub(),b.trigger.apply(b,arguments)}}(jQuery);