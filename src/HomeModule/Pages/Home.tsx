import React from 'react';
import Hero from '@/HomeModule/Components/Hero';
import UseCasesShowcase from '@/HomeModule/Components/UseCasesShowcase';
import FeaturedModels from '@/HomeModule/Components/FeaturedModels';
import WhatIsOpenModel from '@/HomeModule/Components/WhatIsOpenModel';
import HowItWorks from '@/HomeModule/Components/HowItWorks';
import WhoItsFor from '@/HomeModule/Components/WhoItsFor';
import WhyOpenModel from '@/HomeModule/Components/WhyOpenModel';
import CoreFeatures from '@/HomeModule/Components/CoreFeatures';
import LoRAArchitecture from '@/HomeModule/Components/LoRAArchitecture';
import OutputGallery from '@/HomeModule/Components/OutputGallery';
import SocialProof from '@/HomeModule/Components/SocialProof';
import PremiumOffer from '@/HomeModule/Components/PremiumOffer';
import FinalCTA from '@/HomeModule/Components/FinalCTA';

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