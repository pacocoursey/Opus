const { remote, ipcRenderer } = require('electron');
const settings = require('electron-settings');

const { dialog } = remote;
const button = document.querySelector('.button');
const selector = document.querySelector('.selector');
const save = document.querySelector('#save');
let choice;

button.addEventListener('click', () => {
  document.querySelector('.first').style.display = 'none';
  document.querySelector('.second').style.display = 'flex';
});

selector.addEventListener('click', () => {
  choice = dialog.showOpenDialog({
    buttonLabel: 'Use as Project Folder',
    properties: ['createDirectory', 'openDirectory'],
  });

  if (choice && choice !== '') {
    selector.innerHTML = choice;
    save.style.visibility = 'visible';
  }
});

save.addEventListener('click', () => {
  // Save the setting
  settings.set('project', choice[0]);

  // Send message to main process to render main window
  ipcRenderer.send('main');
});
