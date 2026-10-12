# Veille informatique — données du portfolio

Ce dépôt contient `veille.json`, le fichier lu par le bloc « Veille informatique » du portfolio de Titouan Dumange (site Odoo).
Il est mis à jour automatiquement chaque lundi. Pour chaque thème (AIOps, NIS 2, SD-WAN), il contient un compte rendu de veille (synthèse, analyse, impacts, point de vue) et les actualités sourcées qui l'appuient, en français et en anglais. Les comptes rendus précédents sont conservés et consultables sur le site.

Le bloc lit ce fichier à l'adresse :
`https://raw.githubusercontent.com/titouandmg-design/portfolio-veille/main/veille.json`

## Format

```json
{
  "version": 2,
  "updated": "AAAA-MM-JJ",
  "themes": {
    "aiops": { "name": "AIOps",  "reports": [ … ], "news": [ … ] },
    "nis2":  { "name": "NIS 2",  "reports": [ … ], "news": [ … ] },
    "sdwan": { "name": "SD-WAN", "reports": [ … ], "news": [ … ] }
  }
}
```

Chaque compte rendu (`reports`, le plus récent en premier) :

| Champ      | Contenu |
|------------|---------|
| `date`     | `AAAA-MM-JJ` |
| `title`    | `{ "fr", "en" }`, l'enseignement principal en une phrase |
| `summary`  | `{ "fr", "en" }`, synthèse en 2 paragraphes séparés par une ligne vide |
| `analysis` | 3 à 5 points `{ "fr", "en" }` |
| `impact`   | `{ "fr", "en" }`, impacts pour une organisation |
| `opinion`  | `{ "fr", "en" }`, point de vue personnel |
| `sources`  | 2 à 5 liens `https://` |

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
