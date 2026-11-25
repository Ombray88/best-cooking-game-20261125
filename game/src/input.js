export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_INTERACT = 4;
export const ACTION_RESTART = 8;

export function createInput(canvas) {
  const keys = new Set();
  let actions = 0;
  let clickPos = null;

  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyR', 'KeyP'].includes(e.code)) {
      e.preventDefault();
    }
    keys.add(e.code);

    if (e.code === 'Space' || e.code === 'KeyE') actions |= ACTION_INTERACT | ACTION_CONFIRM;
    if (e.code === 'KeyP' || e.code === 'Escape') actions |= ACTION_PAUSE;
    if (e.code === 'KeyR') actions |= ACTION_RESTART;
  });

  window.addEventListener('keyup', (e) => {
    keys.delete(e.code);
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    clickPos = { x, y };
    actions |= ACTION_INTERACT | ACTION_CONFIRM;
  });

  return {
    direction() {
      let x = 0;
      let y = 0;
      if (keys.has('ArrowLeft') || keys.has('KeyA')) x -= 1;
      if (keys.has('ArrowRight') || keys.has('KeyD')) x += 1;
      if (keys.has('ArrowUp') || keys.has('KeyW')) y -= 1;
      if (keys.has('ArrowDown') || keys.has('KeyS')) y += 1;
      return { x, y };
    },
    takeActions() {
      const current = actions;
      actions = 0;
      return current;
    },
    takeClick() {
      const pos = clickPos;
      clickPos = null;
      return pos;
    },
  };
}
