declare module storage {
    class Manager {
        private static _memoryStorage;
        static clear(storageType?: StorageType): void;
        static clearExpired(storageType?: StorageType): void;
        static get(key: string, storageType?: StorageType): StorageItem;
        private static _isExpired(item);
        static getItems(storageType?: StorageType): StorageItem[];
        static remove(key: string, storageType?: StorageType): void;
        static set(key: string, value: any, expirationSecs: number, storageType?: StorageType): StorageItem;
    }
}
declare module storage {
    class StorageItem {
        key: string;
        value: any;
        expiresAt: number;
    }
}
declare module storage {
    class StorageType {
        value: string;
        static memory: StorageType;
        static session: StorageType;
        static local: StorageType;
        constructor(value: string);
        toString(): string;
    }
}
