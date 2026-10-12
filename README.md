# Veille informatique — données du portfolio

Ce dépôt contient `veille.json`, le fichier lu par le bloc « Veille informatique » du portfolio de Titouan Dumange (site Odoo).
Il est mis à jour automatiquement chaque lundi : trois actualités récentes et sourcées par thème (AIOps, NIS 2, SD-WAN), en français et en anglais.

Le bloc lit ce fichier à l'adresse :
`https://raw.githubusercontent.com/titouandmg-design/portfolio-veille/main/veille.json`

## Format

```json
{
  "version": 1,
  "updated": "AAAA-MM-JJ",
  "themes": {
    "aiops": { "name": "AIOps",  "news": [ … ] },
    "nis2":  { "name": "NIS 2",  "news": [ … ] },
    "sdwan": { "name": "SD-WAN", "news": [ … ] }
  }
}
```

Chaque actualité :

| Champ    | Contenu |
|----------|---------|
| `date`   | `AAAA-MM-JJ` (ou `AAAA-MM`, `AAAA`) — sert au tri, les plus récentes en premier |
| `label`  | facultatif, `{ "fr", "en" }`, remplace la date affichée (ex. « Tendance 2026 ») |
| `title`  | `{ "fr", "en" }` |
| `text`   | `{ "fr", "en" }`, deux ou trois phrases factuelles |
| `source` | nom du média |
| `url`    | lien `https://` vers l'article |

Le site affiche les 3 actualités les plus récentes de chaque thème. Les plus anciennes restent dans le fichier comme archive.
Si le fichier est absent ou invalide, le site garde les actualités intégrées au bloc.
