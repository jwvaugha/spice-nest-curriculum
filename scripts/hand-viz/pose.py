# Blender (headless) half of the hand pipeline -- run via pose.mjs, not directly.
# Imports the rigged WebXR right hand, poses it per config, applies the rig and
# one level of subdivision, and writes the posed meshes as JSON (mm, scene
# axes: x right, y away from the viewer, z up; the hand lies palm-up with its
# fingers pointing +y and thumb +x).
#
# The glTF's 25 joints import as UNPARENTED bones pointing in arbitrary
# directions. rig_for_editing() fixes that so the saved .blend files can be
# posed by hand: each bone points along its finger segment, is parented down
# the chain (rotate a knuckle and the rest of the finger follows), and is rolled
# so its local X axis is the joint's hinge (rotate about X to curl it).
# Heads don't move, so the skinning is unchanged.
#
# Poses come from the angles in handComparisons.js, unless a hand-edited
# scripts/hand-viz/poses/<id>.blend exists -- then that file's pose is used.
import bpy, json, sys, math
from mathutils import Matrix, Vector

cfg = json.load(open(sys.argv[sys.argv.index('--') + 1]))
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=cfg['model'])
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
mesh = next(o for o in bpy.data.objects if o.type == 'MESH' and o.vertex_groups)
B = arm.data.bones
head = lambda n: B[n].head_local.copy()
HEADS = {b.name: b.head_local.copy() for b in B}

# Model axes: fingers point -z, thumb side +y, palm faces -x.
PALM_N = Vector((-1, 0, 0))
FINGERS = ['index-finger', 'middle-finger', 'ring-finger', 'pinky-finger']
JOINTS = ['phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal']

def rot(p, axis, deg):
    return Matrix.Translation(p) @ Matrix.Rotation(math.radians(deg), 4, axis.normalized()) @ Matrix.Translation(-p)

CHAINS = {f: ['metacarpal'] + JOINTS + ['tip'] for f in FINGERS}
CHAINS['thumb'] = ['metacarpal', 'phalanx-proximal', 'phalanx-distal', 'tip']

def rig_for_editing():
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode='EDIT')
    E = arm.data.edit_bones
    wrist = E['wrist']
    wrist.tail = HEADS['wrist'] + (HEADS['middle-finger-metacarpal'] - HEADS['wrist']).normalized() * 0.02
    for f, segs in CHAINS.items():
        names = [f'{f}-{s}' for s in segs]
        for k, n in enumerate(names):
            eb = E[n]
            eb.use_connect = False
            eb.parent = E[names[k - 1]] if k else wrist
            d = (HEADS[names[k + 1]] - HEADS[n]) if k + 1 < len(names) else (HEADS[n] - HEADS[names[k - 1]]).normalized() * 0.008
            eb.tail = HEADS[n] + d
            hinge = d.normalized().cross(PALM_N)
            eb.align_roll(hinge.cross(d.normalized()))  # local X = hinge
    bpy.ops.object.mode_set(mode='OBJECT')

def apply_deltas(delta):
    # Parents first, refreshing between, since a child's armature-space matrix
    # is converted against its parent's current pose.
    for pb in sorted(arm.pose.bones, key=lambda b: len(b.parent_recursive)):
        pb.matrix = delta[pb.name] @ B[pb.name].matrix_local
        bpy.context.view_layer.update()

def pose(p):
    delta = {'wrist': Matrix.Identity(4)}
    for fi, f in enumerate(FINGERS):
        ang = p['fingers'].get(f, p['fingers'].get('all'))
        spread = p.get('spread', [0, 0, 0, 0])[fi]
        M = Matrix.Identity(4)
        delta[f'{f}-metacarpal'] = M
        for k, seg in enumerate(JOINTS):
            j = head(f'{f}-{seg}')
            # Each finger curls in its own plane: the hinge axis is across that
            # segment (its rest direction x the palm normal), not one shared
            # axis -- the fingers fan out, so a shared axis twists the outer
            # fingers sideways as they curl.
            nxt = head(f'{f}-{JOINTS[k + 1]}') if k < 2 else head(f'{f}-tip')
            hinge = (nxt - j).normalized().cross(PALM_N)
            if k == 0 and spread: M = M @ rot(j, PALM_N, spread)
            M = M @ rot(j, hinge, ang[k])
            delta[f'{f}-{seg}'] = M
        delta[f'{f}-tip'] = M
    t = p['thumb']
    cmc, mcp, ip, tip = (head(f'thumb-{s}') for s in ('metacarpal', 'phalanx-proximal', 'phalanx-distal', 'tip'))
    d = (tip - cmc).normalized()
    flex = d.cross(PALM_N).normalized()
    M = rot(cmc, PALM_N, t.get('abduct', 0)) @ rot(cmc, flex, t.get('cmc', 0)) @ rot(cmc, d, t.get('twist', 0))
    delta['thumb-metacarpal'] = M
    M = M @ rot(mcp, flex, t.get('mcp', 0)); delta['thumb-phalanx-proximal'] = M
    M = M @ rot(ip, flex, t.get('ip', 0)); delta['thumb-phalanx-distal'] = M; delta['thumb-tip'] = M
    apply_deltas(delta)

