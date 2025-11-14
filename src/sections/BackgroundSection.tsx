import type { PropsWithChildren } from 'react';
import CyberMatrixHero from '@/components/ui/CyberMatrixHero';

export default function BackgroundSection({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <CyberMatrixHero />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
