// iiif-gallery-component v1.0.0 https://github.com/viewdir/iiif-gallery-component#readme
declare namespace IIIFComponents {
    class GalleryComponent extends _Components.BaseComponent implements IGalleryComponent {
        options: IGalleryComponentOptions;
        private _$header;
        private _$leftOptions;
        private _$main;
        private _$multiSelectOptions;
        private _$rightOptions;
        private _$selectAllButton;
        private _$selectAllButtonCheckbox;
        private _$selectButton;
        private _$selectedThumb;
        private _$sizeDownButton;
        private _$sizeRange;
        private _$sizeUpButton;
        private _$thumbs;
        private _lastThumbClickedIndex;
        private _range;
        private _scrollStopDuration;
        private _thumbs;
        private _thumbsCache;
        constructor(options: IGalleryComponentOptions);
        protected _init(): boolean;
        protected _getDefaultOptions(): IGalleryComponentOptions;
        databind(): void;
        private _getMultiSelectState();
        private _createThumbs();
        private _getThumbByCanvas(canvas);
        private _sizeThumb($thumb);
        private _loadThumb($thumb, cb?);
        private _getThumbsByRange(range);
        _updateThumbs(): void;
        private _isChunkedResizingEnabled();
        private _getSelectedThumbIndex();
        private _getAllThumbs();
        private _getThumbByIndex(canvasIndex);
        private _scrollToThumb(canvasIndex);
        private _searchPreviewStart(canvasIndex);
        private _searchPreviewFinish();
        selectIndex(index: number): void;
        private _setLabel();
        private _setRange();
        private _setThumbMultiSelected(thumb, selected);
        protected _resize(): void;
    }
}
declare namespace IIIFComponents.GalleryComponent {
    class Events {
        static DECREASE_SIZE: string;
        static INCREASE_SIZE: string;
        static MULTISELECTION_MADE: string;
        static THUMB_SELECTED: string;
        static THUMB_MULTISELECTED: string;
    }
}

declare namespace IIIFComponents {
    interface IGalleryComponent extends _Components.IBaseComponent {
        selectIndex(index: number): void;
    }
}

declare namespace IIIFComponents {
    interface IContent {
        select: string;
        selectAll: string;
    }
    interface IGalleryComponentOptions extends _Components.IBaseComponentOptions {
        chunkedResizingEnabled: boolean;
        chunkedResizingThreshold: number;
        content: IContent;
        debug: boolean;
        helper: Manifold.IHelper;
        imageFadeInDuration: number;
        initialZoom: number;
        pageModeEnabled: boolean;
        scrollStopDuration: number;
        sizingEnabled: boolean;
        thumbHeight: number;
        thumbLoadPadding: number;
        thumbWidth: number;
        viewingDirection: Manifesto.ViewingDirection;
    }
}
