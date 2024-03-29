-- This file can be loaded by calling `lua require('plugins')` from your init.vim

-- Only required if you have packer configured as `opt`
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
	-- Packer can manage itself
	use 'wbthomason/packer.nvim'

	use 'savq/melange'

	use(
		'nvim-treesitter/nvim-treesitter',
		{ run = ':TSUpdate' }
	)

	use 'justinmk/vim-sneak'

	use 'github/copilot.vim'
end)
