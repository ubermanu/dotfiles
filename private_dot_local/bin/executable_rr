#!/bin/bash

# A script to re-run any command passed as argument
# when pressing the 'x' key.

# ANSI color codes for formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RESET='\033[0m'

# Control keys
target_key='x'

# Check if the command is provided
if [ $# -eq 0 ]; then
    echo -e "Usage: $0 <command>"
    exit 1
fi

# Extract the command and its arguments
command_to_execute="$1"
shift  # Shift the arguments to remove the command

clear

while true; do
    echo -e "${GREEN}Press \"${target_key}\" to re-run the command...${RESET}"
    read -rsn1 input_key

    if [ "$input_key" = "$target_key" ]; then
				clear
				eval "$command_to_execute" "$@"
    fi
done
