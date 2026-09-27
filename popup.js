console.log("Vanisher extension loaded");
const contentContainer = document.querySelector(".content-container"); // the area which shows the radio group
const powerBtn = document.querySelector(".power-btn")
const clearHistoryBtn = document.querySelector(".clear-history-btn")
const clearDownloadsBtn = document.querySelector(".clear-downloads-btn")
const clearCacheBtn = document.querySelector(".clear-cache-btn")
const clearCookiesBtn = document.querySelector(".clear-cookies-btn")
const clearLocalStorageBtn = document.querySelector(".clear-localstorage-btn")
const clearPasswordsBtn = document.querySelector(".clear-passwords-btn")
const clearFormDataBtn = document.querySelector(".clear-formdata-btn")
const clearNowBtn = document.querySelector(".clear-now-btn")
const radioInputs = document.querySelectorAll('[name="schedule-time"]');
const customNumberSelect = document.getElementById("custom-number");
const customUnitSelect = document.getElementById("custom-unit");

// Mapping for all cleanup toggles to their storage and browsingData keys
const dataToggles = [
    { element: clearHistoryBtn, storageKey: "clearHistory", dataKey: "history" },
    { element: clearDownloadsBtn, storageKey: "clearDownloads", dataKey: "downloads" },
    { element: clearCacheBtn, storageKey: "clearCache", dataKey: "cache" },
    { element: clearCookiesBtn, storageKey: "clearCookies", dataKey: "cookies" },
    { element: clearLocalStorageBtn, storageKey: "clearLocalStorage", dataKey: "localStorage" },
    { element: clearPasswordsBtn, storageKey: "clearPasswords", dataKey: "passwords" },
    { element: clearFormDataBtn, storageKey: "clearFormData", dataKey: "formData" }
];

let fifteenMinutesMs = (15 * 60 * 1000);
let oneHourMs = (1 * 60 * 60 * 1000);
let oneDayMs = (24 * 60 * 60 * 1000)
let oneWeekMs = (7 * 24 * 60 * 60 * 1000)

// Range limitations per unit
const unitLimits = {
    "minutes": { min: 1, max: 60 },
    "hours": { min: 1, max: 24 },
    "days": { min: 1, max: 7 },
    "weeks": { min: 1, max: 4 },
    "months": { min: 1, max: 12 }
};

// Dynamically populate numbers dropdown based on selected unit
const populateNumberDropdown = (unit, preferredValue) => {
    if (!customNumberSelect) return;
    const limit = unitLimits[unit] || unitLimits["hours"];
    const currentVal = parseInt(preferredValue ?? customNumberSelect.value, 10) || 1;

    customNumberSelect.innerHTML = "";
    for (let i = limit.min; i <= limit.max; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        customNumberSelect.appendChild(option);
    }

    // Clamp value to max if previously selected value exceeds the new limit
    const clampedValue = Math.min(Math.max(currentVal, limit.min), limit.max);
    customNumberSelect.value = clampedValue;
};

// Helper to compute custom duration in ms and interval in minutes
const getCustomSchedule = (customNum, customUnit) => {
    const num = parseInt(customNum ?? customNumberSelect?.value, 10) || 1;
    const unit = customUnit ?? customUnitSelect?.value ?? "hours";

    const unitMultipliers = {
        "minutes": { ms: 60 * 1000, minutes: 1 },
        "hours": { ms: 60 * 60 * 1000, minutes: 60 },
        "days": { ms: 24 * 60 * 60 * 1000, minutes: 1440 },
        "weeks": { ms: 7 * 24 * 60 * 60 * 1000, minutes: 10080 },
        "months": { ms: 30 * 24 * 60 * 60 * 1000, minutes: 43200 }
    };

    const multiplier = unitMultipliers[unit] ?? unitMultipliers["hours"];
    return {
        durationInMs: num * multiplier.ms,
        intervalInMinutes: Math.max(1, num * multiplier.minutes)
    };
};

