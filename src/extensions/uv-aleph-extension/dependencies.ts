define(function() {
    return function(formats: string[]) {

        var sync = ['aframe-master.min', 'OrbitControls', 'aleph.proxy'];
        var async = ['MetadataComponent'];

        if (formats.includes("application/dicom")) {
            sync.push('ami.min');
        }

        return {
            sync: sync,
            async: async
        };
    }
});