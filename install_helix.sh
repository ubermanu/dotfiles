#!/bin/sh

set -xe 

yay -S helix
yay -S marksman codelldb-bin rust-analyzer

# node based language servers
yay -Sdd vscode-css-languageserver vscode-html-languageserver vscode-json-languageserver typescript-language-server bash-language-server svelte-language-server yaml-language-server dockerfile-language-server