rig_for_editing()
# Model -> scene axes, metres -> mm.
TO_SCENE = Matrix(((0, 1, 0, 0), (0, 0, -1, 0), (-1, 0, 0, 0), (0, 0, 0, 1)))

def add_view():
    # Camera and light matching the figures, so Numpad 0 in Blender shows the
    # hand as render.mjs draws it (face-on, 85 deg) and the shading reads the same.
    inv = TO_SCENE.inverted()
    t = math.radians(85)
    d = Vector((0, math.cos(t), -math.sin(t)))   # scene view direction
    up = Vector((0, math.sin(t), math.cos(t)))   # scene image-up
    zc = -d; xc = up.cross(zc)
    R = Matrix((xc, up, zc)).transposed()        # columns = camera axes (scene)
    target = Vector((0, 0.02, 0))
    cam = bpy.data.objects.new('Figure camera', bpy.data.cameras.new('Figure camera'))
    cam.data.type = 'ORTHO'; cam.data.ortho_scale = 0.3
    cam.matrix_world = Matrix.Translation(inv @ (target - d * 0.5)) @ (inv.to_3x3() @ R).to_4x4()
    bpy.context.scene.collection.objects.link(cam)
    bpy.context.scene.camera = cam
    r = bpy.context.scene.render; r.resolution_x, r.resolution_y = 900, 1100
    sun = bpy.data.objects.new('Figure light', bpy.data.lights.new('Figure light', 'SUN'))
    sun.rotation_euler = (inv.to_3x3() @ Vector((-0.45, 0.55, 0.7)).normalized()).to_track_quat('Z', 'Y').to_euler()
    bpy.context.scene.collection.objects.link(sun)
# Dual-quaternion ("preserve volume") skinning: with the default linear blend,
# big flexions collapse the joints and balloon the skin around the thumb and
# pinky into folds that render as odd overlapping shapes.
for m in mesh.modifiers:
    if m.type == 'ARMATURE': m.use_deform_preserve_volume = cfg.get('preserveVolume', True)
sub = mesh.modifiers.new('Sub', 'SUBSURF')  # appended after the glTF Armature modifier
sub.levels = sub.render_levels = cfg.get('subdiv', 1)
gi = {g.index: g.name for g in mesh.vertex_groups}
out = {'poses': {}}

# ---- rest-pose surface regions (smooth per-vertex scores; > 0 = inside) ----
# Computed once on the rest-pose subdivided mesh, so they ride along with any
# pose. The renderer interpolates them per pixel and thresholds at 0, giving
# smooth outlines instead of the stair-stepped bone-group boundaries.
arm.data.pose_position = 'REST'
bpy.context.view_layer.update()
ev = mesh.evaluated_get(bpy.context.evaluated_depsgraph_get())
me = ev.to_mesh()
RV = [mesh.matrix_world @ v.co for v in me.vertices]
RN = [(mesh.matrix_world.to_3x3() @ v.normal).normalized() for v in me.vertices]
dom = [gi[max(v.groups, key=lambda g: g.weight).group] if len(v.groups) else 'wrist' for v in me.vertices]
ev.to_mesh_clear()
arm.data.pose_position = 'POSE'

# Palm: between the wrist crease and the base of the fingers (the palmar
# digital crease, ~0.3 of the way along each proximal phalanx), thumb excluded.
P = cfg['palm']
knuckles = sorted((head(f'{f}-phalanx-proximal').y, head(f'{f}-phalanx-proximal').z - P['fingerBase'] * (head(f'{f}-phalanx-proximal') - head(f'{f}-phalanx-intermediate')).length) for f in FINGERS)
def finger_base(y):
    if y <= knuckles[0][0]: return knuckles[0][1]
    if y >= knuckles[-1][0]: return knuckles[-1][1]
    for (y0, z0), (y1, z1) in zip(knuckles, knuckles[1:]):
        if y0 <= y <= y1: return z0 + (z1 - z0) * (y - y0) / (y1 - y0)
