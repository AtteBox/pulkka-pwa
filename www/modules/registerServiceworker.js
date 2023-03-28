
function isDev() {
    try {
        // the following only works in dev mode when vite is used
        // @ts-ignore
        return import.meta.env.DEV;
    } catch (e) {
        return false;
    }

}

export const registerServiceworker = (/** @type {{ renderAppInfo: (appInfo: { version: string; }) => void; }} */ ui) => {
    // @ts-ignore
    if (isDev()) {
        console.log('Running in dev mode - skipping service worker registration and using app-info from main.js')
        ui.renderAppInfo({
            version: "dev",
        });
    } else {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register("/serviceworker.js").then(registration => {
                // update the service worker if there is a new version
                registration.update();
            }).catch(error => {
                console.error(`Registration failed with ${error}`);
            });
        }

        // get app info from service worker
        fetch('serviceworker.js/app-info').then(response => {
            // if there is no service worker, then the response will be 404
            if (response.status === 404) {
                return;
            }
            if (response.ok) {
                return response.json()
            }
            throw new Error('Error making request to app-info: ' + response.status + ' - ' + response.statusText);
        }).then(appInfo => {
            if (appInfo) {
                ui.renderAppInfo(appInfo);
            }
        });
    }
}