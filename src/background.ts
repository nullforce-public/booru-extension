import { IBackgroundMessage } from "./content/backgroundMessage";
const color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
    // When the extension is first installed or updated, set default options
    console.log("nfDerpi: Default options set.");
});

chrome.runtime.onMessage.addListener(function (request: IBackgroundMessage) {
    console.log(request);
    if (request.action === "addToEagleFromUrl") {
        fetch("http://localhost:41595/api/item/addFromURL", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: request.data
        }).then(response => console.log(response))
            .catch(error => console.log("nfDerpi Error: ", error));
    }
});
