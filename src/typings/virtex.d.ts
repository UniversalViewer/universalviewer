
declare module Virtex {
    interface IOptions {
        ambientLightColor: number;
        cameraZ: number;
        directionalLight1Color: number;
        directionalLight1Intensity: number;
        directionalLight2Color: number;
        directionalLight2Intensity: number;
        element: string;
        fadeSpeed: number;
        far: number;
        fov: number;
        maxZoom: number;
        minZoom: number;
        near: number;
        object: string;
        shading: THREE.Shading;
        shininess: number;
        showStats: boolean;
    }
}

interface IVirtex {
    create: (options: Virtex.IOptions) => Virtex.Viewport;
}

declare var Detector: any;
declare var Stats: any;
declare var requestAnimFrame: any;
declare module Virtex {
    class Viewport {
        options: IOptions;
        private _$element;
        private _$viewport;
        private _$loading;
        private _$loadingBar;
        private _camera;
        private _lightGroup;
        private _modelGroup;
        private _renderer;
        private _scene;
        private _stats;
        private _viewportHalfX;
        private _viewportHalfY;
        private _isMouseDown;
        private _mouseX;
        private _mouseXOnMouseDown;
        private _mouseY;
        private _mouseYOnMouseDown;
        private _targetRotationOnMouseDownX;
        private _targetRotationOnMouseDownY;
        private _targetRotationX;
        private _targetRotationY;
        private _dollyStart;
        private _scale;
        private _zoomSpeed;
        constructor(options: IOptions);
        private _init();
        private _loadProgress(progress);
        private _onMouseDown(event);
        private _onMouseMove(event);
        private _onMouseUp(event);
        private _onMouseOut(event);
        private _onMouseWheel(event);
        private _onTouchStart(event);
        private _onTouchMove(event);
        private _onTouchEnd(event);
        private _dollyIn(dollyScale?);
        private _dollyOut(dollyScale?);
        private _getZoomScale();
        private _draw();
        private _render();
        private _getWidth();
        private _getHeight();
        private _resize();
    }
}

