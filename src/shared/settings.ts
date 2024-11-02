export interface ISettings {
    showArtist: boolean;
    showTags: boolean;
    showHighlightTags: boolean;
    headerTags: string[];
    highlightTags: string[];
    color: string;
    eagleEnabled: boolean;
    eagleDownloadButton: boolean;
    eagleDownloadFavorite: boolean;
    eagleAutoSave: boolean;
    eagleApiToken: string;
}

export async function getSettings(): Promise<ISettings> {
    const defaultColor = "#3aa757";
    return chrome.storage.sync.get({
        showArtist: true,
        showTags: true,
        showHighlightTags: true,
        headerTags: [],
        highlightTags: [],
        color: defaultColor,
        eagleEnabled: true,
        eagleDownloadButton: true,
        eagleDownloadFavorite: true,
        eagleAutoSave: false,
        eagleApiToken: ""
    })
        .then((settings) => {
            console.log("nfDerpi: Settings internal: " + JSON.stringify(settings));
            const result = {
                showArtist: settings.showArtist,
                showTags: settings.showTags,
                showHighlightTags: settings.showHighlightTags,
                headerTags: settings.headerTags,
                highlightTags: settings.highlightTags,
                color: settings.color,
                eagleEnabled: settings.eagleEnabled,
                eagleDownloadButton: settings.eagleDownloadButton,
                eagleDownloadFavorite: settings.eagleDownloadFavorite,
                eagleAutoSave: settings.eagleAutoSave,
                eagleApiToken: settings.eagleApiToken,
            }
            return result;
        });
}

export function setSettings(settings: ISettings): Promise<void> {
    return chrome.storage.sync.set({
        showArtist: settings.showArtist,
        showTags: settings.showTags,
        showHighlightTags: settings.showHighlightTags,
        headerTags: settings.headerTags,
        highlightTags: settings.highlightTags,
        color: settings.color,
        eagleEnabled: settings.eagleEnabled,
        eagleDownloadButton: settings.eagleDownloadButton,
        eagleDownloadFavorite: settings.eagleDownloadFavorite,
        eagleAutoSave: settings.eagleAutoSave,
        eagleApiToken: settings.eagleApiToken,
    });
}
