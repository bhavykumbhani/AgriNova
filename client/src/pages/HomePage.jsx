import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { WeatherMarketSection } from '../components/home/WeatherMarketSection';
import { HowItWorks } from '../components/home/HowItWorks';
import { WhyChooseAgriNova } from '../components/home/WhyChooseAgriNova';
import { FarmerBuyerCTA } from '../components/home/FarmerBuyerCTA';
import { DecisionSupportPreview } from '../components/home/DecisionSupportPreview';
import { TrustSection } from '../components/home/TrustSection';

export const HomePage = () => {
  return (
    <main id="main-content" className="flex-1">
      {/* 1. Hero Section & Feature Highlights */}
      <HeroSection />

      {/* 2. Weather Dashboard + Current Market Prices */}
      <WeatherMarketSection />

      {/* 3. How AgriNova Works */}
      <HowItWorks />

      {/* 4. Why Choose AgriNova */}
      <WhyChooseAgriNova />

      {/* 5. Farmer / Buyer CTA Section */}
      <FarmerBuyerCTA />

      {/* 6. Smart Decision Support Preview */}
      <DecisionSupportPreview />

      {/* 7. Trust & Safety */}
      <TrustSection />
    </main>
  );
};
