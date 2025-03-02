#!/usr/bin/env bash

# Polybar simple bluetooth module
# Yoinked from https://github.com/msaitz/polybar-bluetooth/pull/4

# Check if Bluetooth is powered on
if systemctl is-active bluetooth | grep -q "inactive"; then
  echo ""
elif ! bluetoothctl show | grep -q "Powered: yes"; then
  echo "%{F#6b6b6b}%{F-}"
else
  # Check if any Bluetooth device is connected
  if bluetoothctl info | grep -q 'Connected: yes'; then
    DEVICE=$(bluetoothctl info | awk -F': ' '/Alias:/ { print $2 }')
    echo " $DEVICE"
  else
    echo ""
  fi
fi
