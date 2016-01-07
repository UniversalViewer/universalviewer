interface IMetadataItem {
    label: string;
    value: string | IMetadataItem[];
}

export = IMetadataItem;