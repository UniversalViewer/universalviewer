define(function() {
  return function(formats) {
    var sync = ["aframe-1.0.3.min", "OrbitControls", "aleph.proxy"];
    var async = ["MetadataComponent"];
    if (formats.includes("application/dicom")) {
      sync.push("ami.min");
    }
    return {
      sync: sync,
      async: async
    };
  };
});
