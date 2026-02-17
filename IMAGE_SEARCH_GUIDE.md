# 🖼️ Système de Recherche d'Images Automatique

## Comment ça marche ?

Le lecteur de musique Sonic Player intègre un système intelligent de recherche et téléchargement automatique d'images pour vos chansons.

## Processus Automatique

### 1. Déclenchement
Lorsqu'une chanson commence à jouer, le système :
- Extrait le nom de la chanson
- Nettoie le nom (supprime les extensions, parenthèses, etc.)
- Lance une recherche d'image

### 2. Nettoyage du Nom
Le système nettoie intelligemment le nom de fichier :
```javascript
Exemple :
"Bohemian Rhapsody (Official Audio) [320kbps].mp3"
→ "Bohemian Rhapsody"

"01 - Artist_Name - Song_Title.mp3"
→ "Artist Name Song Title"
```

### 3. Recherche d'Image

#### Mode avec API Unsplash (Recommandé)
- Recherche sur Unsplash avec les mots-clés : `[nom de la chanson] music album cover art`
- Récupère la première image carrée de haute qualité
- Attribution automatique au photographe

#### Mode Fallback (Sans API)
- Utilise Lorem Picsum avec un "seed" basé sur le nom
- Génère une image cohérente et unique pour chaque chanson
- Même chanson = même image, garantie

### 4. Téléchargement et Cache
- L'image est téléchargée et convertie en blob
- Stockée dans un cache local (état React)
- Aucun téléchargement répété pour la même chanson

### 5. Affichage
- Image affichée dans le visualiseur circulaire
- Effet de rotation élégant par-dessus
- Indicateur de chargement pendant le téléchargement

## Configuration de l'API Unsplash

### Pourquoi utiliser Unsplash ?
- **Images de haute qualité** : Photos professionnelles
- **Gratuit** : 50 requêtes par heure en mode gratuit
- **Légal** : Licence Unsplash pour usage commercial
- **Pertinent** : Meilleurs résultats pour la musique

### Comment obtenir une clé API ?

1. **Créer un compte**
   - Allez sur https://unsplash.com/join
   - Créez un compte gratuit

2. **Devenir développeur**
   - Visitez https://unsplash.com/developers
   - Cliquez sur "Register as a Developer"

3. **Créer une application**
   - Nom : "Sonic Music Player"
   - Description : "Personal music player with automatic cover art"
   - Acceptez les termes

4. **Récupérer la clé**
   - Copiez votre "Access Key"
   - Ne partagez JAMAIS cette clé publiquement

5. **Configurer dans l'application**
   ```bash
   # Créer le fichier .env.local
   echo "UNSPLASH_ACCESS_KEY=votre_cle_ici" > .env.local
   ```

6. **Redémarrer le serveur**
   ```bash
   npm run dev
   ```

## Limitations

### Sans API Unsplash
- Images aléatoires (mais cohérentes par chanson)
- Pas toujours en rapport avec la musique
- Esthétiquement agréables mais génériques

### Avec API Unsplash (Gratuit)
- **50 requêtes/heure** : Largement suffisant pour un usage personnel
- **5000 requêtes/mois** : Pour un usage intensif

### Avec API Unsplash (Payant)
- Requêtes illimitées
- Priorité dans les résultats
- Support commercial

## Gestion des Erreurs

Le système gère automatiquement :
- **Réseau indisponible** → Image par défaut
- **API indisponible** → Fallback vers Lorem Picsum
- **Pas de résultats** → Image par défaut élégante
- **Timeout** → Image par défaut après 10 secondes

## Image par Défaut

L'image par défaut est un SVG élégant :
- Gradient violet-cyan (thème de l'app)
- Symbole musical (♪)
- Génération instantanée (pas de réseau)
- Toujours disponible

## Personnalisation

### Modifier la recherche
Dans `app/music-player.jsx`, ligne de la fonction `fetchTrackImage` :

```javascript
// Ajouter des mots-clés à la recherche
const searchQuery = `${cleanedName} music album vinyl cover`;

// Ou rechercher des artistes spécifiques
const searchQuery = `${cleanedName} artist band`;
```

### Changer l'API d'images
Dans `app/api/search-image/route.js`, vous pouvez remplacer Unsplash par :
- **Pexels API** : https://www.pexels.com/api/
- **Pixabay API** : https://pixabay.com/api/docs/
- **MusicBrainz** : Pour de vraies couvertures d'albums

## Optimisations Futures

Idées d'amélioration :
1. **Cache persistant** : Utiliser IndexedDB au lieu du state
2. **Métadonnées ID3** : Lire les couvertures intégrées aux MP3
3. **API de musique** : Utiliser Spotify, Last.fm ou MusicBrainz
4. **Préchargement** : Charger les images de toutes les pistes au démarrage
5. **Upload manuel** : Permettre à l'utilisateur de choisir une image

## Respect de la Vie Privée

Le système respecte votre vie privée :
- ✅ Aucune donnée personnelle envoyée
- ✅ Fichiers audio restent locaux
- ✅ Requêtes anonymes
- ✅ Pas de tracking
- ✅ Cache local uniquement

## Performance

Le système est optimisé :
- Chargement asynchrone (pas de blocage)
- Cache en mémoire
- Indicateur de chargement
- Fallback immédiat en cas d'erreur
- Images compressées (400x400px)

---

**Astuce** : Pour les meilleurs résultats, nommez vos fichiers audio comme : `Artiste - Titre.mp3`
