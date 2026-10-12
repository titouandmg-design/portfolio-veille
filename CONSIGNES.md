# Consignes de la mise à jour hebdomadaire

Lu par la tâche planifiée chaque lundi. Objectif : garder `veille.json` à jour pour le bloc « Veille informatique » du portfolio de Titouan Dumange (étudiant BTS SIO option SISR, stage à la DSI de la mairie des Sables d'Olonne).

## Thèmes
- `aiops` : IA appliquée à l'exploitation et à la supervision réseau (AIOps, AgenticOps, observabilité, Zabbix, outils de NetOps).
- `nis2` : directive NIS 2 et sa transposition en France (projet de loi Résilience, ANSSI, ReCyF, décrets, collectivités territoriales).
- `sdwan` : SD-WAN et SASE (marché, offres, Gartner, sécurité des réseaux étendus, SonicWall, Fortinet, Cisco, etc.).

## Ce qui est publié
Pour chaque thème, le site affiche un **compte rendu** (le plus récent, avec un menu pour relire les précédents) et les **3 dernières actualités** qui lui servent de sources. Le compte rendu est la partie principale : il doit se lire comme une vraie synthèse de veille rédigée par Titouan, pas comme une liste de liens.

## Procédure
1. Lire `veille.json`. Noter `updated` et les URL déjà présentes.
2. Pour chaque thème, chercher sur le web les actualités publiées depuis `updated` (ou les 4 dernières semaines si rien de neuf). Privilégier : cyber.gouv.fr / ANSSI, CERT-FR, Légifrance, assemblee-nationale.fr, Next, LeMagIT, Silicon.fr, IT-Connect, ZDNet, Le Monde Informatique, communiqués officiels des éditeurs, SDxCentral, Network World.
3. Ne retenir une actualité que si : elle est vraiment nouvelle (pas déjà dans le fichier), datée, pertinente pour un technicien systèmes et réseaux, et confirmée par une deuxième source ou issue d'une source officielle. Ouvrir l'article pour vérifier les chiffres. Ne jamais inventer de chiffre, de date ou de citation.
4. Ajouter de 0 à 2 actualités par thème, en tête de la liste `news`, au format existant : `date` (AAAA-MM-JJ de publication), `title` {fr, en}, `text` {fr, en} (2 à 3 phrases factuelles, ton neutre, typographie française avec espaces avant : ; ? !), `source` (nom du média), `url` (https, l'article lui-même).
5. Si une actualité plus ancienne est devenue fausse (ex. une loi finalement adoptée), ne pas la modifier : ajouter la nouvelle actualité qui la corrige.
6. Rédiger le compte rendu de la semaine pour chaque thème qui a reçu au moins une nouvelle actualité, et l'ajouter en tête de la liste `reports` du thème (ne jamais modifier les comptes rendus précédents). Un thème sans nouveauté fiable ne reçoit pas de compte rendu cette semaine. Format :
   - `date` : date du jour (AAAA-MM-JJ) ;
   - `title` {fr, en} : une phrase qui résume l'enseignement principal (pas un titre de rubrique) ;
   - `summary` {fr, en} : la synthèse, 2 paragraphes séparés par une ligne vide (`\n\n`), 120 à 200 mots en français : ce qui s'est passé, avec dates, chiffres et acteurs, replacé dans l'évolution du sujet depuis le compte rendu précédent ;
   - `analysis` : 3 à 5 points {fr, en}, chacun une ou deux phrases : causes, enjeux, tendances, limites, ce que cela change ;
   - `impact` {fr, en} : conséquences concrètes pour une organisation comme la DSI d'une collectivité (mairie, écoles, médiathèques) et pour le travail d'un technicien systèmes et réseaux ;
   - `opinion` {fr, en} : « Mon point de vue », à la première personne, ton sobre et sincère d'étudiant : ce que Titouan en retient, le lien avec son BTS SIO SISR ou son stage à la DSI des Sables d'Olonne (Zabbix, SonicWall, Active Directory, kiosque Debian, supervision), et ce qu'il compte suivre ou apprendre. Pas de formules creuses, pas d'exagération ;
   - `sources` : 2 à 5 URL https effectivement utilisées, en priorité celles des actualités du thème.
   Le compte rendu ne doit contenir que des faits présents dans les sources. Pas de HTML.
7. Mettre `updated` à la date du jour (AAAA-MM-JJ), même si aucun thème n'a de nouveauté.
8. Conserver toutes les anciennes actualités et tous les anciens comptes rendus (archive). Le site n'affiche que les 3 actualités les plus récentes par thème.
9. Lancer `python3 validate.py`. Ne publier que si le fichier est valide.
10. Commit sur `main` avec le message `Veille du AAAA-MM-JJ : N actualités, M comptes rendus`, puis push.
