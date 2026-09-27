// listener to the chrome alarm
chrome.alarms.onAlarm.addListener(() => {

    let currentTime = Date.now();
    let durationInMs;

    const storageKeys = [
        "clearHistory",
        "clearDownloads",
        "clearCache",
        "clearCookies",
        "clearLocalStorage",
        "clearPasswords",
        "clearFormData",
        "durationInMs",
        "extensionEnabled"
    ];

    chrome.storage.local.get(storageKeys, (localStorage) => {
        durationInMs = localStorage.durationInMs ?? 0;

        console.log("the alarm rang");
        console.log("Deleting Browsing Data: \ndurationInMs: ", durationInMs, "\nCurrentTime: ", currentTime);

        if (localStorage.extensionEnabled == true) {

            let sinceTimeStamp = currentTime - durationInMs;
            chrome.browsingData.remove({
                since: sinceTimeStamp
            }, {
                "history": localStorage.clearHistory ?? false,
                "downloads": localStorage.clearDownloads ?? false,
                "cache": localStorage.clearCache ?? false,
                "cookies": localStorage.clearCookies ?? false,
                "localStorage": localStorage.clearLocalStorage ?? false,
                "passwords": localStorage.clearPasswords ?? false,
                "formData": localStorage.clearFormData ?? false
            },
                () => {
                    console.log("Background scheduled cleanup finished successfully");
                })

        }
    })

})

// when the extension is installed
chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.local.set({
        extensionEnabled: false,
        optionSelected: "option-1",
        durationInMs: 900000,
        customNumber: "1",
        customUnit: "hours",
        clearHistory: false,
        clearDownloads: false,
        clearCache: false,
        clearCookies: false,
        clearLocalStorage: false,
        clearPasswords: false,
        clearFormData: false
    });
})