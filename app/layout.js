import './globals.css';

export const metadata = {
  title: 'Lecteur de Musique',
  description: 'Un lecteur de musique moderne avec Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
