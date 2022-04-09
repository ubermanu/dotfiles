#!/bin/bash

# Simple "Now playing" script for polybar

ICON=" "
COLOR_INACTIVE='%{F#6b6b6b}'
COLOR_END='%{F-}'

# Not running
[ $(playerctl status) == "Stopped" ] && echo "${COLOR_INACTIVE}${ICON} Not running${COLOR_END}"

# Paused
[ $(playerctl status) == "Paused" ] && echo "${COLOR_INACTIVE}$ICON $(playerctl metadata title)${COLOR_END}"

# Playing
[ $(playerctl status) == "Playing" ] && echo "$ICON $(playerctl metadata title)"

exit 0
