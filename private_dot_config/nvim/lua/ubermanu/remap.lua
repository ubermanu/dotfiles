vim.g.mapleader = " "
vim.keymap.set("n", "<leader>pv", vim.cmd.Ex)

-- Always paste from the default register
-- https://superuser.com/a/321726
vim.keymap.set("x", "p", "\"_dP")


-- Keep the cursor in the middle
vim.keymap.set("n", "<C-d>", "<C-d>zz")
vim.keymap.set("n", "<C-u>", "<C-u>zz")

-- Block Q
vim.keymap.set("n", "Q", "<nop>");
