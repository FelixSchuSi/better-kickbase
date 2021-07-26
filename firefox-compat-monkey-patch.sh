#!/bin/bash
# find_and_replace.sh

existing='\/\*\@__PURE__\*\/JSON.parse('\''"..\/scripts\/root.widget.js"'\'')'
replacement='chrome.runtime.getURL("..\/scripts\/root.widget.js");'

# echo "Monkey patching output files for firefox compatibility"
# echo "Changing: "
# echo $existing
# echo "To: "
# echo $replacement

find dist/assets/ -type f -name "*.js" -print0 | xargs -0 sed -i '' -e "s/$existing/$replacement/g"
