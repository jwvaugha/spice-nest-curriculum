import csv, os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from level1_spec import SPEC, BRANDED
# SRD: one or more unzipped FoodData Central CSV folders, joined with ":"
# (SR Legacy and FNDDS survey foods; fdc ids don't overlap between them).
DIRS = os.environ['SRD'].split(':')
want = {str(s[5]) for s in SPEC if s[5] not in BRANDED}
# SR Legacy keys food_nutrient by nutrient id; FNDDS by the older nutrient
# number. Map both.
NUT = {'1008': 'calories', '1003': 'protein', '1005': 'carbs', '1004': 'fat', '1079': 'fiber', '1093': 'sodium', '2000': 'sugar', '1063': 'sugarNLEA',
       '208': 'calories', '203': 'protein', '205': 'carbs', '204': 'fat', '291': 'fiber', '307': 'sodium', '269': 'sugar'}
per = {}
desc = {}
dataset = {}
for D in DIRS:
    name = 'FNDDS' if 'survey' in D else 'SR Legacy'
    for r in csv.DictReader(open(f'{D}/food_nutrient.csv')):
        if r['fdc_id'] in want and r['nutrient_id'] in NUT:
            per.setdefault(r['fdc_id'], {})[NUT[r['nutrient_id']]] = float(r['amount'])
    for r in csv.DictReader(open(f'{D}/food.csv', encoding='utf-8')):
        if r['fdc_id'] in want:
            desc[r['fdc_id']] = r['description']
            dataset[r['fdc_id']] = name
for fid, b in BRANDED.items():
    per[str(fid)] = dict(b['per100'])
    desc[str(fid)] = b['description']
    dataset[str(fid)] = 'FDC Branded'
missing_ids = want - set(desc)
if missing_ids: sys.exit(f'FDC ids not found in {DIRS}: {sorted(missing_ids)}')
rows=[]
for fid_,name,cat,serv,g,fdc in SPEC:
    p=per[str(fdc)]; f=g/100
    if 'sugar' not in p and 'sugarNLEA' in p: p['sugar']=p['sugarNLEA']
    missing=[k for k in ['calories','protein','carbs','fat','fiber','sodium','sugar'] if k not in p]
    n={'calories':round(p['calories']*f),'protein':round(p['protein']*f,1),'carbs':round(p['carbs']*f,1),'fat':round(p['fat']*f,1),
       'fiber':round(p.get('fiber',0)*f,1),'sodium':round(p['sodium']*f),'sugar':round(p.get('sugar',0)*f,1)}
    rows.append((fid_,name,cat,serv,g,fdc,f'{dataset[str(fdc)]}: {desc[str(fdc)]}',n,missing))
for r in rows:
    if r[8]: print('MISSING',r[0],r[8],file=sys.stderr)
json.dump(rows,open(sys.argv[1],'w'),indent=0)
for r in rows: print(f"{r[0]:18}{r[7]['calories']:5} P{r[7]['protein']:5} C{r[7]['carbs']:5} F{r[7]['fat']:5} Fi{r[7]['fiber']:4} Na{r[7]['sodium']:5} S{r[7]['sugar']:5}")

# The rows in plateBuilderData.js format, ready to paste into the level's list.
def num(x): return str(int(x)) if float(x).is_integer() else str(x)
with open(sys.argv[1].rsplit('.', 1)[0] + '.js', 'w') as js:
    for fid_, name, cat, serv, g, fdc, d, n, _ in rows:
        nut = ', '.join(f"{k}: {num(n[k])}" for k in ['calories', 'protein', 'carbs', 'fat', 'fiber', 'sodium', 'sugar'])
        js.write(f"  {{ id: '{fid_}', name: '{name}', category: '{cat}', servingSize: '{serv}', grams: {num(g)}, fdcId: {fdc}, nutrition: {{ {nut} }} }}, // {d}\n")
