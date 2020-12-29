# The Dranzleyder

My first browser extension, [live at the Google Chrome Web Store](https://chrome.google.com/webstore/detail/dranzleyder/dehjhkmplllpoobjdbaefnacnpalfbpn)!

It's Simple&trade; enough - text nodes are selected from the DOM, and every word is translated independently. Each word in each node is translated into its [International Phonetic Alphabet](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet) (IPA) spelling, and each IPA character within the word is replaced with its "dranzleyduhd" version.

Also, after a page is translated, text added after the initial translation (article pop-ups in Wikipedia, emails after opening from the Gmail inbox, etc.) is handled by translating individual text nodes added to the DOM using a simple listener.

## Example - Rick Astley's Wikipedia Page

### Before Translation:
<img alt="Screenshot: Rick Astley Wikipedia Page Before Translation" src="./screenshots/rick astley pre.jpg" width="800" />

### After Translation:
<img alt="Screenshot: Rick Astley Wikipedia Page After Translation" src="./screenshots/rick astley post.jpg" width="800" />
