phoneDict = getPhoneDict();
wordToIpaDict = {};

chrome.storage.local.get(["wordToIpaDict"], result => {
    wordToIpaDict = result.wordToIpaDict;
    translatePage();

    // Set up translation for text nodes added later
    document.addEventListener("DOMNodeInserted", function(e) {
        textEls = textNodesUnder(e.target);
        for (let el of textEls) {
            translated = translateText(el.wholeText);
            el.nodeValue = translated;
        }
    }, false);
});

function translatePage() {
    let textEls = [];
    if (document.body !== null) {
        textEls = textNodesUnder(document.body);
    }

    for (let el of textEls) {
        translated = translateText(el.wholeText);
        el.nodeValue = translated;
    }
}

function translateText(sentence) {
    let sentenceSplit = sentence.split(/([A-Za-z']+)/g);
    let translated = "";
    for (let sentencePart of sentenceSplit) {
        if (isNonWord(sentencePart) || sentencePart.toLowerCase() == "i") {
            translated += sentencePart;
        } else {
            translated += translateWord(sentencePart);
        }
    }
    return translated;
}

function translateWord(word) {
    let lowerCaseWord = word.toLowerCase();
    let translatedWord = translatePhoneticWord(getPhoneticWordFromWord(lowerCaseWord));

    if (isUpperCase(word)) {   // All caps
        translatedWord = translatedWord.toUpperCase();
    } else if (isUpperCase(word[0])) {   // First letter capitalized
        translatedWord = translatedWord[0].toUpperCase() + translatedWord.slice(1);
    }

    // Handling common contractions
    let apostropheIndex = lowerCaseWord.indexOf("'");

    if (apostropheIndex != -1) {   // Probably contraction
        if (apostropheIndex == lowerCaseWord.length - 2) {   // Likely 's, 'd, 'm, or 't
            // Post-apostrophe doobified is only one character
            translatedWord = translatedWord.slice(0,-1).concat("'", translatedWord.charAt(translatedWord.length-1));
        } else if (apostropheIndex == lowerCaseWord.length - 3) {   // Likely 'll, 've, or 're
            let postApostrophe = lowerCaseWord.substring(apostropheIndex + 1);

            if (postApostrophe == "ll" || postApostrophe == "re") {
                // Post-apostrophe doobified is only one character
                translatedWord = translatedWord.slice(0,-1).concat("'", translatedWord.charAt(translatedWord.length-1));
            }
            else if (postApostrophe == "ve") {
                // Post-apostrophe doobified should be 3 characters
                translatedWord = translatedWord.slice(0,-3).concat("'", translatedWord.slice(-3));
            }
        }
    }

    return translatedWord;
}

function translatePhoneticWord(phoneticWord) {
    let translated = "";
    for (let phone of phoneticWord) {
        translated += getDoobFromPhone(phone);
    }
    return translated;
}

// https://gist.github.com/Daniel-Hug/1415b4d027e3e9854456f4e812ea2ce1
function textNodesUnder(parent){
	var all = [];
	for (parent = parent.firstChild; parent; parent = parent.nextSibling) {
		if (['SCRIPT','STYLE'].indexOf(parent.tagName) >= 0) continue;
		if (parent.nodeType === Node.TEXT_NODE) all.push(parent);
		else all = all.concat(textNodesUnder(parent));
	}
	return all;
}

function isNonWord(s) {
    // _\W is all non-word characters, then subtract ['] to allow contractions
    return s == "" || /[_\W-[']]+/g.test(s);
}

function isUpperCase(char) {
    return char == char.toUpperCase();
}

function getPhoneticWordFromWord(word) {
    if (word in wordToIpaDict) {
        return wordToIpaDict[word].replace(/[ˌˈ]/g, "");
    }
    else return word;
}

function getDoobFromPhone(phone) {
    if (phone in phoneDict) {
        return phoneDict[phone];
    }
    else return phone;
}



function getPhoneDict() {
    return {
        'ʌ': "uh",
        'e': "e",
        'a': "a",
        'j': "y",
        'z': "z",
        'f': "v",
        'ɔ': "oh",
        'ɹ': "r",
        't': "d",
        'u': "oo",
        'w': "w",
        'n': "n",
        'ɪ': "ih",
        'p': "b",
        'l': "l",
        'ɑ': "ah",
        'b': "b",
        'ɚ': "er",
        'g': "g",
        'k': "g",
        's': "z",
        'ɛ': "eh",
        'θ': "th",
        'm': "m",
        'd': "d",
        'v': "v",
        'i': "ee",
        'æ': "a",
        'o': "o",
        'ŋ': "ng",
        'ʃ': "zh",
        'ʒ': "zh",
        'h': "h",
        'ʤ': "j",
        'ʧ': "j",
        'ʊ': "oo",
        "ð": "th"
    };
}