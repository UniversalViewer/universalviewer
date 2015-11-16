!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.storage=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// todo: add indexer? http://stackoverflow.com/questions/14841598/implementing-an-indexer-in-a-class-in-typescript
var storage;
(function (storage) {
    var Manager = (function () {
        function Manager() {
        }
        Manager.clear = function (storageType) {
            if (storageType === void 0) { storageType = storage.StorageType.memory; }
            switch (storageType) {
                case storage.StorageType.memory:
                    this._memoryStorage = {};
                    break;
                case storage.StorageType.session:
                    sessionStorage.clear();
                    break;
                case storage.StorageType.local:
                    localStorage.clear();
                    break;
            }
        };
        Manager.clearExpired = function (storageType) {
            if (storageType === void 0) { storageType = storage.StorageType.memory; }
            var items = this.getItems(storageType);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (this._isExpired(item)) {
                    this.remove(item.key);
                }
            }
        };
        Manager.get = function (key, storageType) {
            if (storageType === void 0) { storageType = storage.StorageType.memory; }
            var data;
            switch (storageType) {
                case storage.StorageType.memory:
                    data = this._memoryStorage[key];
                    break;
                case storage.StorageType.session:
                    data = sessionStorage.getItem(key);
                    break;
                case storage.StorageType.local:
                    data = localStorage.getItem(key);
                    break;
            }
            if (!data)
                return null;
            var item = JSON.parse(data);
            if (this._isExpired(item))
                return null;
            // useful reference
            item.key = key;
            return item;
        };
        Manager._isExpired = function (item) {
            if (new Date().getTime() < item.expiresAt) {
                return false;
            }
            return true;
        };
        Manager.getItems = function (storageType) {
            if (storageType === void 0) { storageType = storage.StorageType.memory; }
            var items = [];
            switch (storageType) {
                case storage.StorageType.memory:
                    var keys = Object.keys(this._memoryStorage);
                    for (var i = 0; i < keys.length; i++) {
                        var item = this.get(keys[i], storage.StorageType.memory);
                        if (item) {
                            items.push(item);
                        }
                    }
                    break;
                case storage.StorageType.session:
                    for (var i = 0; i < sessionStorage.length; i++) {
                        var key = sessionStorage.key(i);
                        var item = this.get(key, storage.StorageType.session);
                        if (item) {
                            items.push(item);
                        }
                    }
                    break;
                case storage.StorageType.local:
                    for (var i = 0; i < localStorage.length; i++) {
                        var key = localStorage.key(i);
                        var item = this.get(key, storage.StorageType.local);
                        if (item) {
                            items.push(item);
                        }
                    }
                    break;
            }
            return items;
        };
        Manager.remove = function (key, storageType) {
            if (storageType === void 0) { storageType = storage.StorageType.memory; }
            switch (storageType) {
                case storage.StorageType.memory:
                    delete this._memoryStorage[key];
                    break;
                case storage.StorageType.session:
                    sessionStorage.removeItem(key);
                    break;
                case storage.StorageType.local:
                    localStorage.removeItem(key);
                    break;
            }
        };
        Manager.set = function (key, value, expirationSecs, storageType) {
            if (storageType === void 0) { storageType = storage.StorageType.memory; }
            var expirationMS = expirationSecs * 1000;
            var record = new storage.StorageItem();
            record.value = value;
            record.expiresAt = new Date().getTime() + expirationMS;
            switch (storageType) {
                case storage.StorageType.memory:
                    this._memoryStorage[key] = JSON.stringify(record);
                    break;
                case storage.StorageType.session:
                    sessionStorage.setItem(key, JSON.stringify(record));
                    break;
                case storage.StorageType.local:
                    localStorage.setItem(key, JSON.stringify(record));
                    break;
            }
            return record;
        };
        Manager._memoryStorage = {};
        return Manager;
    })();
    storage.Manager = Manager;
})(storage || (storage = {}));
var storage;
(function (storage) {
    var StorageItem = (function () {
        function StorageItem() {
        }
        return StorageItem;
    })();
    storage.StorageItem = StorageItem;
})(storage || (storage = {}));
var storage;
(function (storage) {
    var StorageType = (function () {
        function StorageType(value) {
            this.value = value;
        }
        StorageType.prototype.toString = function () {
            return this.value;
        };
        StorageType.memory = new StorageType("memory");
        StorageType.session = new StorageType("session");
        StorageType.local = new StorageType("local");
        return StorageType;
    })();
    storage.StorageType = StorageType;
})(storage || (storage = {}));

},{}]},{},[1])
(1)
});