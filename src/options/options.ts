import { ISettings } from "../shared/settings.ts";
import { SettingsManager } from "./settingsManager.ts";
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
const eagleAutoSaveElement = document.getElementById("eagleAutoSave") as HTMLInputElement;
const eagleApiTokenElement = document.getElementById("eagleApiToken") as HTMLInputElement;

const includeTagsElement = document.getElementById("includeTags") as HTMLTextAreaElement;
const excludeTagsElement = document.getElementById("excludeTags") as HTMLTextAreaElement;

// UI logic for loading and saving settings
const settingsManager = new SettingsManager();

async function loadOptionsUI() {
    const s = await settingsManager.load();
    // Use settingsManager.get for type-safe access
    showArtistElement.checked = settingsManager.get("showArtist") ?? true;
    showTagsElement.checked = settingsManager.get("showTags") ?? true;
    showHighlightTagsElement.checked = settingsManager.get("showHighlightTags") ?? true;
    headerTagsElement.value = (settingsManager.get("headerTags") ?? []).join("\n");
    highlightTagsElement.value = (settingsManager.get("highlightTags") ?? []).join("\n");
    includeTagsElement.value = (settingsManager.get("includeTags") ?? []).join("\n");
    excludeTagsElement.value = (settingsManager.get("excludeTags") ?? []).join("\n");
    eagleEnabledElement.checked = settingsManager.get("eagleEnabled") ?? true;
    eagleDownloadButtonElement.checked = settingsManager.get("eagleDownloadButton") ?? true;
    eagleDownloadFavoriteElement.checked = settingsManager.get("eagleDownloadFavorite") ?? true;
    eagleAutoSaveElement.checked = settingsManager.get("eagleAutoSave") ?? false;
    eagleApiTokenElement.value = settingsManager.get("eagleApiToken") ?? "";
}

async function saveOptionsUI() {
    await settingsManager.set("showArtist", showArtistElement.checked);
    await settingsManager.set("showTags", showTagsElement.checked);
    await settingsManager.set("showHighlightTags", showHighlightTagsElement.checked);
    await settingsManager.set("headerTags", headerTagsElement.value.split("\n"));
    await settingsManager.set("highlightTags", highlightTagsElement.value.split("\n"));
    await settingsManager.set("includeTags", includeTagsElement.value.split("\n"));
    await settingsManager.set("excludeTags", excludeTagsElement.value.split("\n"));
    await settingsManager.set("eagleEnabled", eagleEnabledElement.checked);
    await settingsManager.set("eagleDownloadButton", eagleDownloadButtonElement.checked);
    await settingsManager.set("eagleDownloadFavorite", eagleDownloadFavoriteElement.checked);
    await settingsManager.set("eagleAutoSave", eagleAutoSaveElement.checked);
    await settingsManager.set("eagleApiToken", eagleApiTokenElement.value);
    // Color is handled separately by button logic

    const status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(() => { status.textContent = ""; }, 750);
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

document.addEventListener("DOMContentLoaded", loadOptionsUI);
document.getElementById("save").addEventListener("click", saveOptionsUI);

// Tab switching logic
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
            tab.classList.add("active");
            const target = document.getElementById("tab-" + tab.getAttribute("data-tab"));
            if (target) target.classList.add("active");
        });
    });

    // Display extension version from manifest.json
    fetch(chrome.runtime.getURL("manifest.json"))
        .then(response => response.json())
        .then(manifest => {
            const versionSpan = document.getElementById("version");
            if (versionSpan) {
                versionSpan.textContent = manifest.version;
            }
        });
});

constructOptions(presetButtonColors);
