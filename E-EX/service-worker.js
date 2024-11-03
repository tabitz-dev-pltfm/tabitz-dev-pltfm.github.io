const CACHE_NAME = "e-ex-project-v1";

self.addEventListener("fetch", (event) => {
    event.respondWith(
        new Promise((resolve) => {
            caches.open(CACHE_NAME).then((cache) => {
                console.log("From Service Worker: ", event.request.url.replace(/https?:\/\/[^\/]+/, ""));
                cache.match(event.request.url.replace(/https?:\/\/[^\/]+\//, "")).then((response) => {
                    if (response) {
                        resolve(response);
                    }
                    else {
                        cache.match(event.request.url.replace(/https?:\/\/[^\/]+/, "").replace(/\/$/, "") + "/index.html").then((res) => {
                            if (res) {
                                resolve(res);
                            }
                            else {
                                fetch(event.request).then((response) => {
                                    resolve(response);
                                })
                                .catch((error) => {
                                    resolve(new Response(error));
                                })
                            }
                        });
                    }
                })
            });
        })
    );
});

self.addEventListener("message", (event) => {
    caches.open(CACHE_NAME).then((cache) => {
        if (event.data.command === "add") {
            console.log("Message has sent");
            cache.put(event.data.pathname, new Response(event.data.file, {
                headers: {
                    "Content-type": event.data.file.type
                }
            }))
        }
        else if (event.data.command === "delete") {
            cache.delete(event.data.pathname).then((response) => {
                console.log("Cache is deleted");
            });
        }
    });
});
