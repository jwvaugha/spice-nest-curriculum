# Image resources — how to replace a photo

Every image the site uses is a plain file referenced by a fixed, predictable path — there is no build step and no database. **To replace a photo: drop a new file in with the exact same filename as the one you're replacing (overwriting it), refresh the page in your browser, and it's done — you don't need to touch any code.**

If you want to add a photo that doesn't exist yet (an empty/placeholder slot), tell Claude which slot filename you used and where you put it, and it will wire up the `<img>` tag (or remove the placeholder box) in the matching HTML file — this is the one step that isn't fully automatic, since a brand-new `<img>` tag has to be added to the page.

## Folder layout

```
images/
  dashboard/                    module-1.jpg … module-6.jpg   (the 6 module thumbnails)
  module-1-chapter-5/           myth-1-carbs.jpg … myth-5-favorite-foods.jpg, hero.jpg
  module-2-chapter-2/           hero.jpg, item-<slug>.jpg (one per numbered list item)
```

Each chapter/page gets its own folder, named to match the HTML file it belongs to.

## Current status

### `dashboard/` — complete
All 6 module thumbnails are real photos. No action needed.

### `module-1-chapter-5/` — 5 of 6 photos in place
- `myth-1-carbs.jpg` through `myth-5-favorite-foods.jpg` — real photos, already wired.
- `hero.jpg` — **missing.** The page currently shows a dashed placeholder box in its place (a plain `<div>`, not an `<img>` tag yet). Drop a file named exactly `hero.jpg` into this folder, tell Claude it's there, and it'll swap the placeholder `<div>` for a real `<img src="images/module-1-chapter-5/hero.jpg">`.

### `module-2-chapter-2/` — 8 of 11 photos in place
- `hero.jpg`, `item-refined-carbohydrates.jpg`, `item-saturated-fat.jpg`, `item-sugary-drinks.jpg`, `item-fried-foods.jpg`, `item-processed-foods.jpg`, `item-lean-protein.jpg`, `item-healthy-fats.jpg` — real photos, already wired.
- **Missing:** `item-vegetables.jpg`, `item-fruits.jpg`, `item-whole-grains.jpg` — these three list items ("Vegetables", "Fruits", "Whole Grains" under "Foods to Focus On") currently show a dashed placeholder box with the exact filename they're waiting on. Drop in files with those exact names and tell Claude — same as above, the placeholder `<div>` gets swapped for a real `<img>` tag pointing at the file.

## Naming a brand-new slot (e.g. if a new list item gets added later)

Use `item-<short-slug-of-the-title>.jpg` for a numbered list item, or `hero.jpg` for the one hero photo at the top of a chapter. Any common web image format works (jpg, png, webp) — just keep the extension consistent with whatever you tell Claude to expect.
