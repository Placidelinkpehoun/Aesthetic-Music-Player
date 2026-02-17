'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Repeat, 
  Repeat1, 
  Shuffle,
  Volume2,
  FolderOpen
} from 'lucide-react';

export default function MusicPlayer() {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'all', 'one'
  const [shuffleMode, setShuffleMode] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [trackImages, setTrackImages] = useState({}); // Stocke les images par ID de piste
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  
  const audioRef = useRef(null);
  
  // Couleurs du gradient par défaut (à modifier selon vos préférences)
  const gradientColor1 = '#FF6B6B'; // Changez cette couleur
  const gradientColor2 = '#4ECDC4'; // Changez cette couleur
  
  // Image par défaut (gradient SVG)
  const defaultImage = `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23${gradientColor1.slice(1)};stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23${gradientColor2.slice(1)};stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='100' font-family='Arial, sans-serif'%3E♪%3C/text%3E%3C/svg%3E`;

  // Fonction pour rechercher et télécharger l'image de la chanson
  const fetchTrackImage = async (trackName, trackId) => {
    if (trackImages[trackId]) {
      return; // L'image existe déjà
    }

    setIsLoadingImage(true);
    
    try {
      // Nettoyer le nom de la piste pour la recherche
      const cleanedName = trackName
        .replace(/\([^)]*\)/g, '') // Supprimer le contenu entre parenthèses
        .replace(/\[[^\]]*\]/g, '') // Supprimer le contenu entre crochets
        .replace(/\d{2,4}kbps/gi, '') // Supprimer les mentions de bitrate
        .replace(/\.mp3|\.wav|\.ogg|\.m4a|\.flac/gi, '') // Supprimer les extensions
        .replace(/-/g, ' ') // Remplacer les tirets par des espaces
        .replace(/_/g, ' ') // Remplacer les underscores par des espaces
        .trim();

      // Utiliser notre API route pour rechercher l'image
      const response = await fetch(`/api/search-image?query=${encodeURIComponent(cleanedName)}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Télécharger l'image et la convertir en blob
        const imageResponse = await fetch(data.imageUrl);
        
        if (imageResponse.ok) {
          const blob = await imageResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          
          setTrackImages(prev => ({
            ...prev,
            [trackId]: objectUrl
          }));
          
          console.log(`Image chargée pour "${trackName}" depuis ${data.source}`);
        } else {
          throw new Error('Failed to download image');
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      // En cas d'erreur, utiliser l'image par défaut
      setTrackImages(prev => ({
        ...prev,
        [trackId]: defaultImage
      }));
    } finally {
      setIsLoadingImage(false);
    }
  };

  // Obtenir l'image de la piste actuelle
  const getCurrentTrackImage = () => {
    if (tracks.length === 0) return defaultImage;
    const currentTrack = tracks[currentTrackIndex];
    return trackImages[currentTrack?.id] || defaultImage;
  };
  
  // Image par défaut (gradient SVG)
  //const defaultImage = "data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23a855f7;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2306b6d4;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='100' font-family='Arial, sans-serif'%3E♪%3C/text%3E%3C/svg%3E";

  // Charger un dossier de musique
  const handleFolderUpload = async (event) => {
    const files = Array.from(event.target.files);
    const audioFiles = files.filter(file => 
      file.type.startsWith('audio/') || 
      file.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)
    );

    const tracksData = audioFiles.map((file, index) => ({
      id: index,
      name: file.name.replace(/\.[^/.]+$/, ""),
      file: file,
      url: URL.createObjectURL(file)
    }));

    setTracks(tracksData);
    setCurrentTrackIndex(0);
    if (tracksData.length > 0 && audioRef.current) {
      audioRef.current.src = tracksData[0].url;
    }
  };

  // Générer une liste aléatoire d'indices
  const generateShuffledIndices = () => {
    const indices = tracks.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    if (!shuffleMode) {
      const shuffled = generateShuffledIndices();
      setShuffledIndices(shuffled);
      setShuffleMode(true);
    } else {
      setShuffleMode(false);
      setShuffledIndices([]);
    }
  };

  // Toggle repeat
  const toggleRepeat = () => {
    if (repeatMode === 'none') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('none');
  };

  // Play/Pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Piste suivante
  const nextTrack = () => {
    if (tracks.length === 0) return;
    
    let nextIndex;
    if (shuffleMode && shuffledIndices.length > 0) {
      const currentShufflePos = shuffledIndices.indexOf(currentTrackIndex);
      const nextShufflePos = (currentShufflePos + 1) % shuffledIndices.length;
      nextIndex = shuffledIndices[nextShufflePos];
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.src = tracks[nextIndex].url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  };

  // Piste précédente
  const prevTrack = () => {
    if (tracks.length === 0) return;
    
    let prevIndex;
    if (shuffleMode && shuffledIndices.length > 0) {
      const currentShufflePos = shuffledIndices.indexOf(currentTrackIndex);
      const prevShufflePos = currentShufflePos === 0 
        ? shuffledIndices.length - 1 
        : currentShufflePos - 1;
      prevIndex = shuffledIndices[prevShufflePos];
    } else {
      prevIndex = currentTrackIndex === 0 
        ? tracks.length - 1 
        : currentTrackIndex - 1;
    }
    
    setCurrentTrackIndex(prevIndex);
    if (audioRef.current) {
      audioRef.current.src = tracks[prevIndex].url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  };

  // Sélectionner une piste
  const selectTrack = (index) => {
    setCurrentTrackIndex(index);
    if (audioRef.current) {
      audioRef.current.src = tracks[index].url;
      audioRef.current.play();
      setIsPlaying(true);
    }
    // Charger l'image de la piste
    if (tracks[index]) {
      fetchTrackImage(tracks[index].name, tracks[index].id);
    }
  };

  // Gérer la fin de la piste
  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all' || tracks.length > 1) {
      nextTrack();
    } else {
      setIsPlaying(false);
    }
  };

  // Mettre à jour le temps
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrackIndex, repeatMode, shuffleMode]);

  // Changer le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Charger l'image de la piste actuelle
  useEffect(() => {
    if (tracks.length > 0 && tracks[currentTrackIndex]) {
      fetchTrackImage(tracks[currentTrackIndex].name, tracks[currentTrackIndex].id);
    }
  }, [currentTrackIndex, tracks]);

  // Formater le temps
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <audio ref={audioRef} />
      
      <div className="h-screen flex">
        {/* Lecteur - Côté gauche */}
        <div className="w-1/2 flex bg-cream flex-col justify-center items-center p-12">
          <div className="w-full max-w-md space-y-8">

            {/* Visualiseur circulaire avec image */}
            <div className="relative w-96 h-96 mx-auto">
              <div className="absolute border-2 border-black inset-0 rounded-md bg-gray" style={{ boxShadow: '5px 5px 0 #000' }}/>
             
                {/* Image de la chanson */}
                <img 
                  src={getCurrentTrackImage()} 
                  alt={tracks[currentTrackIndex]?.name || 'Album cover'}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
                
                {/* Indicateur de chargement */}
                {isLoadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
                  </div>
                )}
            </div>
            
            {/* Affichage du temps sous l'image */}
            <div className="text-center">
              <div className="text-lg font-semibold text-black/90">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Barre de progression */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => {
                  const time = parseFloat(e.target.value);
                  setCurrentTime(time);
                  if (audioRef.current) audioRef.current.currentTime = time;
                }}
                className="slider-progress w-full h-[5px] bg-black rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Contrôles */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleShuffle}
                className={`p-3 rounded-full transition-all ${
                  shuffleMode 
                    ? 'rounded-full border-2 border-black bg-white text-black' 
                    : 'rounded-full border-2 border-black hover:bg-white'
                }`}
                style={{ boxShadow: '2px 2px 0 #000' }}
              >
                <Shuffle size={20} />
              </button>
              
              <button
                onClick={prevTrack}
                className="p-3 rounded-full border-2 border-black hover:bg-white transition-all"
                style={{ boxShadow: '2px 2px 0 #000' }}
              >
                <SkipBack size={24} />
              </button>
              
              <button
                onClick={togglePlay}
                className="p-6 rounded-full border-2 border-black text-black hover:bg-white transition-all"
                style={{ boxShadow: '3px 3px 0 #000' }}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
              
              <button
                onClick={nextTrack}
                className="p-3 rounded-full border-2 border-black hover:bg-white transition-all"
                style={{ boxShadow: '2px 2px 0 #000' }}
              >
                <SkipForward size={24} />
              </button>
              
              <button
                onClick={toggleRepeat}
                className={`p-3 rounded-full transition-all ${
                  repeatMode !== 'none'
                    ? 'rounded-full border-2 border-black bg-white text-black' 
                    : 'rounded-full border-2 border-black hover:bg-white'
                }`}
                style={{ boxShadow: '2px 2px 0 #000' }}
              >
                {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
              </button>
            </div>

            {/* Volume 
            <div className="flex items-center gap-4">
              <Volume2 size={20} className="text-black" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-black rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>*/}

            {/* Bouton charger dossier 
            <label className="flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 border-2 border-dashed border-black/50 rounded-xl cursor-pointer transition-all group">
              <FolderOpen size={24} className="text-black group-hover:scale-110 transition-transform" />
              <span className="font-semibold tracking-wide">Charger un dossier</span>
              <input
                type="file"
                multiple
                webkitdirectory=""
                directory=""
                onChange={handleFolderUpload}
                className="hidden"
              />
            </label>*/}
          </div>
        </div>

        {/* Liste des pistes - Côté droit */}
        <div className="w-1/2 flex flex-col p-8 bg-cream overflow-hidden">
          <div className="mb-6 flex items-center justify-between p-bottom-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-black">
                Playlist
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {tracks.length} piste{tracks.length > 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Bouton charger dossier */}
            <label 
            className="border-2 border-black flex items-center justify-center p-3 hover:bg-white text-black rounded-full cursor-pointer transition-all"
            style={{ boxShadow: '2px 2px 0 #000' }}>
              <FolderOpen size={24} />
              <input
                type="file"
                multiple
                webkitdirectory=""
                directory=""
                onChange={handleFolderUpload}
                className="hidden"
              />
            </label>
            
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-4 custom-scrollbar">
            {tracks.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gray-500/10 flex items-center justify-center">
                    <FolderOpen size={40} className="text-gray-400/50" />
                  </div>
                  <p className="text-gray-500 text-lg">
                    Aucune musique chargée
                  </p>
                </div>
              </div>
            ) : (
              tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => selectTrack(index)}
                  className={`group p-4 rounded-xl text-black cursor-pointer transition-all ${
                    index === currentTrackIndex
                      ? 'border-2 border-black bg-white text-black' 
                    : 'border-2 border-black hover:bg-white'
                  }`}
                  style={{ boxShadow: '2px 2px 0 #000' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold ${
                      index === currentTrackIndex
                         ? 'border-2 border-black bg-white text-black' 
                    : 'border-2 border-black hover:bg-white'
                    }`}>
                      {index === currentTrackIndex && isPlaying ? (
                        <div className="flex gap-1 items-end h-4">
                          <div className="w-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms', height: '60%' }} />
                          <div className="w-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms', height: '100%' }} />
                          <div className="w-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms', height: '80%' }} />
                        </div>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate text-black`}>
                        {track.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-progress::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #FFFFE0;
          border: 2px solid #000;
          cursor: pointer;
        }

        .slider-progress::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #FFFFE0;
          border: 2px solid #000;
          cursor: pointer;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #000000;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #000000;
        }
      `}</style>
    </div>
  );
}
