import {
  Header,
  Hero,
  Features,
  HowItWorks,
  Pricing,
  FAQ,
  Footer,
} from '@/components/landing';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
