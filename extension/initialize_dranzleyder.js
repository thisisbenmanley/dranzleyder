let wordToIpaDict = {};

chrome.runtime.onInstalled.addListener((details) => {
    initializeWordToIpaDict();
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(
        null,
        {file: 'translate_page.js'}
    );
});

function initializeWordToIpaDict() {
    let dictRequest = new XMLHttpRequest();
    dictRequest.open('GET', 'https://raw.githubusercontent.com/Max-Davy/text-to-phonetic/master/ipadict.txt');
    dictRequest.onreadystatechange = function() {
        if (dictRequest.readyState != 4) return;

        const dictText = dictRequest.responseText;

        const dictEntries = dictText.split("\n");

        for (const i in dictEntries) {
            const entry = dictEntries[i].split(/\s+/g);
            if (entry[0][entry[0].length - 1] != ")") {
                wordToIpaDict[entry[0]] = entry[1];
            }
        }

        chrome.storage.local.set({"wordToIpaDict": wordToIpaDict}, () => {
            console.log("wordToIpaDict stored in Chrome storage");
            chrome.storage.local.get(["wordToIpaDict"], result => console.log(result));
        });
    }
    dictRequest.send();
}