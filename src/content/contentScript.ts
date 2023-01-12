import { IBackgroundMessage, sendBackgroundMessage } from "./backgroundMessage.js";
import { ISettings, getSettings } from "./settings.js";

function getEagle() {
    var request = new XMLHttpRequest();
    request.open("GET", "http://localhost:41595/api/application/info");
    request.onload = function () {
        console.log(request.responseText);
    }
    request.send();
}

async function isInEagle(name: string, website: string): Promise<boolean> {
    const url = "http://localhost:41595/api/item/list?" + "name=" + encodeURIComponent(name);
    const response = await fetch(url, { method: "GET" });
    const json = await response.json();

    if (json.status === "success") {
        for (const item of json.data) {
            if (item.url === website) {
                return true;
            }
        }
    }

    return false;
}

async function addToEagleFromURL(
    url: string,
    name: string,
    website: string,
    tags: string[],
    annotation: string,
    folder: string | undefined = undefined): Promise<void> {

    console.log("nfDerpi: Checking if image is already in Eagle..." + name + " " + website);
    if (await isInEagle(name, website)) {
        console.log("nfDerpi: Already in Eagle");
        return;
    }

    console.log("nfDerpi: Adding to Eagle");
    const message: IBackgroundMessage = {
        action: "addToEagleFromUrl",
        data: JSON.stringify({
            url: url,
            name: name,
            website: website,
            tags: tags,
            annotation: annotation,
            folder: folder
        })
    };
    sendBackgroundMessage(message);
}

function formatLabelAndTextParagraph(label: string, text: string) {
    const paragraphElement = document.createElement("p");
    const strongElement = document.createElement("strong");
    const strongTextNode = document.createTextNode(label);
    const textNode = document.createTextNode(text);

    // assemble
    strongElement.appendChild(strongTextNode);
    paragraphElement.appendChild(strongElement);
    paragraphElement.appendChild(textNode);

    return paragraphElement;
}

function isShowImagePage() {
    const hasImagesInUri = document.location.href.includes("images");
    const imageShowContainer = document.querySelector("div.image-show-container");
    const isShowImagePage = hasImagesInUri || (imageShowContainer != null);
    console.log("nfDerpi: Is show image page: " + isShowImagePage);
    return isShowImagePage;
}

function getSiteTag(): string | undefined {
    switch (document.location.hostname) {
        case "derpibooru.org":
            return "site:derpibooru";
        case "manebooru.art":
            return "site:manebooru";
        case "ponerpics.org":
            return "site:ponerpics";
        case "ponybooru.org":
            return "site:ponybooru";
        case "twibooru.org":
            return "site:twibooru";
    }
    return undefined;
}

function getTags(element: HTMLElement): string[] {
    const keywordsMeta = document.querySelector("meta[name='keywords']") as HTMLMetaElement;
    const tags = keywordsMeta
        ? keywordsMeta.content
        : element.getAttribute("data-image-tag-aliases") || "";
    const tagArray = tags.split(", ").sort();
    const excludedTags = [
        "小马"
    ];
    const filteredTags = tagArray.filter(x => !excludedTags.includes(x));
    const siteTag = getSiteTag();

    if (siteTag) {
        return [siteTag, ...filteredTags];
    }

    return filteredTags;
}

function getArtistTags(tags: string[]) {
    // const artistTags = tags.match("artist:[^,]*");
    const artistTags = tags.filter(tag => tag.startsWith("artist:"));
    console.log("nfDerpi: Artist tags: " + artistTags);
    return artistTags;
}

function getMatchTags(tags: string[], matchArray: string[]) {
    const matchTags = tags.filter(x => matchArray.includes(x));
    console.log("nfDerpi: Match tags: " + matchTags);
    return matchTags;
}

function getTitle(element: HTMLElement) {
}

function getImageId(element: HTMLElement) {
    const id = element.getAttribute("data-image-id");
    return id;
}

function getImageUri(element: HTMLElement): string | undefined {
    const dataUris = element.getAttribute("data-uris");

    if (dataUris) {
        const uris = JSON.parse(dataUris);
        const fullUri = uris.full.startsWith("http") ? uris.full : document.location.origin + uris.full;
        return fullUri;
    }

    return undefined;
}

function getBooruUrl() {
    const booruUrl = document.location.origin + document.location.pathname;
    return booruUrl;
}

function getImageSource(element: HTMLElement) {
    const source = element.getAttribute("data-source-url");
    return source;
}

function getImageDescription(imageContainer: HTMLElement) {
    let descriptionLines: string[] = [];

    descriptionLines.push(`Booru: ${getBooruUrl()}`);

    const sourceUri = getImageSource(imageContainer);
    if (sourceUri) {
        descriptionLines.push(`Source: ${sourceUri}`);
    }

    const descriptionContainer = document.querySelector("div.image-description__text");

    if (descriptionContainer) {
        const descriptionElements = descriptionContainer.children;
        for (const node of descriptionElements) {
            descriptionLines.push(node.textContent || "");
        }

        const links = document.querySelectorAll("div.image-description__text a") as NodeListOf<HTMLAnchorElement>;
        for (const link of links) {
            descriptionLines.push(link.href);
        }
    }

    return descriptionLines.join("\n");
}

