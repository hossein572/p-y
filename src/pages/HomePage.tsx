import { usePageTitle } from '../hooks/usePageTitle';
import { Hero } from '../components/home/Hero';
import { QuickActions } from '../components/home/QuickActions';
import { SpecialtiesSection } from '../components/home/SpecialtiesSection';
import { FeaturedDoctors } from '../components/home/FeaturedDoctors';
import { TrustSection } from '../components/home/TrustSection';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { FaqSection } from '../components/home/FaqSection';
import { CtaBand } from '../components/home/CtaBand';

export function HomePage() {
  usePageTitle();

  return (
    <>
      <Hero />
      <QuickActions />
      <SpecialtiesSection />
      <FeaturedDoctors />
      <TrustSection />
      <ReviewsSection />
      <FaqSection />
      <CtaBand />
    </>
  );
}
