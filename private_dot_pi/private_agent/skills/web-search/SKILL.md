---
name: web-search
description: Search the web for current information using DuckDuckGo. Use when questions need facts beyond your training data, recent events, documentation, or when you'd say "I don't know."
---

# Web Search

Search web via DuckDuckGo instant answer API.

## Usage

```bash
./search.sh "query"
```

Returns instant answer + related topics if available.

## Examples

```bash
cd ~/.pi/agent/skills/web-search

# Quick facts
./search.sh "rust async"
./search.sh "typescript 5.7 release date"

# Documentation
./search.sh "react useEffect"
./search.sh "python list comprehension"
```

## Limitations

- Instant answers only (no full web results)
- Best for factual queries, definitions, simple docs
- For full pages, use web-fetch skill
