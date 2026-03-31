#!/bin/bash
set -euo pipefail

url="${1:-}"
if [ -z "$url" ]; then
    echo "Usage: $0 <url>"
    exit 1
fi

# Fetch HTML (use --insecure for SSL issues)
html=$(curl -sSL --insecure "$url")

# Try extraction methods in order
if command -v lynx &> /dev/null; then
    echo "$html" | lynx -stdin -dump -nolist 2>/dev/null
elif command -v w3m &> /dev/null; then
    echo "$html" | w3m -T text/html -dump 2>/dev/null
elif command -v html2text &> /dev/null; then
    echo "$html" | html2text
else
    # Basic sed-based HTML stripping
    echo "# $url" 
    echo
    echo "$html" | \
        sed 's/<script[^>]*>.*<\/script>//g' | \
        sed 's/<style[^>]*>.*<\/style>//g' | \
        sed 's/<[^>]*>//g' | \
        sed 's/&nbsp;/ /g' | \
        sed 's/&lt;/</g' | \
        sed 's/&gt;/>/g' | \
        sed 's/&amp;/\&/g' | \
        sed 's/^[[:space:]]*//g' | \
        grep -v '^$' | \
        head -500
    echo
    echo "Note: Install lynx, w3m, or html2text for better extraction"
fi
