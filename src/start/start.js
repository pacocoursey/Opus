const ipc = require('electron-better-ipc');

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

const openPath = async (path) => {
  console.log(`Open path: ${path}`);

  const ret = await ipc.callMain('openProject', path);
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

document.querySelector('.open').addEventListener('click', () => {
  // TODO: open the open dialog
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
