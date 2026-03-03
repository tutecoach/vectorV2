import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ValuesSection from "@/components/ValuesSection";
import ModulesSection from "@/components/ModulesSection";
import BuyerPersonas from "@/components/BuyerPersonas";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ValuesSection />
        <ModulesSection />
        <BuyerPersonas />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
