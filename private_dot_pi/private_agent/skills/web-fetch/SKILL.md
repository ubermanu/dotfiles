---
name: web-fetch
description: Fetch and extract readable text from URLs. Use when you need to read documentation, articles, or any web page content.
---

# Web Fetch

Fetch URLs and extract readable text.

## Usage

```bash
./fetch.sh "https://example.com"
```

Outputs markdown-formatted text content.

## Examples

```bash
cd ~/.pi/agent/skills/web-fetch

# Fetch page
./fetch.sh "https://docs.python.org/3/tutorial/introduction.html"

# Save to file
./fetch.sh "https://example.com/article" > article.md
```

## Requirements

Uses `lynx` for HTML-to-text conversion. Install if missing:

```bash
# macOS
brew install lynx

# Debian/Ubuntu
sudo apt-get install lynx

# Fallback: uses basic curl if lynx unavailable
```

## Limitations

- Text content only (no images, complex layouts)
- JavaScript-rendered content may not work
- For PDFs, save and use `pdftotext` or similar
