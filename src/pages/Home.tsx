import React, { useEffect } from 'react';
import { Hero } from '@/components/Header';
import { ImpactFeed } from '@/components/ImpactFeed';
import { DonationSection } from '@/components/DonationSection';
import { ImpactStory } from '@/types';

interface HomeProps {
  stories: ImpactStory[];
}

export const Home: React.FC<HomeProps> = ({ stories }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <ImpactFeed stories={stories} />
      <DonationSection />
    </>
  );
};