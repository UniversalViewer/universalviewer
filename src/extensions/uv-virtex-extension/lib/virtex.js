!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.virtex=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var requestAnimFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 200);
        };
    }();
var Virtex = function () {
        function Virtex(options) {
            this._isMouseDown = false;
            this._mouseX = 0;
            this._mouseXOnMouseDown = 0;
            this._mouseY = 0;
            this._mouseYOnMouseDown = 0;
            this._targetRotationOnMouseDownX = 0;
            this._targetRotationOnMouseDownY = 0;
            this._targetRotationX = 0;
            this._targetRotationY = 0;
            this._dollyStart = new THREE.Vector2();
            this._scale = 1;
            this._zoomSpeed = 1;
            this.options = $.extend({
                ambientLightColor: 12763582,
                cameraZ: 4.5,
                directionalLight1Color: 16777215,
                directionalLight1Intensity: 1,
                directionalLight2Color: 10584,
                directionalLight2Intensity: 0.5,
                fadeSpeed: 1750,
                far: 10000,
                fov: 45,
                near: 0.1,
                shading: THREE.SmoothShading,
                shininess: 1,
                showStats: false
            }, options);
            this._init();
            this._resize();
            this._draw();
        }
        Virtex.prototype._init = function () {
            var _this = this;
            if (!Detector.webgl)
                Detector.addGetWebGLMessage();
            this._$element = $(this.options.element);
            if (!this._$element.length)
                console.log('element not found');
            this._$element.append('<div class="viewport"></div><div class="loading"><div class="bar"></div></div>');
            this._$viewport = this._$element.find('.viewport');
            this._$loading = this._$element.find('.loading');
            this._$loadingBar = this._$loading.find('.bar');
            this._$loading.hide();
            this._scene = new THREE.Scene();
            this._modelGroup = new THREE.Object3D();
            this._lightGroup = new THREE.Object3D();
            var light1 = new THREE.DirectionalLight(this.options.directionalLight1Color, this.options.directionalLight1Intensity);
            light1.position.set(1, 1, 1);
            this._lightGroup.add(light1);
            var light2 = new THREE.DirectionalLight(this.options.directionalLight2Color, this.options.directionalLight2Intensity);
            light2.position.set(-1, -1, -1);
            this._lightGroup.add(light2);
            var ambientLight = new THREE.AmbientLight(this.options.ambientLightColor);
            this._lightGroup.add(ambientLight);
            this._scene.add(this._lightGroup);
            this._camera = new THREE.PerspectiveCamera(this.options.fov, this._getWidth() / this._getHeight(), this.options.near, this.options.far);
            this._camera.position.z = this.options.cameraZ;
            this._renderer = Detector.webgl ? new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            }) : new THREE.CanvasRenderer();
            this._renderer.setSize(this._$viewport.width(), this._$viewport.height());
            this._$viewport.append(this._renderer.domElement);
            if (this.options.showStats) {
                this._stats = new Stats();
                this._stats.domElement.style.position = 'absolute';
                this._stats.domElement.style.top = '0px';
                this._$viewport.append(this._stats.domElement);
            }
            this._$element.on('mousedown', function (e) {
                _this._onMouseDown(e.originalEvent);
            });
            this._$element.on('mousemove', function (e) {
                _this._onMouseMove(e.originalEvent);
            });
            this._$element.on('mouseup', function (e) {
                _this._onMouseUp(e.originalEvent);
            });
            this._$element.on('mouseout', function (e) {
                _this._onMouseOut(e.originalEvent);
            });
            this._$element.on('mousewheel', function (e) {
                _this._onMouseWheel(e.originalEvent);
            });
            this._$element.on('DOMMouseScroll', function (e) {
                _this._onMouseWheel(e.originalEvent);
            });
            this._$element.on('touchstart', function (e) {
                _this._onTouchStart(e.originalEvent);
            });
            this._$element.on('touchmove', function (e) {
                _this._onTouchMove(e.originalEvent);
            });
            this._$element.on('touchend', function (e) {
                _this._onTouchEnd(e.originalEvent);
            });
            window.addEventListener('resize', function () {
                return _this._resize();
            }, false);
            var loader = new THREE.ObjectLoader();
            this._$loading.show();
            loader.load(this.options.object, function (obj) {
                _this._modelGroup.add(obj);
                _this._scene.add(_this._modelGroup);
                _this._$loading.fadeOut(_this.options.fadeSpeed);
            }, function (e) {
                if (e.lengthComputable) {
                    _this._loadProgress(e.loaded / e.total);
                }
            }, function (e) {
                console.log(e);
            });
        };
        Virtex.prototype._loadProgress = function (progress) {
            var fullWidth = this._$loading.width();
            var width = Math.floor(fullWidth * progress);
            this._$loadingBar.width(width);
        };
        Virtex.prototype._onMouseDown = function (event) {
            event.preventDefault();
            this._isMouseDown = true;
            this._mouseXOnMouseDown = event.clientX - this._viewportHalfX;
            this._targetRotationOnMouseDownX = this._targetRotationX;
            this._mouseYOnMouseDown = event.clientY - this._viewportHalfY;
            this._targetRotationOnMouseDownY = this._targetRotationY;
        };
        Virtex.prototype._onMouseMove = function (event) {
            this._mouseX = event.clientX - this._viewportHalfX;
            this._mouseY = event.clientY - this._viewportHalfY;
            if (this._isMouseDown) {
                this._targetRotationY = this._targetRotationOnMouseDownY + (this._mouseY - this._mouseYOnMouseDown) * 0.02;
                this._targetRotationX = this._targetRotationOnMouseDownX + (this._mouseX - this._mouseXOnMouseDown) * 0.02;
            }
        };
        Virtex.prototype._onMouseUp = function (event) {
            this._isMouseDown = false;
        };
        Virtex.prototype._onMouseOut = function (event) {
            this._isMouseDown = false;
        };
        Virtex.prototype._onMouseWheel = function (event) {
            event.preventDefault();
            event.stopPropagation();
            var delta = 0;
            if (event.wheelDelta !== undefined) {
                delta = event.wheelDelta;
            } else if (event.detail !== undefined) {
                delta = -event.detail;
            }
            if (delta > 0) {
                this._dollyOut();
            } else if (delta < 0) {
                this._dollyIn();
            }
        };
        Virtex.prototype._onTouchStart = function (event) {
            var touches = event.touches;
            if (touches.length === 1) {
                this._isMouseDown = true;
                event.preventDefault();
                this._mouseXOnMouseDown = touches[0].pageX - this._viewportHalfX;
                this._targetRotationOnMouseDownX = this._targetRotationX;
                this._mouseYOnMouseDown = touches[0].pageY - this._viewportHalfY;
                this._targetRotationOnMouseDownY = this._targetRotationY;
            }
        };
        Virtex.prototype._onTouchMove = function (event) {
            event.preventDefault();
            event.stopPropagation();
            var touches = event.touches;
            switch (touches.length) {
            case 1:
                event.preventDefault();
                this._mouseX = touches[0].pageX - this._viewportHalfX;
                this._targetRotationX = this._targetRotationOnMouseDownX + (this._mouseX - this._mouseXOnMouseDown) * 0.05;
                this._mouseY = touches[0].pageY - this._viewportHalfY;
                this._targetRotationY = this._targetRotationOnMouseDownY + (this._mouseY - this._mouseYOnMouseDown) * 0.05;
                break;
            case 2:
                var dx = touches[0].pageX - touches[1].pageX;
                var dy = touches[0].pageY - touches[1].pageY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                var dollyEnd = new THREE.Vector2(0, distance);
                var dollyDelta = new THREE.Vector2();
                dollyDelta.subVectors(dollyEnd, this._dollyStart);
                if (dollyDelta.y > 0) {
                    this._dollyOut();
                } else if (dollyDelta.y < 0) {
                    this._dollyIn();
                }
                this._dollyStart.copy(dollyEnd);
                break;
            case 3:
                break;
            }
        };
        Virtex.prototype._onTouchEnd = function (event) {
            this._isMouseDown = false;
        };
        Virtex.prototype._dollyIn = function (dollyScale) {
            if (dollyScale === undefined) {
                dollyScale = this._getZoomScale();
            }
            this._scale /= dollyScale;
        };
        Virtex.prototype._dollyOut = function (dollyScale) {
            if (dollyScale === undefined) {
                dollyScale = this._getZoomScale();
            }
            this._scale *= dollyScale;
        };
        Virtex.prototype._getZoomScale = function () {
            return Math.pow(0.95, this._zoomSpeed);
        };
        Virtex.prototype._draw = function () {
            var _this = this;
            requestAnimFrame(function () {
                return _this._draw();
            });
            this._render();
            if (this.options.showStats) {
                this._stats.update();
            }
        };
        Virtex.prototype._render = function () {
            this._modelGroup.rotation.y += (this._targetRotationX - this._modelGroup.rotation.y) * 0.1;
            var finalRotationY = this._targetRotationY - this._modelGroup.rotation.x;
            if (this._modelGroup.rotation.x <= 1 && this._modelGroup.rotation.x >= -1) {
                this._modelGroup.rotation.x += finalRotationY * 0.1;
            }
            if (this._modelGroup.rotation.x > 1) {
                this._modelGroup.rotation.x = 1;
            } else if (this._modelGroup.rotation.x < -1) {
                this._modelGroup.rotation.x = -1;
            }
            this._camera.position.z *= this._scale;
            this._scale = 1;
            this._renderer.render(this._scene, this._camera);
        };
        Virtex.prototype._getWidth = function () {
            return this._$element.width();
        };
        Virtex.prototype._getHeight = function () {
            return this._$element.height();
        };
        Virtex.prototype._resize = function () {
            this._$element.width(this._getWidth());
            this._$element.height(this._getHeight());
            this._$viewport.width(this._getWidth());
            this._$viewport.height(this._getHeight());
            this._viewportHalfX = this._$viewport.width() / 2;
            this._viewportHalfY = this._$viewport.height() / 2;
            this._camera.aspect = this._$viewport.width() / this._$viewport.height();
            this._camera.updateProjectionMatrix();
            this._renderer.setSize(this._$viewport.width(), this._$viewport.height());
            this._$loading.css({
                left: this._viewportHalfX - this._$loading.width() / 2,
                top: this._viewportHalfY - this._$loading.height() / 2
            });
        };
        return Virtex;
    }();
module.exports = Virtex;
},{}]},{},[1])
(1)
});