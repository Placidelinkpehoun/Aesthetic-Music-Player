# 🎵 Sonic Player - Lecteur de Musique Next.js

Un lecteur de musique moderne et élégant construit avec Next.js 14, React et Tailwind CSS.

## ✨ Fonctionnalités

- 🎶 **Chargement de dossier** : Chargez un dossier entier contenant vos musiques
- ▶️ **Lecture/Pause** : Contrôlez la lecture de vos pistes
- ⏭️ **Navigation** : Passez à la piste suivante ou précédente
- 🔀 **Mode Aléatoire** : Écoutez vos musiques dans un ordre aléatoire
- 🔁 **Mode Répétition** : 
  - Répéter toute la playlist
  - Répéter une seule piste
  - Désactiver la répétition
- 🎚️ **Contrôle du volume** : Ajustez le volume à votre convenance
- 📋 **Liste de lecture** : Visualisez toutes vos pistes et cliquez pour les jouer
- 🎨 **Interface moderne** : Design rétro-futuriste avec animations fluides

## 🚀 Installation

### Prérequis
- Node.js 18.17 ou version ultérieure
- npm, yarn, pnpm ou bun

### Étapes d'installation

1. **Créez un nouveau projet Next.js**
```bash
npx create-next-app@latest sonic-player
# Choisissez les options suivantes :
# ✓ TypeScript: No
# ✓ ESLint: Yes
# ✓ Tailwind CSS: Yes
# ✓ src/ directory: No
# ✓ App Router: Yes
# ✓ Customize default import alias: No
```

2. **Remplacez les fichiers dans le dossier `app/`**
   - Supprimez les fichiers par défaut dans `app/`
   - Copiez `layout.js`, `page.js`, `music-player.jsx` et `globals.css` dans le dossier `app/`

3. **Copiez les fichiers de configuration**
   - `package.json`
   - `tailwind.config.js`
   - `postcss.config.js`

4. **Installez les dépendances**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

5. **Lancez le serveur de développement**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

6. **Ouvrez votre navigateur**
Accédez à [http://localhost:3000](http://localhost:3000)

## 📖 Utilisation

1. **Charger vos musiques**
   - Cliquez sur le bouton "Charger un dossier" dans le lecteur
   - Sélectionnez un dossier contenant des fichiers audio (MP3, WAV, OGG, M4A, FLAC)
   - Les pistes apparaîtront dans la liste à droite

2. **Contrôles du lecteur**
   - **Play/Pause** : Bouton central pour démarrer/arrêter la lecture
   - **Piste suivante/précédente** : Boutons avec icônes de flèches
   - **Mode Aléatoire** : Bouton avec icône de mélange (devient violet quand actif)
   - **Mode Répétition** : Cliquez pour basculer entre :
     - Pas de répétition
     - Répéter toute la playlist
     - Répéter une seule piste
   - **Volume** : Utilisez le slider en bas du lecteur

3. **Liste de lecture**
   - Cliquez sur n'importe quelle piste pour la jouer immédiatement
   - La piste en cours est mise en évidence avec un gradient coloré
   - Une animation ondulante s'affiche pendant la lecture

## 🎨 Personnalisation

### Couleurs
Vous pouvez modifier les couleurs dans `music-player.jsx` :
- Gradients principaux : `from-cyan-400 to-purple-400`
- Arrière-plan : `from-slate-900 via-purple-900 to-slate-900`

### Animations
Les animations sont gérées par Tailwind CSS et peuvent être personnalisées dans les classes.

## 🛠️ Technologies utilisées

- **Next.js 14** : Framework React avec App Router
- **React 18** : Bibliothèque JavaScript pour l'interface utilisateur
- **Tailwind CSS** : Framework CSS utilitaire
- **Lucide React** : Icônes modernes et élégantes
- **HTML5 Audio API** : Lecture audio native du navigateur

## 📝 Structure du projet

```
sonic-player/
├── app/
│   ├── layout.js          # Layout principal avec métadonnées
│   ├── page.js            # Page d'accueil
│   ├── music-player.jsx   # Composant principal du lecteur
│   └── globals.css        # Styles globaux
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🌐 Compatibilité navigateurs

- Chrome/Edge (recommandé)
- Firefox
- Safari (peut nécessiter l'activation des fonctionnalités de lecture automatique)
- Opera

## ⚠️ Notes importantes

- Les fichiers audio restent dans votre navigateur et ne sont pas uploadés sur un serveur
- Pour des raisons de sécurité, certains navigateurs peuvent bloquer la lecture automatique
- Les formats audio supportés dépendent du navigateur (MP3 est universellement supporté)

## 📜 Licence

Projet open source - libre d'utilisation et de modification.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à proposer une pull request.

---

Développé avec ❤️ et Next.js
