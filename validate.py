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
        for f in ('title', 'summary', 'impact'):
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
# Boîte à veille (base de connaissances) : tableau affiché sous les thèmes
boite = d.get('boite')
if not isinstance(boite, list) or not boite:
    err.append('boite : liste requise (au moins une entrée)')
    boite = []
seen = set()
for i, b in enumerate(boite):
    w = f'boite[{i}]'
    if not re.fullmatch(r'\d{4}(-\d{2}(-\d{2})?)?', b.get('date', '')): err.append(f'{w} : date invalide')
    elif b['date'] > d.get('updated', ''): err.append(f'{w} : date dans le futur')
    if b.get('theme') not in d.get('themes', {}): err.append(f'{w} : theme doit être aiops, nis2 ou sdwan')
    for f in ('sujet', 'appris', 'interet', 'action'):
        val = b.get(f)
        if not (isinstance(val, dict) and val.get('fr', '').strip() and val.get('en', '').strip()): err.append(f'{w} : {f} doit avoir fr et en')
    if not b.get('source'): err.append(f'{w} : source manquante')
    if not str(b.get('url', '')).startswith('https://'): err.append(f'{w} : url https requise')
    if b.get('url') in seen: err.append(f'{w} : url en double')
    seen.add(b.get('url'))
    if re.search(r'<[a-z/]', json.dumps(b, ensure_ascii=False)): err.append(f'{w} : pas de HTML')
# Chaque nouvelle actualité (après le 2 novembre 2026) doit avoir son entrée dans la boîte
for key, t in d.get('themes', {}).items():
    for n in t.get('news', []):
        if n.get('date', '') > '2026-11-02' and n.get('url') not in seen:
            err.append(f'{key} : l\'actualité {n.get("url")} n\'a pas d\'entrée dans la boîte à veille')
# Pas de « \n » écrit en toutes lettres (les paragraphes se séparent par un vrai saut de ligne)
def _strings(o):
    if isinstance(o, str): yield o
    elif isinstance(o, dict):
        for x in o.values(): yield from _strings(x)
    elif isinstance(o, list):
        for x in o: yield from _strings(x)
if any('\\n' in s for s in _strings(d)):
    err.append('texte : « \\n » écrit en toutes lettres, utilise un vrai saut de ligne')
print('\n'.join(err) or 'veille.json valide')
sys.exit(1 if err else 0)
