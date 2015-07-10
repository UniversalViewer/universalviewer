// todo: add indexer? http://stackoverflow.com/questions/14841598/implementing-an-indexer-in-a-class-in-typescript
class Session {

    static set(key: string, data: any, expirationSecs: number): any{
        var expirationMS = expirationSecs * 1000;

        var record = {
            value: JSON.stringify(data),
            timestamp: new Date().getTime() + expirationMS
        };

        sessionStorage.setItem(key, JSON.stringify(record));

        return data;
    }

    static get(key: string){
        var data = sessionStorage.getItem(key);

        if(!data) {
            return false;
        }

        data = JSON.parse(data);

        return (new Date().getTime() < data.timestamp && JSON.parse(data.value));
    }
}

export = Session;