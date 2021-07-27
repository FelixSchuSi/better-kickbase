#!/bin/bash
# firefox-compat-monkey-patch.sh

# see: https://github.com/extend-chrome/rollup-plugin-chrome-extension/issues/56#issuecomment-852182897
existing='\/\*\@__PURE__\*\/JSON.parse('\''"..\/scripts\/root.widget.js"'\'')'
replacement='chrome.runtime.getURL("..\/scripts\/root.widget.js");'

find dist/assets/ -type f -name "*.js" -print0 | xargs -0 sed -i '' -e "s/$existing/$replacement/g"
