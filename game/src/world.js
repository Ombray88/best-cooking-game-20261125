import { CANVAS_WIDTH, CANVAS_HEIGHT, RECIPES, STATIONS, MAX_FAILURES } from './config.js';

export const EVENT_NONE = 0;
export const EVENT_SERVE = 1;
export const EVENT_FAIL = 2;
export const EVENT_OVER = 4;

export function createWorld(rng) {
  let state = {
    chef: { x: 640, y: 550, width: 50, height: 70, vx: 0, vy: 0, holding: null },
    orders: [],
    stations: {
      chop: { item: null, progress: 0, required: 1.5 },
      wok: { item: null, progress: 0, cookTime: 3.5, cooking: false, burned: false },
      grill: { item: null, progress: 0, cookTime: 4.0, cooking: false, burned: false },
      plating: { items: [], readyDish: null },
    },
    score: 0,
    dishesServed: 0,
    bestCombo: 0,
    combo: 0,
    failures: 0,
    orderTimer: 2.0,
    orderIdCounter: 1,
    timeElapsed: 0,
  };

  function reset() {
    state.chef.x = 640;
    state.chef.y = 550;
    state.chef.holding = null;
    state.orders = [
      { id: 1, recipe: RECIPES[0], timer: 28.0, maxTimer: 28.0 },
      { id: 2, recipe: RECIPES[1], timer: 32.0, maxTimer: 32.0 },
    ];
    state.stations.chop = { item: null, progress: 0, required: 1.5 };
    state.stations.wok = { item: null, progress: 0, cookTime: 3.5, cooking: false, burned: false };
    state.stations.grill = { item: null, progress: 0, cookTime: 4.0, cooking: false, burned: false };
    state.stations.plating = { items: [], readyDish: null };
    state.score = 0;
    state.dishesServed = 0;
    state.bestCombo = 0;
    state.combo = 0;
    state.failures = 0;
    state.orderTimer = 5.0;
    state.orderIdCounter = 3;
    state.timeElapsed = 0;
  }

  function spawnOrder() {
    if (state.orders.length >= 4) return;
    const recipe = rng.choice(RECIPES);
    const timer = Math.max(18, 35 - state.timeElapsed * 0.05);
    state.orders.push({
      id: state.orderIdCounter++,
      recipe,
      timer,
      maxTimer: timer,
    });
  }

  function step(dt, dir, isTitle) {
    if (isTitle) {
      if (state.orders.length === 0) spawnOrder();
      return EVENT_NONE;
    }

    state.timeElapsed += dt;
    state.orderTimer -= dt;
    if (state.orderTimer <= 0) {
      spawnOrder();
      state.orderTimer = Math.max(4, 12 - state.timeElapsed * 0.03);
    }

    // Move chef
    const speed = 320;
    if (dir.x !== 0 || dir.y !== 0) {
      const len = Math.hypot(dir.x, dir.y);
      state.chef.x += (dir.x / len) * speed * dt;
      state.chef.y += (dir.y / len) * speed * dt;
    }
    state.chef.x = Math.max(80, Math.min(CANVAS_WIDTH - 80, state.chef.x));
    state.chef.y = Math.max(250, Math.min(CANVAS_HEIGHT - 80, state.chef.y));

    // Update wok & grill cooking
    let events = EVENT_NONE;
    const wok = state.stations.wok;
    if (wok.cooking && wok.item) {
      wok.progress += dt;
      if (wok.progress >= wok.cookTime) {
        wok.cooking = false;
        wok.ready = true;
      }
    }

    const grill = state.stations.grill;
    if (grill.cooking && grill.item) {
      grill.progress += dt;
      if (grill.progress >= grill.cookTime) {
        grill.cooking = false;
        grill.ready = true;
      }
    }

    // Update orders timers
    for (let i = state.orders.length - 1; i >= 0; i--) {
      const ord = state.orders[i];
      ord.timer -= dt;
      if (ord.timer <= 0) {
        state.orders.splice(i, 1);
        state.failures++;
        state.combo = 0;
        events |= EVENT_FAIL;
        if (state.failures >= MAX_FAILURES) {
          events |= EVENT_OVER;
        }
      }
    }

    return events;
  }

  function interact(clickPos) {
    // Find nearest station to chef or click
    let target = null;
    let minDist = 120;

    const checkX = clickPos ? clickPos.x : state.chef.x;
    const checkY = clickPos ? clickPos.y : state.chef.y;

    for (const [key, st] of Object.entries(STATIONS)) {
      const dist = Math.hypot(st.x - checkX, st.y - checkY);
      if (dist < minDist) {
        minDist = dist;
        target = { key, st };
      }
    }

    if (!target) return;

    const { key, st } = target;

    // Handle interaction based on station type
    if (st.type === 'bin') {
      state.chef.holding = st.item;
    } else if (st.type === 'chop') {
      if (state.chef.holding && !state.stations.chop.item) {
        state.stations.chop.item = state.chef.holding;
        state.stations.chop.progress = state.stations.chop.required; // Instant chop for smooth flow, or prepped
        state.chef.holding = null;
      } else if (state.stations.chop.item && !state.chef.holding) {
        state.chef.holding = state.stations.chop.item;
        state.stations.chop.item = null;
      }
    } else if (st.type === 'wok') {
      const wok = state.stations.wok;
      if (!wok.item && state.chef.holding) {
        wok.item = state.chef.holding;
        wok.progress = 0;
        wok.cooking = true;
        wok.ready = false;
        state.chef.holding = null;
      } else if (wok.ready && !state.chef.holding) {
        state.chef.holding = wok.item + '_cooked';
        wok.item = null;
        wok.ready = false;
      }
    } else if (st.type === 'grill') {
      const grill = state.stations.grill;
      if (!grill.item && state.chef.holding) {
        grill.item = state.chef.holding;
        grill.progress = 0;
        grill.cooking = true;
        grill.ready = false;
        state.chef.holding = null;
      } else if (grill.ready && !state.chef.holding) {
        state.chef.holding = grill.item + '_cooked';
        grill.item = null;
        grill.ready = false;
      }
    } else if (st.type === 'plating') {
      const plating = state.stations.plating;
      if (state.chef.holding) {
        plating.items.push(state.chef.holding);
        state.chef.holding = null;
        // Check if matches any recipe
        for (const rec of RECIPES) {
          const needed = [rec.steps[0], rec.steps[1] + '_cooked'];
          if (plating.items.length >= 2) {
            // Check match
            const match = needed.every(n => plating.items.includes(n));
            if (match) {
              plating.readyDish = rec;
              plating.items = [];
            }
          }
        }
      } else if (plating.readyDish && !state.chef.holding) {
        state.chef.holding = plating.readyDish.id;
        plating.readyDish = null;
      }
    } else if (st.type === 'serving') {
      if (state.chef.holding) {
        const dishId = state.chef.holding;
        // Find matching active order
        const idx = state.orders.findIndex(o => o.recipe.id === dishId);
        if (idx !== -1) {
          const ord = state.orders[idx];
          state.orders.splice(idx, 1);
          state.score += ord.recipe.points + Math.floor(ord.timer * 5);
          state.dishesServed++;
          state.combo++;
          if (state.combo > state.bestCombo) state.bestCombo = state.combo;
          state.chef.holding = null;
          return EVENT_SERVE;
        }
      }
    }
    return EVENT_NONE;
  }

  return {
    state,
    reset,
    step,
    interact,
  };
}
