# 🍩 Beigne

**Tu as laissé ton ordi débarré? Tu dois des beignes.**

Beigne est un tracker impitoyable de collègues qui laissent leur ordinateur déverrouillé au bureau. Chaque infraction = une boîte de beignes à apporter à l'équipe. Pas de pitié. Pas d'exceptions. Pas de "j'étais parti 30 secondes".

## Comment ça marche

1. Un collègue laisse son ordi débarré
2. Tu ouvres Beigne
3. Tu cliques sur son nom
4. Il doit maintenant des beignes à tout le bureau
5. Tu manges des beignes gratuits
6. Repeat

## Stack technique

| Couche | Techno |
|--------|--------|
| Frontend | React 19, Vite, Tailwind CSS v4, TanStack Query + Table |
| Backend | Elysia (Bun), Prisma, SQLite |
| Infra | Docker, nginx |

## Développement

```bash
# Installer les dépendances
bun install

# Lancer le tout
bun run dev

# Lancer séparément
bun run dev:server    # API sur :3001
bun run dev:web       # SPA sur :3000

# Base de données
bun run db:migrate    # Migrations Prisma
bun run db:seed       # Données de test
```

## Production (Docker)

```bash
docker compose up --build
```

L'app sera disponible sur `http://localhost:5173`.

## FAQ

**Q: C'est quoi une beigne?**
A: Au Québec, un beignet. Mais en plus délicieux.

**Q: Mon collègue refuse de payer ses beignes.**
A: Ce n'est pas un bug, c'est un problème de société.

**Q: J'ai cliqué sur le mauvais collègue.**
A: Clic droit → Supprimer. On est pas des sauvages.

**Q: Est-ce que ça marche si je suis en télétravail?**
A: Techniquement oui. Moralement, non.

**Q: Quelqu'un a attrapé le boss.**
A: Bonne chance.

---

*Fait avec amour, beurre et sucre en poudre avec Claude.* 🍩