// delete history of the user who installed extension
let deleteHistoryRange = (option) => {
    let durationInMs;
    let intervalInMinutes;

    if (option == "option-1") {
        durationInMs = fifteenMinutesMs;
        intervalInMinutes = 15;
    } else if (option == "option-2") {
        durationInMs = oneHourMs;
        intervalInMinutes = 60;
    } else if (option == "option-3") {
        durationInMs = oneDayMs;
        intervalInMinutes = 1440;
    } else if (option == "option-4") {
        durationInMs = oneWeekMs;
        intervalInMinutes = 10080;
    } else if (option == "option-custom") {
        const custom = getCustomSchedule();
        durationInMs = custom.durationInMs;
        intervalInMinutes = custom.intervalInMinutes;
    } else {
        durationInMs = 0;
        intervalInMinutes = 15;
    }

    // delete any previous alarm
    chrome.alarms.clearAll((wasRemoved) => {
        console.log("Previous alarms were cleared: ", wasRemoved);
    })

    // create a new alarm with the chosen interval
    chrome.alarms.create("schedule-time", {
        delayInMinutes: intervalInMinutes,
        periodInMinutes: intervalInMinutes,
    })

    // save the state of alarm in the local storage
    const stateToSave = {
        optionSelected: option,
        durationInMs: durationInMs
    };

    if (option === "option-custom") {
        stateToSave.customNumber = customNumberSelect?.value || "1";
        stateToSave.customUnit = customUnitSelect?.value || "hours";
    }

    chrome.storage.local.set(stateToSave, () => {
        console.log("Schedule state saved to local storage: ", stateToSave);
    });
}

// powerBtn -> see if the extension is on or off
powerBtn.addEventListener("change", (event) => {

    // if the powerBtn state has turned off -> clear all the alarms/schedules off
    if (event.target.checked == false) {
        console.log('power button turned off')

        // clear all the chrome alarms
        chrome.alarms.clearAll((wasRemoved) => {
            console.log("All schedules cleared: ", wasRemoved);
        })

        // disable all data option switches
        dataToggles.forEach(toggle => {
            if (toggle.element) toggle.element.disabled = true;
        });

        // disable the radio button container
        radioInputs.forEach(element => {
            element.disabled = true;
        });

        // disable custom selects
        if (customNumberSelect) customNumberSelect.disabled = true;
        if (customUnitSelect) customUnitSelect.disabled = true;

        // disable the clear now button 
        clearNowBtn.disabled = true;

        // save the last state of option of alarm in db
        chrome.storage.local.get("optionSelected", (localStorage) => {
            let lastOptionInDB = localStorage.optionSelected ?? "option-1"
            const radioEl = document.getElementById(lastOptionInDB);
            if (radioEl) radioEl.checked = false;
        });

        // store the state of extension to storage
        chrome.storage.local.set({
            extensionEnabled: false,
        },
            () => {
                console.log("extensionEnabled = false, saved to local db");
            });
    }
    // turn the alarm on, based on the last state saved of choice
    else if (event.target.checked == true) {

        // enable all data option switches
        dataToggles.forEach(toggle => {
            if (toggle.element) toggle.element.disabled = false;
        });

        // enable the radio button container
        radioInputs.forEach(element => {
            element.disabled = false;
        });

        // enable custom selects
        if (customNumberSelect) customNumberSelect.disabled = false;
        if (customUnitSelect) customUnitSelect.disabled = false;

        // enable the clear now button
        clearNowBtn.disabled = false;

        // turn the last state of option radio alarm on
        chrome.storage.local.get(["optionSelected", "customNumber", "customUnit"], (localStorage) => {
            let lastOptionInDB = localStorage.optionSelected ?? "option-1";

            if (localStorage.customUnit && customUnitSelect) {
                customUnitSelect.value = localStorage.customUnit;
            }
            const currentUnit = customUnitSelect ? customUnitSelect.value : "hours";
            populateNumberDropdown(currentUnit, localStorage.customNumber);

            const radioEl = document.getElementById(lastOptionInDB);
            if (radioEl) radioEl.checked = true;

            // start the alarm with the restored option
            deleteHistoryRange(lastOptionInDB);
        });

        chrome.storage.local.set({
            extensionEnabled: true,
        },
            () => {
                console.log("extensionEnabled = true, saved to local db")
            });
    }
})

// Listen to changes on each of the cleanup options
dataToggles.forEach(({ element, storageKey }) => {
    if (!element) return;
    element.addEventListener("change", (event) => {
        const isChecked = event.target.checked;
        chrome.storage.local.set({ [storageKey]: isChecked }, () => {
            console.log(`Saved ${storageKey} to local storage:`, isChecked);
        });
    });
});

// radio inputs change listener
radioInputs.forEach(btn => {
    btn.addEventListener("change", (event) => {
        if (event.target.checked) {
            const optionID = event.target.id;
            console.log("Radio changed to:", optionID);
            deleteHistoryRange(optionID);
        }
    })
});

