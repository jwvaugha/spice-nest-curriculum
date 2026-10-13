# Editable hand poses

One Blender file per hand-approach figure: `fist.blend`, `palm.blend`,
`cupped.blend`, `thumb.blend`. **If a file here exists, the figure uses its
pose** instead of the angles in `src/viz/handComparisons.js`.

## Editing a pose

1. Open the file in Blender (5.x).
2. Click the hand's armature, then switch to **Pose Mode** (Ctrl+Tab).
3. Select a joint's bone and rotate it:
   - **R, X** curls it: positive bends toward the palm, negative straightens.
   - **R, Z** spreads it sideways.
   - Bones are chained (wrist > metacarpal > knuckle > middle > end), so
     turning a knuckle carries the rest of that finger with it. The thumb's
     base bone is `thumb-metacarpal`.
4. **Numpad 0** looks through "Figure camera", which is the same face-on view
   the figure uses. The camera and "Figure light" are only there to preview;
   they don't affect the figure.
5. Save (Cmd+S), then from `nest-react-app/` run `npm run viz:hands`.

Only change the **pose**. Editing the mesh or its modifiers changes the vertex
count, and the pipeline will stop with an error.

## Resetting

- Delete a file to go back to the angles in `handComparisons.js`.
- `npm run viz:hands:blend` recreates any missing files from those angles.
- `node scripts/hand-viz/pose.mjs --write-blend --force` overwrites all four,
  **discarding hand edits**.
