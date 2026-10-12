#!/usr/bin/env python3
"""Vérifie veille.json avant publication. Usage : python3 validate.py"""
import json, re, sys, datetime
d = json.load(open('veille.json', encoding='utf-8'))
err = []
if d.get('version') != 1: err.append('version doit valoir 1')
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
print('\n'.join(err) or 'veille.json valide')
sys.exit(1 if err else 0)
