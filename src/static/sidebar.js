const handler = document.querySelector('.handler');
const wrapper = document.querySelector('.wrapper');
const aside = wrapper.querySelector('aside');
let isHandlerDragging = false;

document.addEventListener('mousedown', (e) => {
  if (e.target === handler) {
    isHandlerDragging = true;
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isHandlerDragging) { return; }

  const containerOffsetLeft = wrapper.offsetLeft;
  const pointerRelativeXpos = e.clientX - containerOffsetLeft;

  aside.style.width = `${pointerRelativeXpos - 2}px`;
});

document.addEventListener('mouseup', () => {
  isHandlerDragging = false;
});
