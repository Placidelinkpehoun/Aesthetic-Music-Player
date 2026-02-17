import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Option 1: Utiliser Unsplash API (gratuit avec limite)
    // Remplacez par votre propre clé API depuis https://unsplash.com/developers
    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY || 'DEMO_KEY';
    
    if (unsplashAccessKey === 'DEMO_KEY') {
      // Mode démo: utiliser Lorem Picsum avec seed basé sur le nom
      const seed = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return NextResponse.json({
        imageUrl: `https://picsum.photos/seed/${seed}/400/400`,
        source: 'picsum'
      });
    }

    // Recherche réelle avec Unsplash
    const searchQuery = encodeURIComponent(`${query} music album cover art`);
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&orientation=square`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashAccessKey}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Unsplash API request failed');
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return NextResponse.json({
        imageUrl: data.results[0].urls.small,
        source: 'unsplash',
        photographer: data.results[0].user.name,
        photographerUrl: data.results[0].user.links.html
      });
    }

    // Fallback si aucun résultat
    const seed = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return NextResponse.json({
      imageUrl: `https://picsum.photos/seed/${seed}/400/400`,
      source: 'picsum'
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    
    // En cas d'erreur, retourner une image par défaut
    const seed = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return NextResponse.json({
      imageUrl: `https://picsum.photos/seed/${seed}/400/400`,
      source: 'picsum',
      error: error.message
    });
  }
}
