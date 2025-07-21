import React from "react";
import FloatingNavigation from "@/components/floating-navigation";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import AdvantagesSection from "@/components/advantages-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-white pt-20">
      <FloatingNavigation />
      <HeroSection />
      <ServicesSection />
      <AdvantagesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
} 