import csv, sys, re, json, os
D = os.environ['SRD']
foods = {r['fdc_id']: r['description'] for r in csv.DictReader(open(f'{D}/food.csv', encoding='utf-8'))}
def search(*terms):
    out=[]
    for fid, d in foods.items():
        if all(re.search(t, d, re.I) for t in terms): out.append((fid, d))
    return out
units = {r['id']: r['name'] for r in csv.DictReader(open(f'{D}/measure_unit.csv'))}
portions = {}
for r in csv.DictReader(open(f'{D}/food_portion.csv')):
    # SR Legacy: amount + modifier/unit. FNDDS: a free-text portion_description.
    label = r.get('portion_description') or f"{r['amount']} {r['modifier'] or units.get(r['measure_unit_id'],'')}"
    portions.setdefault(r['fdc_id'], []).append(f"{label.strip()} = {r['gram_weight']} g")
if __name__ == '__main__':
    for q in sys.argv[1:]:
        print('##', q)
        for fid, d in search(*q.split('&'))[:12]:
            print(' ', fid, '|', d, '|', '; '.join(portions.get(fid, [])[:5]))
