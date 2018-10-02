// const path = require('path');

const back = document.querySelector('.back');
const button = document.querySelector('.next');
const content = document.querySelector('main');
const sections = document.querySelector('.sections');
let index = 0;

function transition(increment = 1) {
  const newIndex = index + increment;

  if (newIndex >= content.children.length
      || newIndex >= sections.children.length
      || newIndex < 0) {
    console.log('Close this window and move on!');
    // await fs.ensureFile(path.join(home, 'opus'));
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

  activeContent.classList.remove('active');
  activeSection.classList.remove('active');
  nextContent.classList.add('active');
  nextSection.classList.add('active');
}

button.addEventListener('click', () => {
  transition(1);
});

back.addEventListener('click', () => {
  transition(-1);
});
