function createUV(selector, data, dataProvider) {

    return {

        uv: null,
        isFullScreen: false,
        $container: $(selector),
        $parent: $('<div></div>'),
        $uv: $('<div></div>'),
        resizeEvent: "window:" + selector + "resize",

        init() {

            this.$container.empty();
            this.$container.append(this.$parent);
            this.$parent.append(this.$uv);

            var that = this;

            window.onresize = function() {
                $(window).trigger(that.resizeEvent);
            }

            $(window).on(that.resizeEvent, function (e) {
                that.resize();
            });

            this.uv = new UV({
                target: this.$uv[0],
                data: data
            });
        
            this.uv.on('create', function(obj) {
                that.resize();
            }, false);
        
            this.uv.on('created', function(obj) {
               that.resize();
            }, false);
        
            this.uv.on('collectionIndexChanged', function(collectionIndex) {
                dataProvider.set('c', collectionIndex);
            }, false);
        
            this.uv.on('manifestIndexChanged', function(manifestIndex) {
                dataProvider.set('m', manifestIndex);
            }, false);
        
            this.uv.on('sequenceIndexChanged', function(sequenceIndex) {
                dataProvider.set('s', sequenceIndex);
            }, false);
        
            this.uv.on('canvasIndexChanged', function(canvasIndex) {
                dataProvider.set('cv', canvasIndex);
            }, false);
        
            this.uv.on('rangeChanged', function(rangeId) {
                dataProvider.set('rid', rangeId);
            }, false);
        
            this.uv.on('openseadragonExtension.rotationChanged', function(rotation) {
                dataProvider.set('r', rotation);
            }, false);
        
            this.uv.on('openseadragonExtension.xywhChanged', function(xywh) {
                dataProvider.set('xywh', xywh);
            }, false);
        
            this.uv.on('openseadragonExtension.currentViewUri', function(data) {
                //console.log('openseadragonExtension.currentViewUri', obj);
            }, false);
        
            this.uv.on('reload', function(data) {
                data.isReload = true;
                that.uv.set(data);
            }, false);
        
            this.uv.on('toggleFullScreen', function(data) {
                this.isFullScreen = data.isFullScreen;
        
                if (data.overrideFullScreen) {
                    return;
                }
        
                var elem = that.$parent[0];

                if (isFullScreen) {
                    var requestFullScreen = getRequestFullScreen(elem);
                    if (requestFullScreen) {
                        requestFullScreen.call(elem);
                        that.resize();
                    }
                } else {
                    var exitFullScreen = getExitFullScreen();
                    if (exitFullScreen) {
                        exitFullScreen.call(document);
                        that.resize();
                    }
                }
            }, false);
        
            this.uv.on('error', function(message) {
                console.error(message);
            }, false);
        
            this.uv.on('bookmark', function(data) {
        
                var absUri = parent.document.URL;
                var parts = Utils.Urls.getUrlParts(absUri);
                var relUri = parts.pathname + parts.search + parent.document.location.hash;
        
                if (!relUri.startsWith("/")) {
                    relUri = "/" + relUri;
                }
        
                data.path = relUri;
        
                console.log('bookmark', data);
            },false);
        
            $(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function(e) {
                if (e.type === 'webkitfullscreenchange' && !document.webkitIsFullScreen ||
                e.type === 'fullscreenchange' && !document.fullscreenElement ||
                e.type === 'mozfullscreenchange' && !document.mozFullScreen ||
                e.type === 'MSFullscreenChange' && document.msFullscreenElement === null) {
                    that.uv.exitFullScreen();
                }
            });
        },

        resize() {

            if (this.uv) {
                if (this.isFullScreen) {
                    this.$parent.width(window.innerWidth);
                    this.$parent.height(window.innerHeight);
                } else {
                    this.$parent.width(this.$container.width());
                    this.$parent.height(this.$container.height());
                }
                this.uv.resize();
            }

        }

    }
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