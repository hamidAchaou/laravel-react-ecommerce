import React from "react";
import HeroSection from "../../components/client/pages/Home/HeroSection/HeroSection";

export default function Home() {
  // Example data for HeroSection
  const heroData = {
    headline: "Discover Amazing Products",
    subheading: "Find the best deals and newest items here",
    primaryCta: { text: "Shop Now", link: "/shop" },
    secondaryCta: { text: "Learn More", link: "/about" },
    imageSource: "../../assets/images/hero.jpg",
    imageAlt: "Hero showcasing products",
  };

  return (
    <div>
      <HeroSection
        headline={heroData.headline}
        subheading={heroData.subheading}
        primaryCta={heroData.primaryCta}
        secondaryCta={heroData.secondaryCta}
        imageSource="https://images.unsplash.com/photo-1617004446689-37c6e071b44e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageAlt={heroData.imageAlt}
      />
    </div>
  );
}
