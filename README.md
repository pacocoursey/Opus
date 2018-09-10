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

![Opus Screenshot](screenshot.png)

## Features

Features I'd like to implement:

- [ ] Ability to have multiple projects (folders) open at once
- [ ] Drag and drop to move files in the tree-view
- [X] Filter files to match only .opus files
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
