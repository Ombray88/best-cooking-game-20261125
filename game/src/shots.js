import { STEP, RECIPES } from './config.js';
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_OVER } from './render.js';
import { EVENT_OVER } from './world.js';

export function stageShot(name, world) {
  world.reset();

  if (name === 'start') {
    return { screen: SCREEN_TITLE, best: 150 };
  }

  if (name === 'end') {
    world.state.score = 640;
    world.state.dishesServed = 5;
    world.state.bestCombo = 4;
    return { screen: SCREEN_OVER, best: 850 };
  }

  // play (mid-rush cover scene)
  world.state.orders = [
    { id: 1, recipe: RECIPES[0], timer: 25.0, maxTimer: 30.0 },
    { id: 2, recipe: RECIPES[1], timer: 18.5, maxTimer: 30.0 },
    { id: 3, recipe: RECIPES[2], timer: 12.0, maxTimer: 30.0 },
  ];
  world.state.score = 420;
  world.state.combo = 3;
  world.state.dishesServed = 4;
  world.state.chef.x = 800;
  world.state.chef.y = 450;
  world.state.chef.holding = 'rice';
  world.state.stations.wok.cooking = true;
  world.state.stations.wok.item = 'noodles';
  world.state.stations.plating.items = ['skewer'];
  world.state.stations.plating.readyDish = null;

  return { screen: SCREEN_PLAY, best: 850 };
}
