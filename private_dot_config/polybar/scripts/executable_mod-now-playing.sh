#!/bin/bash

# Simple "Now playing" script for polybar

ICON=" "
COLOR_INACTIVE='%{F#6b6b6b}'
COLOR_END='%{F-}'

STATUS=$(playerctl status)

# Playing
if [ "$STATUS" == "Playing" ]; then
    echo "$ICON $(playerctl metadata title)"
    exit 0
fi

# Paused
if [ "$STATUS" == "Paused" ]; then
    echo "${COLOR_INACTIVE}${ICON} $(playerctl metadata title)${COLOR_END}"
    exit 0
fi

# Not running
echo "${COLOR_INACTIVE}${ICON} Not running${COLOR_END}"

exit 0
