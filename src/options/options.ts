import { ISettings, getSettings, setSettings } from "../content/settings.ts";
const page = document.getElementById("buttonDiv");
const selectedClassName = "current";
const presetButtonColors = [
    "#3aa757",
    "#e8453c",
    "#f9bb2d",
    "#4688f1"
];

const showArtistElement = document.getElementById("showArtist") as HTMLInputElement;
const showTagsElement = document.getElementById("showTags") as HTMLInputElement;
const showHighlightTagsElement = document.getElementById("showHighlightTags") as HTMLInputElement;
const headerTagsElement = document.getElementById("headerTags") as HTMLInputElement;
const highlightTagsElement = document.getElementById("highlightTags") as HTMLInputElement;

const eagleEnabledElement = document.getElementById("eagleEnabled") as HTMLInputElement;
const eagleDownloadButtonElement = document.getElementById("eagleDownloadButton") as HTMLInputElement;
const eagleDownloadFavoriteElement = document.getElementById("eagleDownloadFavorite") as HTMLInputElement;
const eagleAutoSaveElement = document.getElementById(("eagleAutoSave")) as HTMLInputElement;

// Save options to chrome.storage
async function saveOptions() {
    const showArtist = showArtistElement.checked;
    const showTags = showTagsElement.checked;
    const showHighlightTags = showHighlightTagsElement.checked;
    const headerTags = headerTagsElement.value;
    const highlightTags = highlightTagsElement.value;

    const eagleEnabled = eagleEnabledElement.checked;
    const eagleDownloadButton = eagleDownloadButtonElement.checked;
    const eagleDownloadFavorite = eagleDownloadFavoriteElement.checked;
    const eagleAutoSave = eagleAutoSaveElement.checked;

    await setSettings({
        showArtist,
        showTags,
        showHighlightTags,
        headerTags: headerTags.split("\n"),
        highlightTags: highlightTags.split("\n"),
        color: "#3aa757",
        eagleEnabled,
        eagleDownloadButton,
        eagleDownloadFavorite,
        eagleAutoSave
    });

    const status = document.getElementById("status");
    status.textContent = "Options saved.";

    setTimeout(
        function () {
            status.textContent = "";
        },
        750);
}

// Load options from chrome.storage
async function loadOptions() {
    const settings = await getSettings();
    console.log("nfDerpi: loadOptions: " + JSON.stringify(settings));

    showArtistElement.checked = settings.showArtist;
    showTagsElement.checked = settings.showTags;
    showHighlightTagsElement.checked = settings.showHighlightTags;

    headerTagsElement.value = settings.headerTags.join("\n");
    highlightTagsElement.value = settings.highlightTags.join("\n");

    eagleEnabledElement.checked = settings.eagleEnabled;
    eagleDownloadButtonElement.checked = settings.eagleDownloadButton;
    eagleDownloadFavoriteElement.checked = settings.eagleDownloadFavorite;
    eagleAutoSaveElement.checked = settings.eagleAutoSave;
}

function handleButtonClick(event: any) {
    const current = event.target.parentElement.querySelector(
        `.${selectedClassName}`
    );

    if (current && current !== event.target) {
        current.classList.remove(selectedClassName);
    }

    const color = event.target.dataset.color;
    event.target.classList.add(selectedClassName);

    // Save the options
    chrome.storage.sync.set({ color });
}

function constructOptions(buttonColors: string[]) {
    chrome.storage.sync.get("color", (data) => {
        const currentColor = data.color;

        for (let buttonColor of buttonColors) {
            let button = document.createElement("button");
            button.dataset.color = buttonColor;
            button.style.backgroundColor = buttonColor;
            button.classList.add("colorBtn");

            if (buttonColor === currentColor) {
                button.classList.add(selectedClassName);
            }

            button.addEventListener("click", handleButtonClick);
            page.appendChild(button);
        }
    });
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.getElementById("save").addEventListener("click", saveOptions);

constructOptions(presetButtonColors);
