# Plate Builder food data (USDA)

The Level 1 food list in `src/plate-builder/plateBuilderData.js` (`LEVEL_1_FOODS`) is generated from USDA FoodData Central. Each later level gets its own spec file and list.

Sources, in order of preference:
- **SR Legacy** (April 2018) for single foods.
- **FNDDS survey foods** (October 2024) for prepared foods SR Legacy lacks (most South Asian staples: roti, dal, idli, dosa, curries, chai...). These are USDA's standard recipes; check `input_food.csv` to see what's in one.
- **A branded label** only when both of those are implausible. Copy its per-100 g values from `https://api.nal.usda.gov/fdc/v1/food/<id>?api_key=DEMO_KEY` into `BRANDED` in the spec, with the reason. (Paneer is the one case so far.)

1. Download the CSV zips into a scratch folder outside the repo (don't commit them):
   - `https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip`
   - `https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_survey_food_csv_2024-10-31.zip`
2. Find entries and USDA portion weights (one dataset at a time): `SRD=<unzipped folder> python3 -I sr_search.py "^Egg, whole, cooked" "^Rice, brown.*cooked"` (each argument is a set of `&`-joined regexes).
3. Edit `level1_spec.py` (id, display name, tray category, serving label, grams, FDC id).
4. Run `SRD=<sr folder>:<fndds folder> python3 -I build_foods.py out.json`. It scales the per-100 g values to the serving and prints a table. It warns if any nutrient is missing (e.g. one firm-tofu entry has no sugar value; use one that does).
5. It also writes `out.js`: those rows in the app's format (the trailing comment is the USDA description). Paste them into `LEVEL_1_FOODS`.

Use foods as they're served (cooked, toasted, sliced), not raw ingredients, and no mixed dishes. Single prepared foods (oatmeal, hummus) are fine. Prefer USDA "without salt" entries for home-cooked foods.
