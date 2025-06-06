# ledoncoin

Une application React qui permet de consulter, rechercher, filtrer, ajouter, modifier et supprimer des annonces d'objets.

---

## Fonctionnalités

- Affichage de la liste des annonces
- Creation d'une annonce via formulaire
- Modification et suppression d'une annonce
- Affichage des details d'une annonce
- Systeme de tri et de filtre
- Pagination des resultats
- Champ de recherche

---

## Prérequis

- Node.js
- MongoDB

---

## Installation

1. **Cloner le dépôt :**


```bash
git clone https://github.com/Nehcooo/mihotel.git
cd mihotel
```

### Installation et lancement du backend :

1. **Aller dans le dossier backend**
```bash
cd backend
```
2. **Configurer un fichier .env (à la racine de ./backend)**
```env
PORT=4242
DB_URI=mongodb://localhost:27042
DB_NAME=mihotel
```
3. **Installer les dépendances**
```bash
npm install
```
4. **Lancer le serveur en mode développement**
```bash
npm run dev
```

Le backend tourne sur `http://localhost:5000`

## Installation et lancement du frontend :

1. **Aller dans le dossier frontend**
```bash
cd frontend
```
2. **Installer les dépendances**
```bash
npm install
```
3. **Lancer le serveur en mode développement**
```bash
npm run dev
```

Ouvrez le frontend sur votre navigateur

## Technologies utilisées

### Backend
- Node.js
- Express.js
- MongoDB (mongoose)

### Frontend
- React
- React Router DOM
- React Icons
- Tailwind CSS
