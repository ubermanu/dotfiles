# dotfiles

- OS: Arch (btw)
- WM: i3
- Bar: Polybar
- Shell: ZSH
- Terminal: Ghostty
- File manager: Thunar
- Launcher: Rofi
- Notifications: Dunst
- Editor: Helix
- Browser: Google Chrome

## Install

See https://www.chezmoi.io/

    chezmoi init ubermanu --apply

or

    chezmoi init ubermanu --apply --ssh

## Dependencies

Install https://github.com/Morganamilo/paru

    paru -S $(cat dependencies.txt | tr '\n' ' ')