wrist_z = head('wrist').z - P['wristCrease']
# Thumb: everything on the thumb beyond a plane through its base knuckle (MCP),
# perpendicular to the thumb -- a clean cut instead of bone-group steps.
t_mcp = head('thumb-phalanx-proximal')
t_ax = (head('thumb-tip') - t_mcp).normalized()
thumb = [round((v - t_mcp).dot(t_ax) * 1000, 2) if g.startswith('thumb-') else -5.0 for v, g in zip(RV, dom)]
palm = []
for v, g, th in zip(RV, dom, thumb):
    s = min(wrist_z - v.z, v.z - finger_base(v.y)) * 1000  # mm inside
    if g.startswith('thumb-'): s = min(s, -th)
    palm.append(round(s, 2))

# Nails: on the back of each distal phalanx, from ~1/3 along it to the tip.
def nail_scores(f, dorsal):
    a0, a1 = head(f'{f}-phalanx-distal'), head(f'{f}-tip')
    ax = (a1 - a0); L = ax.length; ax.normalize()
    dorsal = (dorsal - ax * dorsal.dot(ax)).normalized()
    lat = ax.cross(dorsal)
    mine = [i for i, g in enumerate(dom) if g in (f'{f}-phalanx-distal', f'{f}-tip')]
    hw = max(abs((RV[i] - a0).dot(lat)) for i in mine)
    sc = {}
    for i in mine:
        d = RV[i] - a0
        u, w = d.dot(ax) / L, d.dot(lat) / hw
        facing = RN[i].dot(dorsal)
        sc[i] = round(min((u - 0.3) * 4, 1 - (w / 0.72) ** 2, (facing - 0.35) * 3), 3)
    return sc
nail = [-1.0] * len(RV)
for f in FINGERS:
    for i, v in nail_scores(f, -PALM_N).items(): nail[i] = v
# Thumb: its nail faces away from the palm side of the thumb (the pad side
# faces the index finger in this rest pose).
td = (head('thumb-tip') - head('thumb-phalanx-distal')).normalized()
tflex = td.cross(PALM_N).normalized()
for i, v in nail_scores('thumb', tflex * cfg.get('thumbNailSide', 1)).items(): nail[i] = v
out['palm'] = palm
out['thumb'] = thumb
out['nail'] = nail
def posed_verts():
    ev = mesh.evaluated_get(bpy.context.evaluated_depsgraph_get())
    me = ev.to_mesh()
    W = TO_SCENE @ mesh.matrix_world
    v = [round(c * 1000, 2) for x in me.vertices for c in (W @ x.co)]
    ev.to_mesh_clear()
    return v

add_view()
written = []
for name, p in cfg['poses'].items():
    pose(p)
    bf = cfg.get('blendFiles', {}).get(name)
    if cfg.get('writeBlend') and bf and (cfg.get('force') or not __import__('os').path.exists(bf)):
        bpy.context.scene.name = f'Hand pose: {name}'
        bpy.ops.wm.save_as_mainfile(filepath=bf, copy=True, compress=True)
        written.append(name)
    ev = mesh.evaluated_get(bpy.context.evaluated_depsgraph_get())
    me = ev.to_mesh()
    W = TO_SCENE @ mesh.matrix_world
    out['poses'][name] = [round(c * 1000, 2) for v in me.vertices for c in (W @ v.co)]
    if 'tris' not in out:  # topology is identical for every pose
        me.calc_loop_triangles()
        out['tris'] = [i for t in me.loop_triangles for i in t.vertices]
        out['groups'] = sorted(set(gi.values()))
        gidx = {g: i for i, g in enumerate(out['groups'])}
        out['group'] = [gidx[gi[max(v.groups, key=lambda g: g.weight).group]] if len(v.groups) else gidx['wrist'] for v in me.vertices]
    ev.to_mesh_clear()
# Hand-edited .blend files override the angles.
used = []
if not cfg.get('writeBlend'):
    import os
    for name, bf in cfg.get('blendFiles', {}).items():
        if name not in out['poses'] or not os.path.exists(bf): continue
        bpy.ops.wm.open_mainfile(filepath=bf)
        arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
        mesh = next(o for o in bpy.data.objects if o.type == 'MESH' and o.vertex_groups)
        arm.data.pose_position = 'POSE'
        v = posed_verts()
        if len(v) != len(out['poses'][name]):
            raise SystemExit(f'{bf}: mesh has {len(v) // 3} vertices, expected {len(out["poses"][name]) // 3} -- only change the pose, not the mesh or its modifiers')
        out['poses'][name] = v
        used.append(name)
print('blend', json.dumps({'written': written, 'used': used}))
json.dump(out, open(cfg['out'], 'w'), separators=(',', ':'))
print('wrote', cfg['out'], len(out['group']), 'verts', len(out['tris']) // 3, 'tris x', len(out['poses']), 'poses')
