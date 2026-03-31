#!/bin/bash
set -euo pipefail

query="${1:-}"
if [ -z "$query" ]; then
    echo "Usage: $0 'search query'"
    exit 1
fi

# DuckDuckGo instant answer API
url="https://api.duckduckgo.com/?q=$(printf '%s' "$query" | jq -sRr @uri)&format=json&no_html=1&skip_disambig=1"

result=$(curl -s "$url")

# Extract fields
abstract=$(echo "$result" | jq -r '.Abstract // empty')
answer=$(echo "$result" | jq -r '.Answer // empty')
definition=$(echo "$result" | jq -r '.Definition // empty')
related=$(echo "$result" | jq -r '.RelatedTopics[]? | select(.Text) | .Text' | head -5)

# Output
if [ -n "$abstract" ]; then
    echo "=== Answer ==="
    echo "$abstract"
    echo
fi

if [ -n "$answer" ]; then
    echo "=== Quick Answer ==="
    echo "$answer"
    echo
fi

if [ -n "$definition" ]; then
    echo "=== Definition ==="
    echo "$definition"
    echo
fi

if [ -n "$related" ]; then
    echo "=== Related ==="
    echo "$related"
fi

if [ -z "$abstract" ] && [ -z "$answer" ] && [ -z "$definition" ]; then
    echo "No instant answer found."
    exit 1
fi
