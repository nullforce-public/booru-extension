(async () => {
    const src = chrome.runtime.getURL('content/contentScript.js');
    const contentMain = await import(src);
    contentMain.main();
})();
