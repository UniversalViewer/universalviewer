// virtex v0.3.0 https://github.com/edsilv/virtex#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.virtex = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
///<reference path="../node_modules/typescript/lib/lib.es6.d.ts"/> 

var Virtex;
(function (Virtex) {
    var StringValue = (function () {
        function StringValue(value) {
            this.value = "";
            if (value) {
                this.value = value.toLowerCase();
            }
        }
        StringValue.prototype.toString = function () {
            return this.value;
        };
        return StringValue;
    }());
    Virtex.StringValue = StringValue;
})(Virtex || (Virtex = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Virtex;
(function (Virtex) {
    var FileType = (function (_super) {
        __extends(FileType, _super);
        function FileType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FileType.DRACO = new FileType("application/draco");
        FileType.CORTO = new FileType("application/corto");
        FileType.GLTF = new FileType("model/gltf+json");
        FileType.OBJ = new FileType("text/plain");
        FileType.THREEJS = new FileType("application/vnd.threejs+json");
        return FileType;
    }(Virtex.StringValue));
    Virtex.FileType = FileType;
})(Virtex || (Virtex = {}));

var Virtex;
(function (Virtex) {
    var CORTOFileTypeHandler = (function () {
        function CORTOFileTypeHandler() {
        }
        CORTOFileTypeHandler.setup = function (viewport, obj) {
            var bufferGeometry = obj.geometry;
            /*            const material = new THREE.MeshStandardMaterial({vertexColors: THREE.VertexColors});
                        let geometry;
                        // Point cloud does not have face indices.
                        if (bufferGeometry.index == null) {
                            geometry = new THREE.Points(bufferGeometry, material);
                        } else {
                            bufferGeometry.computeVertexNormals();
                            geometry = new THREE.Mesh(bufferGeometry, material);
                        }
            */
            // Compute range of the geometry coordinates for proper rendering.
            bufferGeometry.computeBoundingBox();
            var sizeX = bufferGeometry.boundingBox.max.x - bufferGeometry.boundingBox.min.x;
            var sizeY = bufferGeometry.boundingBox.max.y - bufferGeometry.boundingBox.min.y;
            var sizeZ = bufferGeometry.boundingBox.max.z - bufferGeometry.boundingBox.min.z;
            var diagonalSize = Math.sqrt(sizeX * sizeX + sizeY * sizeY + sizeZ * sizeZ);
            var scale = 1.0 / diagonalSize;
            var midX = (bufferGeometry.boundingBox.min.x + bufferGeometry.boundingBox.max.x) / 2;
            var midY = (bufferGeometry.boundingBox.min.y + bufferGeometry.boundingBox.max.y) / 2;
            var midZ = (bufferGeometry.boundingBox.min.z + bufferGeometry.boundingBox.max.z) / 2;
            obj.scale.multiplyScalar(scale);
            obj.position.x = -midX * scale;
            obj.position.y = -midY * scale;
            obj.position.z = -midZ * scale;
            obj.castShadow = true;
            obj.receiveShadow = true;
            //            obj = geometry;
            viewport.objectGroup.add(obj);
            viewport.createCamera();
        };
        return CORTOFileTypeHandler;
    }());
    Virtex.CORTOFileTypeHandler = CORTOFileTypeHandler;
})(Virtex || (Virtex = {}));

var Virtex;
(function (Virtex) {
    var DRACOFileTypeHandler = (function () {
        function DRACOFileTypeHandler() {
        }
        DRACOFileTypeHandler.setup = function (viewport, obj) {
            var bufferGeometry = obj;
            var material = new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors });
            var geometry;
            // Point cloud does not have face indices.
            if (bufferGeometry.index == null) {
                geometry = new THREE.Points(bufferGeometry, material);
            }
            else {
                bufferGeometry.computeVertexNormals();
                geometry = new THREE.Mesh(bufferGeometry, material);
            }
            // Compute range of the geometry coordinates for proper rendering.
            bufferGeometry.computeBoundingBox();
            var sizeX = bufferGeometry.boundingBox.max.x - bufferGeometry.boundingBox.min.x;
            var sizeY = bufferGeometry.boundingBox.max.y - bufferGeometry.boundingBox.min.y;
            var sizeZ = bufferGeometry.boundingBox.max.z - bufferGeometry.boundingBox.min.z;
            var diagonalSize = Math.sqrt(sizeX * sizeX + sizeY * sizeY + sizeZ * sizeZ);
            var scale = 1.0 / diagonalSize;
            var midX = (bufferGeometry.boundingBox.min.x + bufferGeometry.boundingBox.max.x) / 2;
            var midY = (bufferGeometry.boundingBox.min.y + bufferGeometry.boundingBox.max.y) / 2;
            var midZ = (bufferGeometry.boundingBox.min.z + bufferGeometry.boundingBox.max.z) / 2;
            geometry.scale.multiplyScalar(scale);
            geometry.position.x = -midX * scale;
            geometry.position.y = -midY * scale;
            geometry.position.z = -midZ * scale;
            geometry.castShadow = true;
            geometry.receiveShadow = true;
            obj = geometry;
            viewport.objectGroup.add(obj);
            viewport.createCamera();
        };
        return DRACOFileTypeHandler;
    }());
    Virtex.DRACOFileTypeHandler = DRACOFileTypeHandler;
})(Virtex || (Virtex = {}));

