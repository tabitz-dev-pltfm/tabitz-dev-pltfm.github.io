window.onload = () => {
    const input = document.getElementById("editor");
    const request = indexedDB.open("MyStorage", 1);

    request.onupgradeneeded = (e) => {
        /**@type {IDBDatabase} db */
        const db = e.target.result;
        /**@type {IDBObjectStore} MyStorage */
        const MyStorage = db.createObjectStore("test", {keyPath: "id"});

        MyStorage.createIndex("name", "name", {unique: true});
        MyStorage.transaction.oncomplete = (e) => {
            const activeObjectStore = db.transaction("test", "readwrite").objectStore("test");
            if ((() => {try{JSON.parse(input.value); return true} catch(e){return false}})()) {
                JSON.parse(input.value).forEach(data => {
                    activeObjectStore.add(data);
                });
            }
        };
    };
    request.onsuccess = (e) => {
        /**@type {IDBDatabase} db */
        const db = e.target.result;
        
        const r = db.transaction(["test"], "readonly").objectStore("test").getAll(null);
        r.onsuccess = (e) => {
            input.value = JSON.stringify(e.target.result);
        };

        input.onchange = () => {
            /**@type {IDBObjectStore} activeObjectStore */
            const activeObjectStore = db.transaction(["test"],"readwrite").objectStore("test");
            const req = activeObjectStore.clear();
            req.onsuccess = () => {
                if ((() => {try{JSON.parse(input.value); return true} catch(e){return false}})()) {
                    JSON.parse(input.value).forEach(data => {
                        activeObjectStore.add(data);
                    });
                }
            };
        };
    }

}
