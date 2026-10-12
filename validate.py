#!/usr/bin/env python3
"""Vérifie veille.json avant publication. Usage : python3 validate.py"""
import json, re, sys, datetime
d = json.load(open('veille.json', encoding='utf-8'))
err = []
if d.get('version') not in (1, 2): err.append('version doit valoir 2')
if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', d.get('updated', '')): err.append('updated doit être AAAA-MM-JJ')
for key in ('aiops', 'nis2', 'sdwan'):
    t = d.get('themes', {}).get(key)
    if not t or not isinstance(t.get('news'), list) or len(t['news']) < 3:
        err.append(f'{key} : au moins 3 actualités requises'); continue
    urls = set()
    for i, n in enumerate(t['news']):
        w = f'{key}[{i}]'
        if not re.fullmatch(r'\d{4}(-\d{2}(-\d{2})?)?', n.get('date', '')): err.append(f'{w} : date invalide')
        elif n['date'] > d.get('updated', ''): err.append(f'{w} : date dans le futur')
        for f in ('title', 'text'):
            v = n.get(f)
            if not (isinstance(v, dict) and v.get('fr', '').strip() and v.get('en', '').strip()): err.append(f'{w} : {f} doit avoir fr et en')
        if not str(n.get('url', '')).startswith('https://'): err.append(f'{w} : url https requise')
        if n.get('url') in urls: err.append(f'{w} : url en double')
        urls.add(n.get('url'))
        if not n.get('source'): err.append(f'{w} : source manquante')
        if re.search(r'<[a-z/]', json.dumps(n, ensure_ascii=False)): err.append(f'{w} : pas de HTML')
    reps = t.get('reports')
    if not isinstance(reps, list) or not reps:
        err.append(f'{key} : au moins un compte rendu requis'); continue
    dates = set()
    for i, r in enumerate(reps):
        w = f'{key}.reports[{i}]'
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', r.get('date', '')): err.append(f'{w} : date AAAA-MM-JJ requise')
        elif r['date'] > d.get('updated', ''): err.append(f'{w} : date dans le futur')
        if r.get('date') in dates: err.append(f'{w} : deux comptes rendus à la même date')
        dates.add(r.get('date'))
        for f in ('title', 'summary', 'impact', 'opinion'):
            v = r.get(f)
            if not (isinstance(v, dict) and v.get('fr', '').strip() and v.get('en', '').strip()): err.append(f'{w} : {f} doit avoir fr et en')
        if len(r.get('summary', {}).get('fr', '')) < 300: err.append(f'{w} : synthèse trop courte (300 caractères minimum)')
        an = r.get('analysis')
        if not (isinstance(an, list) and 3 <= len(an) <= 5 and all(isinstance(a, dict) and a.get('fr') and a.get('en') for a in an)):
            err.append(f'{w} : analysis doit contenir 3 à 5 points fr/en')
        srcs = r.get('sources')
        if not (isinstance(srcs, list) and len(srcs) >= 2 and all(str(u).startswith('https://') for u in srcs)):
            err.append(f'{w} : au moins 2 sources https')
        if re.search(r'<[a-z/]', json.dumps(r, ensure_ascii=False)): err.append(f'{w} : pas de HTML')
print('\n'.join(err) or 'veille.json valide')
sys.exit(1 if err else 0)
