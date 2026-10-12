# Consignes de la mise à jour hebdomadaire

Lu par la tâche planifiée chaque lundi. Objectif : garder `veille.json` à jour pour le bloc « Veille informatique » du portfolio de Titouan Dumange (étudiant BTS SIO option SISR, stage à la DSI de la mairie des Sables d'Olonne).

## Thèmes
- `aiops` : IA appliquée à l'exploitation et à la supervision réseau (AIOps, AgenticOps, observabilité, Zabbix, outils de NetOps).
- `nis2` : directive NIS 2 et sa transposition en France (projet de loi Résilience, ANSSI, ReCyF, décrets, collectivités territoriales).
- `sdwan` : SD-WAN et SASE (marché, offres, Gartner, sécurité des réseaux étendus, SonicWall, Fortinet, Cisco, etc.).

## Procédure
1. Lire `veille.json`. Noter `updated` et les URL déjà présentes.
2. Pour chaque thème, chercher sur le web les actualités publiées depuis `updated` (ou les 4 dernières semaines si rien de neuf). Privilégier : cyber.gouv.fr / ANSSI, CERT-FR, Légifrance, assemblee-nationale.fr, Next, LeMagIT, Silicon.fr, IT-Connect, ZDNet, Le Monde Informatique, communiqués officiels des éditeurs, SDxCentral, Network World.
3. Ne retenir une actualité que si : elle est vraiment nouvelle (pas déjà dans le fichier), datée, pertinente pour un technicien systèmes et réseaux, et confirmée par une deuxième source ou issue d'une source officielle. Ouvrir l'article pour vérifier les chiffres. Ne jamais inventer de chiffre, de date ou de citation.
4. Ajouter de 0 à 2 actualités par thème, en tête de la liste `news`, au format existant : `date` (AAAA-MM-JJ de publication), `title` {fr, en}, `text` {fr, en} (2 à 3 phrases factuelles, ton neutre, typographie française avec espaces avant : ; ? !), `source` (nom du média), `url` (https, l'article lui-même).
5. Si une actualité plus ancienne est devenue fausse (ex. une loi finalement adoptée), ne pas la modifier : ajouter la nouvelle actualité qui la corrige.
6. Mettre `updated` à la date du jour (AAAA-MM-JJ), même si aucun thème n'a de nouveauté.
7. Conserver toutes les anciennes actualités (archive). Le site n'affiche que les 3 plus récentes par thème.
8. Lancer `python3 validate.py`. Ne publier que si le fichier est valide.
9. Commit sur `main` avec le message `Veille du AAAA-MM-JJ : N nouvelles actualités`, puis push.
