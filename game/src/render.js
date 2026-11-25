import { CANVAS_WIDTH, CANVAS_HEIGHT, STATIONS, INGREDIENTS } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_OVER = 'over';

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  function drawBackground() {
    // Warm Warung atmosphere
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, '#2c2c54');
    grad.addColorStop(1, '#1e1e2f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Floor tiles
    ctx.fillStyle = '#3d3d56';
    ctx.fillRect(0, 320, CANVAS_WIDTH, CANVAS_HEIGHT - 320);

    // Wooden counter bar
    ctx.fillStyle = '#8e44ad';
    ctx.fillRect(50, 350, CANVAS_WIDTH - 100, 20);
    ctx.fillStyle = '#b590ca';
    ctx.fillRect(50, 370, CANVAS_WIDTH - 100, 10);
  }

  function drawOrderBoard(orders) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.roundRect(50, 20, CANVAS_WIDTH - 100, 100, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('📋 PESANAN / ORDERS:', 70, 50);

    let startX = 320;
    for (let i = 0; i < orders.length; i++) {
      const ord = orders[i];
      const x = startX + i * 220;
      const y = 30;

      ctx.fillStyle = ord.recipe.color;
      ctx.roundRect(x, y, 200, 80, 8);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(ord.recipe.name, x + 12, y + 25);

      // Timer bar
      const pct = Math.max(0, ord.timer / ord.maxTimer);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(x + 12, y + 42, 176, 12);
      ctx.fillStyle = pct > 0.3 ? '#2ecc71' : '#e74c3c';
      ctx.fillRect(x + 12, y + 42, 176 * pct, 12);

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${Math.ceil(ord.timer)}s`, x + 12, y + 70);
    }
  }

  function drawStations(stations) {
    for (const [key, st] of Object.entries(STATIONS)) {
      ctx.save();
      ctx.translate(st.x, st.y);

      if (st.type === 'bin') {
        const ing = INGREDIENTS[st.item];
        ctx.fillStyle = '#d35400';
        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ing ? ing.icon : '📦', 0, 0);

        ctx.fillStyle = '#ffffff';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(st.label, 0, 50);
      } else if (st.type === 'chop') {
        ctx.fillStyle = '#d2b48c';
        ctx.fillRect(-40, -25, 80, 50);
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 3;
        ctx.strokeRect(-40, -25, 80, 50);

        if (stations.chop.item) {
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(INGREDIENTS[stations.chop.item]?.icon || '🔪', 0, 0);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Chopping Board', 0, 45);
      } else if (st.type === 'wok' || st.type === 'grill') {
        const stData = stations[st.type];
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.ellipse(0, 0, 45, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = stData.cooking ? '#e74c3c' : '#7f8c8d';
        ctx.lineWidth = 4;
        ctx.stroke();

        if (stData.cooking) {
          // Flame
          ctx.fillStyle = '#e67e22';
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🔥', 0, -35);
        } else if (stData.ready) {
          ctx.fillStyle = '#2ecc71';
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('✨ READY', 0, -35);
        }

        if (stData.item) {
          ctx.font = '22px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🍳', 0, 0);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(st.label, 0, 50);
      } else if (st.type === 'plating') {
        ctx.fillStyle = '#ecf0f1';
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#bdc3c7';
        ctx.lineWidth = 3;
        ctx.stroke();

        const plating = stations.plating;
        if (plating.readyDish) {
          ctx.font = '26px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🍽️', 0, 0);
        } else if (plating.items.length > 0) {
          ctx.font = '18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`+${plating.items.length}`, 0, 0);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Plating', 0, 55);
      } else if (st.type === 'serving') {
        ctx.fillStyle = '#27ae60';
        ctx.roundRect(-50, -30, 100, 60, 10);
        ctx.fill();
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📥 SERVE', 0, 0);

        ctx.font = '13px sans-serif';
        ctx.fillText(st.label, 0, 45);
      }

      ctx.restore();
    }
  }

  function drawChef(chef) {
    ctx.save();
    ctx.translate(chef.x, chef.y);

    // Chef body
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fill();

    // Chef hat
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-15, -40, 30, 20);

    // Holding item
    if (chef.holding) {
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.arc(30, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(INGREDIENTS[chef.holding]?.icon || '🍲', 30, 0);
    }

    ctx.restore();
  }

  function drawHUD(state, best) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, CANVAS_HEIGHT - 60, CANVAS_WIDTH, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`⭐ SCORE: ${state.score}`, 40, CANVAS_HEIGHT - 25);
    ctx.fillText(`🔥 COMBO: ${state.combo}`, 260, CANVAS_HEIGHT - 25);
    ctx.fillText(`🍲 SERVED: ${state.dishesServed}`, 460, CANVAS_HEIGHT - 25);
    ctx.fillText(`❌ MISTAKES: ${state.failures}/3`, 680, CANVAS_HEIGHT - 25);
    ctx.fillText(`🏆 BEST: ${best}`, 920, CANVAS_HEIGHT - 25);
  }

  function drawTitleScreen(best) {
    drawBackground();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#f39c12';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🍜 WARUNG RUSH 🍢', CANVAS_WIDTH / 2, 220);

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px sans-serif';
    ctx.fillText('Indonesian Street-Kitchen Cooking Simulator', CANVAS_WIDTH / 2, 290);

    ctx.fillStyle = '#e67e22';
    ctx.font = '20px sans-serif';
    ctx.fillText('Master Nasi Goreng, Mie Goreng, and Sate Ayam under time pressure!', CANVAS_WIDTH / 2, 350);

    ctx.fillStyle = '#bdc3c7';
    ctx.font = '18px sans-serif';
    ctx.fillText('Controls: WASD / Arrows to Move • Space / E / Click to Interact • R to Restart', CANVAS_WIDTH / 2, 480);

    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('Press SPACE or CLICK to Start Cooking!', CANVAS_WIDTH / 2, 580);

    if (best > 0) {
      ctx.fillStyle = '#f1c40f';
      ctx.font = '22px sans-serif';
      ctx.fillText(`Best Score: ${best}`, CANVAS_WIDTH / 2, 650);
    }
  }

  function drawGameOverScreen(state, best) {
    drawBackground();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WARUNG CLOSED!', CANVAS_WIDTH / 2, 200);

    ctx.fillStyle = '#ffffff';
    ctx.font = '28px sans-serif';
    ctx.fillText(`Final Score: ${state.score}`, CANVAS_WIDTH / 2, 290);
    ctx.fillText(`Dishes Served: ${state.dishesServed}`, CANVAS_WIDTH / 2, 350);
    ctx.fillText(`Best Combo: ${state.bestCombo}`, CANVAS_WIDTH / 2, 410);
    ctx.fillText(`Best Score: ${best}`, CANVAS_WIDTH / 2, 470);

    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('Press R or Click to Restart', CANVAS_WIDTH / 2, 590);
  }

  function drawPausedScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

    ctx.font = '20px sans-serif';
    ctx.fillText('Press P or ESC to Resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
  }

  return {
    draw(state, screen, best) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (screen === SCREEN_TITLE) {
        drawTitleScreen(best);
        return;
      }

      drawBackground();
      drawOrderBoard(state.orders);
      drawStations(state.stations);
      drawChef(state.chef);
      drawHUD(state, best);

      if (screen === SCREEN_PAUSED) {
        drawPausedScreen();
      } else if (screen === SCREEN_OVER) {
        drawGameOverScreen(state, best);
      }
    },
  };
}
