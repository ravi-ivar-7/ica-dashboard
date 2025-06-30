import React from 'react';
import Hero from '../components/Hero';
import UseCasesShowcase from '../components/UseCasesShowcase';
import FeaturedModels from '../components/FeaturedModels';
import WhatIsOpenModel from '../components/WhatIsOpenModel';
import HowItWorks from '../components/HowItWorks';
import WhoItsFor from '../components/WhoItsFor';
import WhyOpenModel from '../components/WhyOpenModel';
import CoreFeatures from '../components/CoreFeatures';
import LoRAArchitecture from '../components/LoRAArchitecture';
import OutputGallery from '../components/OutputGallery';
import SocialProof from '../components/SocialProof';
import PremiumOffer from '../components/PremiumOffer';
import FinalCTA from '../components/FinalCTA';

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