const path = require('path');
const ipc = require('electron-better-ipc');
const settings = require('electron-settings');
const { shell, remote, ipcRenderer } = require('electron');

let p;
let menu;
const { Menu } = remote;
const aside = document.querySelector('aside');
const footer = document.querySelector('footer');
const spinner = document.querySelector('.spinner');

/**
 * Create a new list-item div from the given path and return it.
 */

function listItem(dataPath) {
  const itemDiv = document.createElement('div');
  const nameDiv = document.createElement('div');
  const pathDiv = document.createElement('div');

  itemDiv.classList.add('list-item');
  itemDiv.setAttribute('data-path', dataPath);
  nameDiv.classList.add('name');
  nameDiv.innerText = path.basename(dataPath);
  pathDiv.classList.add('path');
  pathDiv.innerText = path.dirname(dataPath);

  itemDiv.appendChild(nameDiv);
  itemDiv.appendChild(pathDiv);

  return itemDiv;
}

/**
 * Custom comparison function to sort windows by time last opened.
 */

function compare(a, b) {
  if (a.opened > b.opened) {
    return -1;
  }

  if (a.opened < b.opened) {
    return 1;
  }

  return 0;
}

/**
 * Remove active class from whatever is currently active.
 */

function removeActive() {
  document.querySelector('.active').classList.remove('active');
}

/**
 * Adds active class to the appropriate div.
 */

function get(increment) {
  const currentlyActive = document.querySelector('.active');
  const list = document.querySelector('.list');
  let i = 0;

  for (i = 0; i < list.children.length; i += 1) {
    if (list.children[i] === currentlyActive) {
      break;
    }
  }

  if (!list.children[i + increment]) {
    return currentlyActive;
  }

  return list.children[i + increment];
}

/**
 * Calls main process to open the selected project.
 */

async function openPath(dataPath) {
  spinner.classList.add('active');
  await ipc.callMain('openProject', dataPath);
}

/**
 * Creates and appends a new list-item div for each window
 * stored in the settings.
 */

function populateSidebar() {
  // Reset the content.
  aside.innerHTML = '';
  if (settings.has('windows')) {
    const windows = Object.values(settings.get('windows'));
    console.log(windows);
    windows.sort(compare);

    if (windows.length === 0) {
      aside.innerHTML = '<div class="no-recent">No Recent Folders</div>';
    } else {
      const list = document.createElement('div');
      list.classList.add('list');

      windows.forEach((win) => {
        const item = listItem(win.path);
        list.appendChild(item);
      });

      list.children[0].classList.add('active');

      aside.appendChild(list);
    }
  } else {
    aside.innerHTML = '<div class="no-recent">No Recent Folders</div>';
  }
}

/**
 * Setup all the document listeners.
 */

function initListeners() {
  // Listen for message to toggle theme
  ipcRenderer.on('message', (e, d) => {
    const { method, module } = d;

    if (module === 'theme' && method === 'toggle') {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      settings.set('intro.dark', isDark);
    }
  });

  // Listen for message to show spinner
  ipc.answerMain('showSpinner', async () => {
    spinner.classList.add('active');
  });

  // Send message to main process to prompt for a folder.
  footer.addEventListener('click', async () => {
    spinner.classList.add('active');
    const res = await ipc.callMain('openProject');
    if (!res) spinner.classList.remove('active');
  });

  // Open GitHub page when each link is clicked.
  document.querySelectorAll('.link').forEach((link) => {
    link.addEventListener('click', () => {
      shell.openExternal('https://github.com/pacocoursey/Opus/');
    });
  });

  // Add active class to the relevant list-item div.
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 38) {
      const el = get(-1);
      removeActive();
      el.classList.add('active');
    } else if (e.keyCode === 40) {
      const el = get(1);
      removeActive();
      el.classList.add('active');
    } else if (e.keyCode === 13) {
      const active = document.querySelector('.active');
      openPath(active.getAttribute('data-path'));
    }
  });

  // Add active class to clicked item
  window.addEventListener('click', (e) => {
    const element = e.target.closest('.list-item');

    if (element) {
      if (!element.classList.contains('active')) {
        removeActive();
        element.classList.add('active');
      }
    }
  });

  // Open the window for double-clicked items
  window.addEventListener('dblclick', (e) => {
    const element = e.target.closest('.list-item');

    if (element) {
      openPath(element.getAttribute('data-path'));
    }
  });

  // Show a context menu when a list-item div is clicked.
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    const element = e.target.closest('.list-item');

    if (element) {
      if (!element.classList.contains('active')) {
        removeActive();
        element.classList.add('active');
      }

      p = element.getAttribute('data-path');
      menu.popup(remote.getCurrentWindow());
    }
  });
}

/**
 * Remove a project with path `p` from the settings object.
 */

function removeProject(dataPath) {
  if (settings.has(`windows.${dataPath}`)) {
    settings.delete(`windows.${dataPath}`);
    populateSidebar();
  }
}

/**
 * Apply dark theme if necessary.
 */

function init() {
  if (settings.has('intro.dark')) {
    const isDark = settings.get('intro.dark');
    if (isDark) {
      document.body.classList.add('dark');
    }
  }
}

menu = Menu.buildFromTemplate([
  {
    label: 'Remove',
    click: () => { removeProject(p); },
  },
]);


init();
populateSidebar();
initListeners();
