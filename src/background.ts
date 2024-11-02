import { IBackgroundMessage } from "./shared/backgroundMessage";
import { getSettings } from "./shared/settings";

chrome.runtime.onInstalled.addListener(() => {
    // When the extension is first installed or updated, set default options
    console.log("nfDerpi: Default options set.");
});

chrome.runtime.onMessage.addListener(async function (request: IBackgroundMessage) {
    console.log(`nfDerpi background onMessage: ${request}`);

    // Get settings
    const settings = await getSettings();

    if (request.action === "addToEagleFromUrl") {
        addToEagleFromUrl(request);
    }
    else if (request.action === "getEagle") {
        console.log("nfDerpi: BG getEagle");
        const url = `http://localhost:41595/api/application/info?token=${settings.eagleApiToken}`
        fetch(url).then(response => response.json());
    }
});

function addToEagleFromUrl(request: any): void {
    console.log("nfDerpi: BG addToEagleFromUrl");
    fetch("http://localhost:41595/api/item/addFromURL", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: request.data
    }).then(response => console.log(response))
        .catch(error => console.log("nfDerpi Error: ", error));
}
