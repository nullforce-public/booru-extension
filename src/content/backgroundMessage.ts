export interface IBackgroundMessage {
    action: "addToEagleFromUrl";
    data: BodyInit;
}

export function sendBackgroundMessage(message: IBackgroundMessage) {
    chrome.runtime.sendMessage(message);
}
