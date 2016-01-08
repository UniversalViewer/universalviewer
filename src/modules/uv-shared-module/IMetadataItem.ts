interface IMetadataItem {
    label: string;
    value: string | IMetadataItem[];
    isRootLevel: boolean;
}

export = IMetadataItem;