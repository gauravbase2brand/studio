
import LandingHeader from '@/components/landing-header';
import LandingHero from '@/components/landing-hero';
import LandingFeatures from '@/components/landing-features';
import LandingHowItWorks from '@/components/landing-how-it-works';
import LandingFaq from '@/components/landing-faq';
import LandingFooter from '@/components/landing-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingFaq />
      </main>
      <LandingFooter />
    </div>
  );
}
