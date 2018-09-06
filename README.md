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

- [ ] Improve design
- [ ] Find (and replace)
- [ ] Improve Tree-view (React?)
- [ ] Ability to have multiple projects (folders) open at once
- [ ] Drag and drop to move files in the tree-view
- [ ] Filter files by regex to match only text-based files (or custom file extension?)
- [ ] Add Escape keybind to clear current cursor formatting
- [X] Show current time in the footer
- [X] Improve footer (show word count, theme toggle)
- [X] Dark Mode
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

- Bold: `CmdOrCtrl+B`
- Italic: `CmdOrCtrl+I`
- Underline: `CmdOrCtrl+U`
- Strikethrough: `CmdOrCtrl+Shift+S`
- Subscript: `CmdOrCtrl+Alt+Minus`
- Superscript: `CmdOrCtrl+Alt+Plus`
- Header 1: `CmdOrCtrl+1`
- Header 2: `CmdOrCtrl+2`
- Header 3: `CmdOrCtrl+3`
- Unordered list: `CmdOrCtrl+L`
- Ordered list: `CmdOrCtrl+Shift+L`
- Blockquote: `CmdOrCtrl+Shift+.`
- Code-block: `CmdOrCtrl+Shift+C`
- Indent: `CmdOrCtrl+]`
- Outdent: `CmdOrCtrl+[`
- Clear formatting: `CmdOrCtrl+0`
