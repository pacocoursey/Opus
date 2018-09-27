# Opus

a minimalistic note-taking app.

## Installation

You can download the latest macOS binary from [releases](https://github.com/pacocoursey/Opus/releases/latest).

Alternatively, you can run Opus locally from the command line:

```bash
$ git clone https://github.com/pacocoursey/Opus.git
$ cd opus
$ npm install
$ npm run rebuild     # rebuild native spellchecker module
$ npm start
```

Keep in mind this project is still under development.

![Opus Light Mode Screenshot](assets/screenshot-light.png)
![Opus Dark Mode Screenshot](assets/screenshot-dark.png)

## Description

Opus aims to be a mix between a text-editor and note-taking application. It reads and writes `.note` files from your native file system. This means it works well with tools like Dropbox for syncing files across your devices.

Much like a code editor, Opus opens folders and allows you to edit the files inside. You can have multiple windows open, each with their own folder as a starting point.

## Goals

Features I'd like to implement:

- [ ] Drag and drop to move files in the tree-view
- [X] Automatically update file contents if edited elsewhere
- [X] Ability to have multiple projects (folders) open at once
- [X] Setting to hide and show footer
- [X] Filter files to match only .note files
- [X] Add Escape keybind to clear current cursor formatting
- [X] Add custom scroll bar to editor
- [X] Dark Mode
- [X] Find
- [X] Replace
- [X] Goto
- [X] Improve sidebar design and general application feel
- [X] Show current time in the footer
- [X] Show document stats in the footer, improve cursor position stats
- [X] Spellchecker

## Keybinds

### Application

- Preferences: `CmdOrCtrl+,`
- Close Window: `CmdOrCtrl+W`
- Hide: `CmdOrCtrl+H`
- Hide Others: `CmdOrCtrl+Option+H`

### Files

- New Window: `CmdOrCtrl+Shift+N`
- New: `CmdOrCtrl+N`
- Open: `CmdOrCtrl+O`
- Save: `CmdOrCtrl+S`
- Save As: `CmdOrCtrl+Shift+S`
- Toggle Sidebar: `CmdOrCtrl+\`

### Editor

- Separator: `CmdOrCtrl+Shift+H`
- Header 1: `CmdOrCtrl+1`
- Header 2: `CmdOrCtrl+2`
- Header 3: `CmdOrCtrl+3`
- Bold: `CmdOrCtrl+B`
- Italic: `CmdOrCtrl+I`
- Underline: `CmdOrCtrl+U`
- Strikethrough: `CmdOrCtrl+Shift+S`
- Unordered list: `CmdOrCtrl+L`
- Ordered list: `CmdOrCtrl+Shift+L`
- Quote: `CmdOrCtrl+Shift+.`
- Code: `CmdOrCtrl+Shift+C`
- Code-block: `CmdOrCtrl+Alt+C`
- Superscript: `CmdOrCtrl+Alt+Plus`
- Subscript: `CmdOrCtrl+Alt+Minus`
- Indent: `CmdOrCtrl+]`
- Outdent: `CmdOrCtrl+[`
- Clear formatting: `CmdOrCtrl+0`