// Custom dropdown listeners
const handleCustomDropdownChange = () => {
    // Check the custom radio button
    const customRadio = document.getElementById("option-custom");
    if (customRadio) customRadio.checked = true;

    // Apply the schedule
    deleteHistoryRange("option-custom");
};

if (customUnitSelect) {
    customUnitSelect.addEventListener("change", () => {
        populateNumberDropdown(customUnitSelect.value);
        handleCustomDropdownChange();
    });
}

if (customNumberSelect) {
    customNumberSelect.addEventListener("change", handleCustomDropdownChange);
}

// clear history from the current moment -> selected duration
clearNowBtn.addEventListener("click", (event) => {

    let clearConsent = confirm("You want to clear the selected browsing data now?")
    console.log("User wants to clear data now");
    console.log('user consent: ', clearConsent)

    if (clearConsent == true) {
        console.log("going to delete the data now with consent: ", clearConsent);
        const currentTime = Date.now()

        const storageKeysToFetch = [
            "clearHistory",
            "clearDownloads",
            "clearCache",
            "clearCookies",
            "clearLocalStorage",
            "clearPasswords",
            "clearFormData",
            "optionSelected",
            "durationInMs",
            "customNumber",
            "customUnit"
        ];

        chrome.storage.local.get(storageKeysToFetch, (localStorage) => {

            let durationInMs;
            let option = localStorage.optionSelected;
            if (option == "option-1") {
                durationInMs = fifteenMinutesMs;
            } else if (option == "option-2") {
                durationInMs = oneHourMs;
            } else if (option == "option-3") {
                durationInMs = oneDayMs;
            } else if (option == "option-4") {
                durationInMs = oneWeekMs;
            } else if (option == "option-custom") {
                const custom = getCustomSchedule(localStorage.customNumber, localStorage.customUnit);
                durationInMs = custom.durationInMs;
            } else {
                durationInMs = 0; // -> don't delete any history range
            }

            let sinceTimeStamp = currentTime - durationInMs;

            const dataToRemove = {
                "history": localStorage.clearHistory ?? false,
                "downloads": localStorage.clearDownloads ?? false,
                "cache": localStorage.clearCache ?? false,
                "cookies": localStorage.clearCookies ?? false,
                "localStorage": localStorage.clearLocalStorage ?? false,
                "passwords": localStorage.clearPasswords ?? false,
                "formData": localStorage.clearFormData ?? false
            };

            chrome.browsingData.remove({
                "since": sinceTimeStamp
            }, dataToRemove,
                () => {
                    console.log("Deleted Browsing Data successfully:", dataToRemove);
                })
        })
    } else if (clearConsent == false) {
        console.log("user denied to clear history now: ", clearConsent);
    }
})

// load the state of the extension from the local storage when the pop up is opened
const initialStorageKeys = [
    "clearHistory",
    "clearDownloads",
    "clearCache",
    "clearCookies",
    "clearLocalStorage",
    "clearPasswords",
    "clearFormData",
    "extensionEnabled",
    "optionSelected",
    "customNumber",
    "customUnit"
];

chrome.storage.local.get(initialStorageKeys, (localStorage) => {

    // change the state of power-btn
    let extensionEnabled = localStorage.extensionEnabled ?? false;
    powerBtn.checked = extensionEnabled;

    // restore state for each cleanup checkbox
    dataToggles.forEach(({ element, storageKey }) => {
        if (element) {
            element.checked = localStorage[storageKey] ?? false;
        }
    });

    // restore custom dropdowns with appropriate unit limits
    if (localStorage.customUnit && customUnitSelect) {
        customUnitSelect.value = localStorage.customUnit;
    }
    const currentUnit = customUnitSelect ? customUnitSelect.value : "hours";
    populateNumberDropdown(currentUnit, localStorage.customNumber);

    // turn the radio button of last state saved checked true
    let lastOptionInDB = localStorage.optionSelected ?? "option-1";
    const radioEl = document.getElementById(lastOptionInDB);
    if (radioEl) radioEl.checked = true;

    // if the state of power-btn is off then disable controls on startup as well
    if (extensionEnabled == false) {
        radioInputs.forEach(element => {
            element.disabled = true;
        });
        if (customNumberSelect) customNumberSelect.disabled = true;
        if (customUnitSelect) customUnitSelect.disabled = true;
        clearNowBtn.disabled = true;
        dataToggles.forEach(({ element }) => {
            if (element) element.disabled = true;
        });
    }

});
