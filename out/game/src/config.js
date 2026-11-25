export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;

export const BEST_KEY = 'warung_rush_best_score_v1';
export const MAX_FAILURES = 3;

export const STEP = 1 / 60;

export const RECIPES = [
  {
    id: 'nasigoreng',
    name: 'Nasi Goreng',
    steps: ['rice', 'egg'],
    station: 'wok',
    prepTime: 1.5, // chopping if needed
    cookTime: 3.5,
    points: 100,
    color: '#e67e22',
  },
  {
    id: 'miegoreng',
    name: 'Mie Goreng',
    steps: ['noodles', 'chicken'],
    station: 'wok',
    prepTime: 1.5, // chop chicken
    cookTime: 3.0,
    points: 120,
    color: '#f39c12',
  },
  {
    id: 'sateayam',
    name: 'Sate Ayam',
    steps: ['skewer', 'peanutsauce'],
    station: 'grill',
    prepTime: 1.0,
    cookTime: 4.0,
    points: 150,
    color: '#d35400',
  },
];

export const INGREDIENTS = {
  rice: { name: 'Rice', color: '#f5f6fa', icon: '🍚' },
  noodles: { name: 'Noodles', color: '#f1c40f', icon: '🍜' },
  chicken: { name: 'Chicken', color: '#e84118', icon: '🍗' },
  egg: { name: 'Egg', color: '#fbc531', icon: '🥚' },
  skewer: { name: 'Skewer', color: '#c23616', icon: '🍢' },
  peanutsauce: { name: 'Peanut Sauce', color: '#e1b12c', icon: '🥜' },
};

export const STATIONS = {
  bin_rice: { x: 100, y: 150, type: 'bin', item: 'rice', label: 'Rice Bin' },
  bin_noodles: { x: 230, y: 150, type: 'bin', item: 'noodles', label: 'Noodle Bin' },
  bin_chicken: { x: 360, y: 150, type: 'bin', item: 'chicken', label: 'Chicken Bin' },
  bin_egg: { x: 490, y: 150, type: 'bin', item: 'egg', label: 'Egg Bin' },
  bin_skewer: { x: 620, y: 150, type: 'bin', item: 'skewer', label: 'Skewer Bin' },
  bin_peanutsauce: { x: 750, y: 150, type: 'bin', item: 'peanutsauce', label: 'Peanut Sauce' },

  chop_board: { x: 200, y: 400, type: 'chop', label: 'Chopping Board' },
  wok: { x: 500, y: 400, type: 'wok', label: 'Wok Station' },
  grill: { x: 800, y: 400, type: 'grill', label: 'Satay Grill' },
  plating: { x: 1100, y: 400, type: 'plating', label: 'Plating Counter' },
  serving: { x: 1100, y: 650, type: 'serving', label: 'Serving Window' },
};
