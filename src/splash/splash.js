const path = require('path');
const ipc = require('electron-better-ipc');
const settings = require('electron-settings');

const aside = document.querySelector('aside');
const footer = document.querySelector('footer');

function listItem(p) {
  const itemDiv = document.createElement('div');
  const nameDiv = document.createElement('div');
  const pathDiv = document.createElement('div');

  itemDiv.classList.add('list-item');
  itemDiv.setAttribute('data-path', p);
  nameDiv.classList.add('name');
  nameDiv.innerText = path.basename(p);
  pathDiv.classList.add('path');
  pathDiv.innerText = path.dirname(p);

  itemDiv.appendChild(nameDiv);
  itemDiv.appendChild(pathDiv);

  return itemDiv;
}

if (settings.has('windows')) {
  const windows = Object.values(settings.get('windows'));

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

const removeActive = () => {
  document.querySelector('.active').classList.remove('active');
};

const get = (increment) => {
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
};

const openPath = async (p) => {
  console.log(`Open path: ${p}`);

  const ret = await ipc.callMain('openProject', p);
  console.log(ret);
};

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

footer.addEventListener('click', async () => {
  await ipc.callMain('openProject');
});

document.querySelector('.close').addEventListener('click', async () => {
  ipc.callMain('closeSplashWindow');
});

const listItems = document.querySelectorAll('.list-item');
listItems.forEach((item) => {
  item.addEventListener('click', () => {
    if (item.classList.contains('active')) {
      return;
    }

    removeActive();
    item.classList.add('active');
  });

  item.addEventListener('dblclick', () => {
    openPath(item.getAttribute('data-path'));
  });
});
