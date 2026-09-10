'use client';

import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import { Problem, BeforeAfter, HowItWorks, CommModel } from '@/components/landing/Story';
import { Confidence, SafetyNet } from '@/components/landing/Intelligence';
import { MomentHabitScore, Flywheel } from '@/components/landing/Ecosystem';
import { ServicePacks, Scale, NationalImpact } from '@/components/landing/System';
import { Technology, Privacy, Differentiation, WhySanket } from '@/components/landing/Trust';
import { Team, FinalCTA, Footer } from '@/components/landing/Team';
import { Divider } from '@/components/landing/LandingUI';
import { useEffect, useState } from 'react';

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent">
      <div className="h-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 transition-[width] duration-150 ease-out" style={{ width: `${p * 100}%` }} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="noise min-h-screen bg-ink-950">
      <a href="#main" className="skip-link">Skip to main content</a>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <Problem />
        <BeforeAfter />
        <HowItWorks />
        <CommModel />
        <Divider />
        <Confidence />
        <SafetyNet />
        <Divider />
        <MomentHabitScore />
        <Flywheel />
        <ServicePacks />
        <Divider />
        <Scale />
        <NationalImpact />
        <Divider />
        <Technology />
        <Privacy />
        <Differentiation />
        <WhySanket />
        <Divider />
        <Team />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