var Virtex;
(function (Virtex) {
    var glTFFileTypeHandler = (function () {
        function glTFFileTypeHandler() {
        }
        glTFFileTypeHandler.setup = function (viewport, obj) {
            viewport.objectGroup.add(obj.scene);
            if (obj.animations) {
                var animations = obj.animations;
                for (var i = 0, l = animations.length; i < l; i++) {
                    //const animation = animations[i];
                    //animation.loop = true;
                    //animation.play();
                }
            }
            viewport.scene = obj.scene;
            if (obj.cameras && obj.cameras.length) {
                viewport.camera = obj.cameras[0];
            }
        };
        return glTFFileTypeHandler;
    }());
    Virtex.glTFFileTypeHandler = glTFFileTypeHandler;
})(Virtex || (Virtex = {}));


var Virtex;
(function (Virtex) {
    var ObjFileTypeHandler = (function () {
        function ObjFileTypeHandler() {
        }
        ObjFileTypeHandler.setup = function (viewport, obj, objpath) {
            var imgloader = new THREE.MTLLoader();
            imgloader.setPath(objpath.substring(0, objpath.lastIndexOf("/") + 1));
            imgloader.load(obj.materialLibraries[0], function (materials) {
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(objpath, function (object) {
                    viewport.objectGroup.add(object);
                    viewport.createCamera();
                }, function (e) { console.log("obj progress", e); }, function (e) { console.log("obj error", e); });
            }, function (e) { console.log("mtl progress", e); }, function (e) { console.log("mtl error", e); });
        };
        return ObjFileTypeHandler;
    }());
    Virtex.ObjFileTypeHandler = ObjFileTypeHandler;
})(Virtex || (Virtex = {}));