async function modifyShowImagePage(settings: ISettings): Promise<void> {
    const imageContainer = document.querySelector("div.image-show-container") as HTMLDivElement;
    const id = getImageId(imageContainer);
    const tags = getTags(imageContainer);
    const uri = getImageUri(imageContainer);
    const source = getBooruUrl();
    const description = getImageDescription(imageContainer);

    // Add tags to header
    const header = document.querySelector("div.block.block__header");
    const artistTags = getArtistTags(tags);
    const matchTags = getMatchTags(tags, settings.headerTags);

    if (header) {
        if (settings.showArtist && artistTags) {
            let artistParagraph = formatLabelAndTextParagraph(
                "Artist: ",
                artistTags.join(", "));
            header.appendChild(artistParagraph);
        }

        if (settings.showTags && matchTags) {
            let tagsParagraph = formatLabelAndTextParagraph(
                "Tags: ",
                matchTags.join(", "));
            header.appendChild(tagsParagraph);
        }
    } else {
        console.log("nfDerpi: No header found");
    }

    if (settings.eagleEnabled && uri) {
        if (settings.eagleDownloadButton) {
            // Add save to Eagle button
            const links = document.querySelector("div.flex.flex--wrap.image-metabar");
            if (links) {
                let strechedMobileLinks = document.createElement("div");
                strechedMobileLinks.classList.add("stretched-mobile-links");
                let eagleButton = document.createElement("a");
                eagleButton.title = "Save to Eagle";
                eagleButton.style.cssText = await isInEagle(id, source)
                    ? "color: limegreen;"
                    : "";
                eagleButton.onclick = function () {
                    addToEagleFromURL(uri, id || "image", source, tags, description);
                    eagleButton.style.cssText = "color: limegreen;";
                };
                let iconNode = document.createElement("i");
                iconNode.classList.add("fa", "fa-download");
                let textNode = document.createTextNode(" Eagle");

                // assemble
                strechedMobileLinks.appendChild(eagleButton);
                eagleButton.appendChild(iconNode);
                eagleButton.appendChild(textNode);

                links.appendChild(strechedMobileLinks);
            }
        }

        if (settings.eagleDownloadFavorite) {
            // Add to Eagle on Fave
            const faveLink = document.querySelector("a.interaction--fave") as HTMLAnchorElement;
            if (faveLink) {
                console.log("nfDerpi: Found fave link");
                faveLink.onclick = function () {
                    addToEagleFromURL(uri, id || "image", source, tags, description);
                }
            }
        }

        if (settings.eagleAutoSave) {
            // Add to Eagle on Load
            addToEagleFromURL(uri, id || "image", source, tags, description);
        }
    }

    console.log("nfDerpi: Tags: " + tags);
    console.log("nfDerpi: URI: " + uri);
    console.log("nfDerpi: Description: " + description);
}

async function modifyPage(settings: any): Promise<void> {
    // Every image is within a media-box
    // Notes: There's a data-image-id field and a style field
    // We add a green border to the style for matching tags
    const elements = document.querySelectorAll("div.media-box__content") as NodeListOf<HTMLDivElement>;
    console.log("nfDerpi: Elements: " + elements);

    for (let element of elements) {
        const imageContainer = element.querySelector("div.image-container") as HTMLDivElement;
        console.log("nfDerpi: Image container: " + imageContainer);
        if (imageContainer) {
            const tags = getTags(imageContainer);
            const artistTags = getArtistTags(tags);
            const matchTags = getMatchTags(tags, settings.headerTags);
            const highlightTags = getMatchTags(tags, settings.highlightTags);

            const parent = element.parentElement;
            if (parent) {
                let target = parent;

                // Get the header
                const header = parent.querySelector("div.media-box__header") as HTMLDivElement;

                if (header) {
                    target = header;
                    if (settings.showArtist || settings.showTags) {
                        header.style.minHeight = "75px";
                        header.style.maxHeight = "75px";

                        header.parentElement.style.maxHeight = "none";
                    }
                }

                if (settings.showArtist && artistTags) {
                    const artistParagraph = formatLabelAndTextParagraph(
                        "Artist: ",
                        artistTags.join(", "));
                    target.appendChild(artistParagraph);
                }

                if (settings.showTags && matchTags) {
                    const tagsParagraph = formatLabelAndTextParagraph(
                        "Tags: ",
                        matchTags.join(", "));
                    target.appendChild(tagsParagraph);
                }
            }

            const highlight = highlightTags.length > 0;
            if (highlight) {
                element.style.border = `1px solid ${settings.color}`
            }
        }
    }
}

export async function main(): Promise<void> {
    getEagle();
    const settings = await getSettings();
    console.log("nfDerpi: Settings: " + JSON.stringify(settings));
    if (isShowImagePage()) {
        modifyShowImagePage(settings);
    } else {
        modifyPage(settings);
    }
}
