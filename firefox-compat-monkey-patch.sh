#!/bin/bash
# firefox-compat-monkey-patch.sh

# see: https://github.com/extend-chrome/rollup-plugin-chrome-extension/issues/56#issuecomment-852182897
existingContentScript='\/\*\@__PURE__\*\/JSON.parse('\''"..\/src\/content_script.js"'\'')'
replacementContentScript='chrome.runtime.getURL("..\/src\/content_script.js");'

existingBackgroundScript='\/\*\@__PURE__\*\/JSON.parse('\''"..\/src\/background_script.js"'\'')'
replacementBackgroundScript='chrome.runtime.getURL("..\/src\/background_script.js");'

find dist/assets/ -type f -name "*.js" -print0 | xargs -0 sed -i '' -e "s/$existingContentScript/$replacementContentScript/g"
find dist/assets/ -type f -name "*.js" -print0 | xargs -0 sed -i '' -e "s/$existingBackgroundScript/$replacementBackgroundScript/g"
