// Placeholder food art from the Figma exploration components (Plate-Builder
// Game Workspace page): Game/Food Art (tray tiles), Game/Plate Portion
// (top-down portions on the plate) and Game/Plate Base. Colored shapes stand
// in for final art, which is still undecided. Swap these files, not the
// components, once a style is chosen.
import artProtein from '../assets/plate-builder/art-protein.svg';
import artGrain from '../assets/plate-builder/art-grain.svg';
import artVegetable from '../assets/plate-builder/art-vegetable.svg';
import artFruit from '../assets/plate-builder/art-fruit.svg';
import artDairy from '../assets/plate-builder/art-dairy.svg';
import artFat from '../assets/plate-builder/art-fat.svg';
import artSnack from '../assets/plate-builder/art-snack.svg';
import portionProtein from '../assets/plate-builder/portion-protein.svg';
import portionGrain from '../assets/plate-builder/portion-grain.svg';
import portionVegetable from '../assets/plate-builder/portion-vegetable.svg';
import portionFruit from '../assets/plate-builder/portion-fruit.svg';
import portionDairy from '../assets/plate-builder/portion-dairy.svg';
import portionFat from '../assets/plate-builder/portion-fat.svg';
import portionSnack from '../assets/plate-builder/portion-snack.svg';
import plateRim from '../assets/plate-builder/plate-rim.svg';
import plateWell from '../assets/plate-builder/plate-well.svg';
import statusMet from '../assets/plate-builder/status-met.svg';
import statusLow from '../assets/plate-builder/status-low.svg';
import statusHigh from '../assets/plate-builder/status-high.svg';

// `topping` and `treat` are Level 1's groups; they borrow the Fats and
// Snacks placeholders.
export const FOOD_ART = {
  protein: artProtein,
  topping: artFat,
  treat: artSnack,
  grain: artGrain,
  vegetable: artVegetable,
  fruit: artFruit,
  dairy: artDairy,
  fat: artFat,
  snack: artSnack,
};

export const PORTION_ART = {
  protein: portionProtein,
  topping: portionFat,
  treat: portionSnack,
  grain: portionGrain,
  vegetable: portionVegetable,
  fruit: portionFruit,
  dairy: portionDairy,
  fat: portionFat,
  snack: portionSnack,
};

export const PLATE_ART = { rim: plateRim, well: plateWell };

export const STATUS_ICON = { met: statusMet, low: statusLow, high: statusHigh };
