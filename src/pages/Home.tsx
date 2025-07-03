import React from 'react';
import Hero from '@/components/home/Hero';
import UseCasesShowcase from '@/components/home/UseCasesShowcase';
import FeaturedModels from '@/components/home/FeaturedModels';
import WhatIsOpenModel from '@/components/home/WhatIsOpenModel';
import HowItWorks from '@/components/home/HowItWorks';
import WhoItsFor from '@/components/home/WhoItsFor';
import WhyOpenModel from '@/components/home/WhyOpenModel';
import CoreFeatures from '@/components/home/CoreFeatures';
import LoRAArchitecture from '@/components/home/LoRAArchitecture';
import OutputGallery from '@/components/home/OutputGallery';
import SocialProof from '@/components/home/SocialProof';
import PremiumOffer from '@/components/home/PremiumOffer';
import FinalCTA from '@/components/home/FinalCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <UseCasesShowcase />
      <FeaturedModels />
      <WhatIsOpenModel />
      <HowItWorks />
      <WhoItsFor />
      <WhyOpenModel />
      <CoreFeatures />
      <LoRAArchitecture />
      <OutputGallery />
      <SocialProof />
      <PremiumOffer />
      <FinalCTA />
    </>
  );
}