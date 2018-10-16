const ipc = require('electron-better-ipc');
const { ipcRenderer } = require('electron');
const settings = require('electron-settings');

const back = document.querySelector('.back');
const button = document.querySelector('.next');
const content = document.querySelector('main');
const sections = document.querySelector('.sections');
const images = document.querySelectorAll('.example');
let index = 0;

async function transition(increment = 1) {
  const newIndex = index + increment;

  if (newIndex >= content.children.length
      || newIndex >= sections.children.length
      || newIndex < 0) {
    await ipc.callMain('closeIntroWindow');
    return;
  }

  index += increment;

  // Change the button to show "Finish" instead of "Next"
  if (index === content.children.length - 1) {
    button.textContent = 'Finish';
  } else {
    button.textContent = 'Next';
  }

  if (index > 0) {
    back.classList.add('active');
  } else {
    back.classList.remove('active');
  }

  const activeContent = document.querySelector('.content.active');
  const activeSection = document.querySelector('.section.active');
  const nextContent = content.children[index];
  const nextSection = sections.children[index];

  if (increment > 0) {
    activeContent.classList.add('slide-left');
  } else {
    nextContent.classList.remove('slide-left');
  }

  activeContent.classList.remove('active');
  activeSection.classList.remove('active');
  nextContent.classList.add('active');
  nextSection.classList.add('active');
}

/**
 * Update the images based on the theme color.
 */

function updateImages(append) {
  images.forEach((img) => {
    const name = img.getAttribute('data-name');
    img.src = `./img/${name}_${append}.png`;
  });
}

/**
 * Listen for theme toggle message from main process.
 */

ipcRenderer.on('message', (e, d) => {
  const { method, module } = d;

  if (module === 'theme' && method === 'toggle') {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    settings.set('intro.dark', isDark);

    let append = 'light';

    if (isDark) {
      append = 'dark';
    }

    updateImages(append);
  }
});

/**
 * Setup event handlers and apply dark theme if necessary.
 */

function init() {
  if (settings.has('intro.dark')) {
    const isDark = settings.get('intro.dark');
    if (isDark) {
      document.body.classList.add('dark');
      updateImages('dark');
    }
  }

  button.addEventListener('click', () => {
    transition(1);
  });

  back.addEventListener('click', () => {
    transition(-1);
  });
}

init();
