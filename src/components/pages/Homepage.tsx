// src/pages/HomePage.tsx (ou qualquer nome de página)
import BackgroundSection from '@/sections/BackgroundSection';

export default function HomePage() {
  return (
    <BackgroundSection>
      <main className="p-8 text-white">
        <h1 className="text-4xl mb-6">Página Principal</h1>
        <p>Aqui vai o conteúdo da página.</p>
      </main>
    </BackgroundSection>
  );
}
