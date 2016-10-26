// iiif-metadata-component v1.0.0 https://github.com/viewdir/iiif-metadata-component#readme
declare namespace IIIFComponents {
    class StringValue {
        value: string;
        constructor(value?: string);
        toString(): string;
    }
}

declare namespace IIIFComponents.MetadataComponentOptions {
    class LimitType extends StringValue {
        static LINES: LimitType;
        static CHARS: LimitType;
    }
}

/// <reference path="StringValue.d.ts" />
/// <reference path="LimitType.d.ts" />

declare namespace IIIFComponents {
    interface IMetadataComponent extends _Components.IBaseComponent {
    }
}

declare namespace IIIFComponents {
    interface IContent {
        attribution: string;
        canvasHeader: string;
        copiedToClipboard: string;
        copyToClipboard: string;
        description: string;
        imageHeader: string;
        less: string;
        license: string;
        logo: string;
        manifestHeader: string;
        more: string;
        noData: string;
        rangeHeader: string;
        sequenceHeader: string;
    }
    interface IMetadataComponentOptions extends _Components.IBaseComponentOptions {
        canvasDisplayOrder: string;
        canvases: Manifesto.ICanvas[];
        canvasExclude: string;
        canvasLabels: string;
        content: IContent;
        copiedMessageDuration: number;
        copyToClipboardEnabled: boolean;
        helper: Manifold.IHelper;
        licenseFormatter: Manifold.UriLabeller;
        limit: number;
        limitType: MetadataComponentOptions.LimitType;
        manifestDisplayOrder: string;
        manifestExclude: string;
        range: Manifesto.IRange;
        rtlLanguageCodes: string;
        sanitizer: (html: string) => string;
        showAllLanguages: boolean;
    }
}

import MetadataItem = Manifold.IMetadataItem;
import MetadataGroup = Manifold.MetadataGroup;
declare namespace IIIFComponents {
    class MetadataComponent extends _Components.BaseComponent implements IMetadataComponent {
        options: IMetadataComponentOptions;
        private _$copyTextTemplate;
        private _$metadataGroups;
        private _$metadataGroupTemplate;
        private _$metadataItemTemplate;
        private _$metadataItemValueTemplate;
        private _$noData;
        private _metadataGroups;
        constructor(options: IMetadataComponentOptions);
        protected _init(): boolean;
        protected _getDefaultOptions(): IMetadataComponentOptions;
        private _getManifestGroup();
        private _getCanvasGroups();
        databind(): void;
        private _sort(items, displayOrder);
        private _label(groups, labels);
        private _exclude(items, excludeConfig);
        private _normalise(value);
        private _render();
        private _buildMetadataGroup(metadataGroup);
        private _buildMetadataItem(item);
        private _getItemLocale(item);
        private _buildMetadataItemValue(value, locale);
        private _addReadingDirection($elem, locale);
        private _addCopyButton($elem, $header);
        private _copyItemValues($copyButton, $item);
        private _readCSV(config, normalise?);
        private _sanitize(html);
        protected _resize(): void;
    }
}
declare namespace IIIFComponents.MetadataComponent {
    class Events {
    }
}
