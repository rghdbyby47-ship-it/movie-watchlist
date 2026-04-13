import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'LETTERBOXD+',
  description: 'Track movies. Rate films. Share your taste.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
