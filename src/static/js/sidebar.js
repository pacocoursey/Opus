const handler = document.querySelector('.handler');
const wrapper = document.querySelector('.wrapper');
const aside = wrapper.querySelector('aside');
let isHandlerDragging = false;

handler.addEventListener('mousedown', () => {
  isHandlerDragging = true;
});

document.addEventListener('mousemove', (e) => {
  if (!isHandlerDragging) { return; }

  aside.style.flexBasis = `${e.clientX}px`;
});

document.addEventListener('mouseup', () => {
  isHandlerDragging = false;
});
