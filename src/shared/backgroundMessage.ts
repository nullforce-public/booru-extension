export interface IBackgroundMessage {
    action: "getEagle"
    | "addToEagleFromUrl";
    data: BodyInit | any;
}

export interface AddToEagleFromUrlMessage extends IBackgroundMessage {
    action: "addToEagleFromUrl";
    data: {
        url: string;
        imageUrls: string[];
    };
}

export interface GetEagleMessage extends IBackgroundMessage {
    action: "getEagle";
    data: BodyInit | any;
}

export function sendBackgroundMessage(message: IBackgroundMessage) {
    chrome.runtime.sendMessage(message);
}
