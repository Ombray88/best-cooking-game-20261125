# Warung Rush

[![make.fun](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/c/best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/Ombray88/best-cooking-game-20261125/rank.svg)](https://make.fun/c/best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/Ombray88/best-cooking-game-20261125/reward.svg)](https://make.fun/c/best-cooking-game-20261125-0137)

Warung Rush is an original, fast-paced Indonesian street-kitchen cooking game where you prepare traditional dishes, manage time, and keep hungry customers happy before orders expire.

## Run it

Serve the game locally:
```bash
node serve.ts
```
Then open `http://localhost:8080` in your browser.

Run the hand-in packaging script:
```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How to Play

### Controls
- **Move:** WASD or Arrow Keys
- **Interact / Start:** Spacebar or Left Mouse Click (interact with ingredient bins, cooking stations, plating counter, and serving window)

### Recipes & Steps
1. **Nasi Goreng** (`Wok Station`): Rice + Egg (cooked) — 100 points
2. **Mie Goreng** (`Wok Station`): Noodles + Chicken (cooked) — 120 points
3. **Sate Ayam** (`Satay Grill`): Skewer + Peanut Sauce (cooked) — 150 points

### Stations
- **Ingredient Bins:** Gather base ingredients (Rice, Noodles, Chicken, Egg, Skewer, Peanut Sauce).
- **Wok / Grill Stations:** Cook ingredients before assembling.
- **Plating Counter:** Combine ingredients to form completed dishes.
- **Serving Window:** Deliver ready dishes to matching active customer orders.

### Scoring & Game Over
- Earn points for each served dish plus time bonuses for fast service.
- Maintain your combo streak for high scores.
- The game ends if 3 orders expire and fail (`MAX_FAILURES = 3`).

---
Referral code: `9w5z28cm`