var Virtex;
(function (Virtex) {
    var ThreeJSFileTypeHandler = (function () {
        function ThreeJSFileTypeHandler() {
        }
        ThreeJSFileTypeHandler.setup = function (viewport, obj) {
            // use the three.js setting in Blender's material tab
            // if (this.options.doubleSided) {
            //     obj.traverse((child: any) => {
            //         if (child.material) child.material.side = THREE.DoubleSide;
            //     });
            // }
            viewport.objectGroup.add(obj);
            viewport.createCamera();
        };
        return ThreeJSFileTypeHandler;
    }());
    Virtex.ThreeJSFileTypeHandler = ThreeJSFileTypeHandler;
})(Virtex || (Virtex = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 200);
        };
})();
var Virtex;
(function (Virtex) {
    var Viewport = (function (_super) {
        __extends(Viewport, _super);
        function Viewport(options) {
            var _this = _super.call(this, options) || this;
            _this._viewportCenter = new THREE.Vector2();
            _this._isFullscreen = false;
            _this._isMouseDown = false;
            _this._isVRMode = false;
            _this._mousePos = new THREE.Vector2();
            _this._mousePosOnMouseDown = new THREE.Vector2();
            _this._pinchStart = new THREE.Vector2();
            _this._targetRotationOnMouseDown = new THREE.Vector2();
            _this._targetRotation = new THREE.Vector2();
            _this._vrEnabled = true;
            var success = _this._init();
            _this._resize();
            if (success) {
                _this._tick();
            }
            return _this;
        }
        Viewport.prototype._init = function () {
            var success = _super.prototype._init.call(this);
            if (!success) {
                console.error("Virtex failed to initialise");
                return false;
            }
            if (!Detector.webgl) {
                Detector.addGetWebGLMessage();
                this._$oldie = $('#oldie');
                this._$oldie.appendTo(this._$element);
                return false;
            }
            this._$element.append('<div class="viewport"></div><div class="loading"><div class="bar"></div></div>');
            this._$viewport = this._$element.find('.viewport');
            this._$loading = this._$element.find('.loading');
            this._$loadingBar = this._$loading.find('.bar');
            this._$loading.hide();
            this.scene = new THREE.Scene();
            this.objectGroup = new THREE.Object3D();
            this.scene.add(this.objectGroup);
            this._createLights();
            this.createCamera();
            this._createControls();
            this._createRenderer();
            this._createEventListeners();
            this._loadObject(this.options.data.file);
            // STATS //
            if (this.options.data.showStats) {
                this._stats = new Stats();
                this._stats.domElement.style.position = 'absolute';
                this._stats.domElement.style.top = '0px';
                this._$viewport.append(this._stats.domElement);
            }
            return true;
        };
        Viewport.prototype.data = function () {
            return {
                alpha: true,
                ambientLightColor: 0xd0d0d0,
                ambientLightIntensity: 1,
                antialias: true,
                cameraZ: 4.5,
                directionalLight1Color: 0xffffff,
                directionalLight1Intensity: 0.75,
                directionalLight2Color: 0x002958,
                directionalLight2Intensity: 0.5,
                doubleSided: true,
                fadeSpeed: 1750,
                far: 10000,
                file: "",
                fullscreenEnabled: true,
                maxZoom: 10,
                minZoom: 2,
                near: 0.05,
                shading: THREE.SmoothShading,
                showStats: false,
                type: Virtex.FileType.THREEJS,
                vrBackgroundColor: 0x000000,
                zoomSpeed: 1
            };
        };
        Viewport.prototype._getVRDisplay = function () {
            return new Promise(function (resolve) {
                navigator.getVRDisplays().then(function (devices) {
                    for (var i = 0; i < devices.length; i++) {
                        if (devices[i] instanceof VRDisplay) {
                            resolve(devices[i]);
                            break;
                        }
                    }
                    resolve(undefined);
                }, function () {
                    // No devices found
                    resolve(undefined);
                });
            });
        };
        Viewport.prototype._createLights = function () {
            this._lightGroup = new THREE.Object3D();
            this.scene.add(this._lightGroup);
            var light1 = new THREE.DirectionalLight(this.options.data.directionalLight1Color, this.options.data.directionalLight1Intensity);
            light1.position.set(1, 1, 1);
            this._lightGroup.add(light1);
            var light2 = new THREE.DirectionalLight(this.options.data.directionalLight2Color, this.options.data.directionalLight2Intensity);
            light2.position.set(-1, -1, -1);
            this._lightGroup.add(light2);
            var ambientLight = new THREE.AmbientLight(this.options.data.ambientLightColor, this.options.data.ambientLightIntensity);
            this._lightGroup.add(ambientLight);
        };
        Viewport.prototype.createCamera = function () {
            this.camera = new THREE.PerspectiveCamera(this._getFov(), this._getAspectRatio(), this.options.data.near, this.options.data.far);
            var cameraZ = this._getCameraZ();
            this.camera.position.z = this._targetZoom = cameraZ;
        };
        Viewport.prototype._createRenderer = function () {
            this._renderer = new THREE.WebGLRenderer({
                antialias: this.options.data.antialias,
                alpha: this.options.data.alpha
            });
            if (this._isVRMode) {
                this._renderer.setClearColor(this.options.data.vrBackgroundColor);
                this._vrEffect = new THREE.VREffect(this._renderer);
                this._vrEffect.setSize(this._$viewport.width(), this._$viewport.height());
            }
            else {
                this._renderer.setClearColor(this.options.data.vrBackgroundColor, 0);
                this._renderer.setSize(this._$viewport.width(), this._$viewport.height());
            }
            this._$viewport.empty().append(this._renderer.domElement);
        };
        Viewport.prototype._createControls = function () {
            if (this._isVRMode) {
                // Apply VR headset positional data to camera.
                this._vrControls = new THREE.VRControls(this.camera);
            }
        };
        Viewport.prototype._createEventListeners = function () {
            var _this = this;
            if (this.options.data.fullscreenEnabled) {
                $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function () {
                    _this._fullscreenChanged();
                });
            }
            this._$element.on('mousedown', function (e) {
                _this._onMouseDown(e.originalEvent);
            });
            this._$element.on('mousemove', function (e) {
                _this._onMouseMove(e.originalEvent);
            });
            this._$element.on('mouseup', function () {
                _this._onMouseUp();
            });
            this._$element.on('mouseout', function () {
                _this._onMouseOut();
            });
            this._$element.on('mousewheel', function (e) {
                _this._onMouseWheel(e.originalEvent);
            });
            this._$element.on('DOMMouseScroll', function (e) {
                _this._onMouseWheel(e.originalEvent); // firefox
            });
            this._$element.on('touchstart', function (e) {
                _this._onTouchStart(e.originalEvent);
            });
            this._$element.on('touchmove', function (e) {
                _this._onTouchMove(e.originalEvent);
            });
            this._$element.on('touchend', function () {
                _this._onTouchEnd();
            });
            window.addEventListener('resize', function () { return _this._resize(); }, false);
        };
        Viewport.prototype._loadObject = function (objectPath) {
            var _this = this;
            this._$loading.show();
            var loader;
            switch (this.options.data.type.toString()) {
                case Virtex.FileType.DRACO.toString():
                    loader = new THREE.DRACOLoader();
                    break;
                case Virtex.FileType.CORTO.toString():
                    loader = new THREE.CORTOLoader();
                    break;
                case Virtex.FileType.GLTF.toString():
                    loader = new THREE.GLTFLoader();
                    break;
                case Virtex.FileType.OBJ.toString():
                    loader = new THREE.OBJLoader();
                    break;
                case Virtex.FileType.THREEJS.toString():
                    loader = new THREE.ObjectLoader();
                    break;
            }
            if (loader.setCrossOrigin) {
                loader.setCrossOrigin('anonymous');
            }
            loader.load(objectPath, function (obj) {
                switch (_this.options.data.type.toString()) {
                    case Virtex.FileType.DRACO.toString():
                        Virtex.DRACOFileTypeHandler.setup(_this, obj);
                        break;
                    case Virtex.FileType.CORTO.toString():
                        Virtex.CORTOFileTypeHandler.setup(_this, obj);
                        break;
                    case Virtex.FileType.GLTF.toString():
                        Virtex.glTFFileTypeHandler.setup(_this, obj);
                        break;
                    case Virtex.FileType.THREEJS.toString():
                        Virtex.ThreeJSFileTypeHandler.setup(_this, obj);
                        break;
                    case Virtex.FileType.OBJ.toString():
                        Virtex.ObjFileTypeHandler.setup(_this, obj, objectPath);
                        break;
                }
                _this._$loading.fadeOut(_this.options.data.fadeSpeed);
                _this.fire(Events.LOADED, obj);
            }, function (e) {
                if (e.lengthComputable) {
                    _this._loadProgress(e.loaded / e.total);
                }
            }, function (e) {
                // error
                console.error(e);
            });
        };
        Viewport.prototype._getBoundingBox = function () {
            return new THREE.Box3().setFromObject(this.objectGroup);
        };
        Viewport.prototype._getBoundingWidth = function () {
            return this._getBoundingBox().getSize().x;
        };
        Viewport.prototype._getBoundingHeight = function () {
            return this._getBoundingBox().getSize().y;
        };
        // private _getDistanceToObject(): number {
        //     return this.camera.position.distanceTo(this.objectGroup.position);
        // }
        Viewport.prototype._getCameraZ = function () {
            return this._getBoundingWidth() * this.options.data.cameraZ;
        };
        Viewport.prototype._getFov = function () {
            if (!this.camera)
                return 1;
            var width = this._getBoundingWidth();
            var height = this._getBoundingHeight(); // todo: use getSize and update definition
            var dist = this._getCameraZ() - width;
            //http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
            var fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
            //let fov: number = 2 * Math.atan((width / this._getAspectRatio()) / (2 * dist)) * (180 / Math.PI);
            return fov;
        };
        Viewport.prototype._loadProgress = function (progress) {
            var fullWidth = this._$loading.width();
            var width = Math.floor(fullWidth * progress);
            this._$loadingBar.width(width);
        };
        Viewport.prototype._fullscreenChanged = function () {
            if (this._isFullscreen) {
                // exiting fullscreen
                this.exitFullscreen();
                this._$element.width(this._lastWidth);
                this._$element.height(this._lastHeight);
            }
            else {
                // entering fullscreen
                this._lastWidth = this._getWidth();
                this._lastHeight = this._getHeight();
            }
            this._isFullscreen = !this._isFullscreen;
            this._resize();
        };
        Viewport.prototype._onMouseDown = function (event) {
            event.preventDefault();
            this._isMouseDown = true;
            this._mousePosOnMouseDown.x = event.clientX - this._viewportCenter.x;
            this._targetRotationOnMouseDown.x = this._targetRotation.x;
            this._mousePosOnMouseDown.y = event.clientY - this._viewportCenter.y;
            this._targetRotationOnMouseDown.y = this._targetRotation.y;
        };
        Viewport.prototype._onMouseMove = function (event) {
            this._mousePos.x = event.clientX - this._viewportCenter.x;
            this._mousePos.y = event.clientY - this._viewportCenter.y;
            if (this._isMouseDown) {
                this._targetRotation.y = this._targetRotationOnMouseDown.y + (this._mousePos.y - this._mousePosOnMouseDown.y) * 0.02;
                this._targetRotation.x = this._targetRotationOnMouseDown.x + (this._mousePos.x - this._mousePosOnMouseDown.x) * 0.02;
            }
        };
        Viewport.prototype._onMouseUp = function () {
            this._isMouseDown = false;
        };
        Viewport.prototype._onMouseOut = function () {
            this._isMouseDown = false;
        };
        Viewport.prototype._onMouseWheel = function (event) {
            event.preventDefault();
            event.stopPropagation();
            var delta = 0;
            if (event.wheelDelta !== undefined) {
                delta = event.wheelDelta;
            }
            else if (event.detail !== undefined) {
                delta = -event.detail;
            }
            if (delta > 0) {
                this.zoomIn();
            }
            else if (delta < 0) {
                this.zoomOut();
            }
        };
        Viewport.prototype._onTouchStart = function (event) {
            var touches = event.touches;
            if (touches.length === 1) {
                this._isMouseDown = true;
                event.preventDefault();
                this._mousePosOnMouseDown.x = touches[0].pageX - this._viewportCenter.x;
                this._targetRotationOnMouseDown.x = this._targetRotation.x;
                this._mousePosOnMouseDown.y = touches[0].pageY - this._viewportCenter.y;
                this._targetRotationOnMouseDown.y = this._targetRotation.y;
            }
        };
        Viewport.prototype._onTouchMove = function (event) {
            event.preventDefault();
            event.stopPropagation();
            var touches = event.touches;
            switch (touches.length) {
                case 1:// one-fingered touch: rotate
                    event.preventDefault();
                    this._mousePos.x = touches[0].pageX - this._viewportCenter.x;
                    this._targetRotation.x = this._targetRotationOnMouseDown.x + (this._mousePos.x - this._mousePosOnMouseDown.x) * 0.05;
                    this._mousePos.y = touches[0].pageY - this._viewportCenter.y;
                    this._targetRotation.y = this._targetRotationOnMouseDown.y + (this._mousePos.y - this._mousePosOnMouseDown.y) * 0.05;
                    break;
                case 2:// two-fingered touch: zoom
                    var dx = touches[0].pageX - touches[1].pageX;
                    var dy = touches[0].pageY - touches[1].pageY;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    var pinchEnd = new THREE.Vector2(0, distance);
                    var pinchDelta = new THREE.Vector2();
                    pinchDelta.subVectors(pinchEnd, this._pinchStart);
                    if (pinchDelta.y > 0) {
                        this.zoomIn();
                    }
                    else if (pinchDelta.y < 0) {
                        this.zoomOut();
                    }
                    this._pinchStart.copy(pinchEnd);
                    break;
                case 3:// three-fingered touch: pan
                    //var panEnd = new THREE.Vector2();
                    //panEnd.set(touches[0].pageX, touches[0].pageY);
                    //var panDelta = new THREE.Vector2();
                    //panDelta.subVectors(panEnd, panStart);
                    //
                    //panCamera(panDelta.x, panDelta.y);
                    //
                    //panStart.copy(panEnd);
                    break;
            }
        };
        Viewport.prototype._onTouchEnd = function () {
            this._isMouseDown = false;
        };
        Viewport.prototype._tick = function () {
            var _this = this;
            requestAnimFrame(function () { return _this._tick(); });
            this._update();
            this._draw();
            if (this.options.data.showStats) {
                this._stats.update();
            }
        };
        Viewport.prototype.rotateY = function (radians) {
            var rotation = this.objectGroup.rotation.y + radians;
            this.objectGroup.rotation.y = rotation;
        };
        // private _applyTransform(): void{
        //     this.objectGroup.updateMatrix();
        //     //this.objectGroup.geometry.applyMatrix( this.objectGroup.matrix );
        //     this.objectGroup.position.set( 0, 0, 0 );
        //     this.objectGroup.rotation.set( 0, 0, 0 );
        //     this.objectGroup.scale.set( 1, 1, 1 );
        //     this.objectGroup.updateMatrix();
        // }
        Viewport.prototype._update = function () {
            // switch (this.options.data.type.toString()) {
            //     case FileType.DRACO.toString() :
            //         break;
            //     case FileType.GLTF.toString() :
            //         //THREE.GLTFLoader.Animations.update();
            //         THREE.GLTFLoader.Shaders.update(this.scene, this.camera);
            //         break;
            //     case FileType.THREEJS.toString() :
            //         break;
            // }
            if (this._isVRMode) {
                // if (this._isMouseDown) {
                //     this.rotateY(0.1);
                // }
                // Update VR headset position and apply to camera.
                this._vrControls.update();
            }
            else {
                // horizontal rotation
                this.rotateY((this._targetRotation.x - this.objectGroup.rotation.y) * 0.1);
                // vertical rotation
                var finalRotationY = (this._targetRotation.y - this.objectGroup.rotation.x);
                if (this.objectGroup.rotation.x <= 1 && this.objectGroup.rotation.x >= -1) {
                    this.objectGroup.rotation.x += finalRotationY * 0.1;
                }
                // limit vertical rotation 
                if (this.objectGroup.rotation.x > 1) {
                    this.objectGroup.rotation.x = 1;
                }
                else if (this.objectGroup.rotation.x < -1) {
                    this.objectGroup.rotation.x = -1;
                }
                var zoomDelta = (this._targetZoom - this.camera.position.z) * 0.1;
                this.camera.position.z += zoomDelta;
            }
        };
        Viewport.prototype._draw = function () {
            if (this._isVRMode) {
                this._vrEffect.render(this.scene, this.camera);
            }
            else {
                this._renderer.render(this.scene, this.camera);
            }
        };
        Viewport.prototype._getWidth = function () {
            if (this._isFullscreen) {
                return window.innerWidth;
            }
            return this._$element.width();
        };
        Viewport.prototype._getHeight = function () {
            if (this._isFullscreen) {
                return window.innerHeight;
            }
            return this._$element.height();
        };
        Viewport.prototype._getZoomSpeed = function () {
            return this._getBoundingWidth() * this.options.data.zoomSpeed;
        };
        Viewport.prototype._getMaxZoom = function () {
            return this._getBoundingWidth() * this.options.data.maxZoom;
        };
        Viewport.prototype._getMinZoom = function () {
            return this._getBoundingWidth() * this.options.data.minZoom;
        };
        Viewport.prototype.zoomIn = function () {
            var targetZoom = this.camera.position.z - this._getZoomSpeed();
            if (targetZoom > this._getMinZoom()) {
                this._targetZoom = targetZoom;
            }
            else {
                this._targetZoom = this._getMinZoom();
            }
        };
        Viewport.prototype.zoomOut = function () {
            var targetZoom = this.camera.position.z + this._getZoomSpeed();
            if (targetZoom < this._getMaxZoom()) {
                this._targetZoom = targetZoom;
            }
            else {
                this._targetZoom = this._getMaxZoom();
            }
        };
        Viewport.prototype.enterVR = function () {
            var _this = this;
            if (!this._vrEnabled)
                return;
            this._isVRMode = true;
            this._prevCameraPosition = this.camera.position.clone();
            this._prevCameraRotation = this.camera.rotation.clone();
            this._createControls();
            this._createRenderer();
            this._getVRDisplay().then(function (display) {
                if (display) {
                    _this._vrEffect.setVRDisplay(display);
                    _this._vrControls.setVRDisplay(display);
                    _this._vrEffect.setFullScreen(true);
                }
            });
        };
        Viewport.prototype.exitVR = function () {
            if (!this._vrEnabled)
                return;
            this._isVRMode = false;
            this.camera.position.copy(this._prevCameraPosition);
            this.camera.rotation.copy(this._prevCameraRotation);
            this._createRenderer();
        };
        Viewport.prototype.toggleVR = function () {
            if (!this._vrEnabled)
                return;
            if (!this._isVRMode) {
                this.enterVR();
            }
            else {
                this.exitVR();
            }
        };
        Viewport.prototype.enterFullscreen = function () {
            if (!this.options.data.fullscreenEnabled)
                return;
            var elem = this._$element[0];
            var requestFullScreen = this._getRequestFullScreen(elem);
            if (requestFullScreen) {
                requestFullScreen.call(elem);
            }
        };
        Viewport.prototype.exitFullscreen = function () {
            var exitFullScreen = this._getExitFullScreen();
            if (exitFullScreen) {
                exitFullScreen.call(document);
            }
        };
        Viewport.prototype._getRequestFullScreen = function (elem) {
            if (elem.requestFullscreen) {
                return elem.requestFullscreen;
            }
            else if (elem.msRequestFullscreen) {
                return elem.msRequestFullscreen;
            }
            else if (elem.mozRequestFullScreen) {
                return elem.mozRequestFullScreen;
            }
            else if (elem.webkitRequestFullscreen) {
                return elem.webkitRequestFullscreen;
            }
            return false;
        };
        Viewport.prototype._getExitFullScreen = function () {
            if (document.exitFullscreen) {
                return document.exitFullscreen;
            }
            else if (document.msExitFullscreen) {
                return document.msExitFullscreen;
            }
            else if (document.mozCancelFullScreen) {
                return document.mozCancelFullScreen;
            }
            else if (document.webkitExitFullscreen) {
                return document.webkitExitFullscreen;
            }
            return false;
        };
        Viewport.prototype._getAspectRatio = function () {
            return this._$viewport.width() / this._$viewport.height();
        };
        Viewport.prototype.resize = function () {
            this._resize();
        };
        Viewport.prototype._resize = function () {
            if (this._$element && this._$viewport) {
                this._$element.width(this._getWidth());
                this._$element.height(this._getHeight());
                this._$viewport.width(this._getWidth());
                this._$viewport.height(this._getHeight());
                this._viewportCenter.x = this._$viewport.width() / 2;
                this._viewportCenter.y = this._$viewport.height() / 2;
                this.camera.aspect = this._getAspectRatio();
                this.camera.updateProjectionMatrix();
                if (this._isVRMode) {
                    this._vrEffect.setSize(this._$viewport.width(), this._$viewport.height());
                }
                else {
                    this._renderer.setSize(this._$viewport.width(), this._$viewport.height());
                }
                this._$loading.css({
                    left: (this._viewportCenter.x) - (this._$loading.width() / 2),
                    top: (this._viewportCenter.y) - (this._$loading.height() / 2)
                });
            }
            else if (this._$oldie) {
                this._$oldie.css({
                    left: (this._$element.width() / 2) - (this._$oldie.outerWidth() / 2),
                    top: (this._$element.height() / 2) - (this._$oldie.outerHeight() / 2)
                });
            }
        };
        return Viewport;
    }(_Components.BaseComponent));
    Virtex.Viewport = Viewport;
    var Events = (function () {
        function Events() {
        }
        Events.LOADED = 'loaded';
        return Events;
    }());
    Virtex.Events = Events;
})(Virtex || (Virtex = {}));
(function (g) {
    if (!g.Virtex) {
        g.Virtex = Virtex;
    }
})(global);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});