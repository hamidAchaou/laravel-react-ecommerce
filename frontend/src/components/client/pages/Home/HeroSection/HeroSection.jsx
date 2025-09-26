import React from "react";
import OptimizedImage from "./OptimizedImage";

const HeroSection = ({
  headline = "Welcome to Our Store",
  subheading = "Discover amazing products and unbeatable deals tailored just for you.",
  primaryCta = { text: "Shop Now", link: "/shop" },
  secondaryCta = { text: "Learn More", link: "/about" },
  imageSource = "/images/hero.jpg",
  imageAlt = "Showcase of products",
}) => {
  return (
    <section className="relative bg-[var(--color-background-base)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
        {/* Left Content */}
        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
          <h1
            id="main-headline"
            className="text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl"
          >
            {headline}
          </h1>
          {subheading && (
            <p className="mt-6 text-lg leading-8 text-[var(--color-text-secondary)] sm:mt-8 sm:text-xl">
              {subheading}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            {primaryCta?.link && primaryCta?.text && (
              <a
                href={primaryCta.link}
                className="inline-flex items-center justify-center rounded-xl 
                           bg-[var(--color-primary-button)] 
                           px-6 py-3 text-base font-semibold 
                           text-[var(--color-brand-dark)] 
                           shadow-md hover:bg-[var(--color-primary-button-hover)] 
                           transition-all duration-200"
                aria-label={primaryCta.text}
              >
                {primaryCta.text}
              </a>
            )}
            {secondaryCta?.link && secondaryCta?.text && (
              <a
                href={secondaryCta.link}
                className="inline-flex items-center justify-center rounded-xl 
                           border border-gray-300 
                           bg-[var(--color-brand-light)] 
                           px-6 py-3 text-base font-semibold 
                           text-[var(--color-text-primary)] 
                           shadow-sm hover:bg-[var(--color-background-surface)] 
                           transition-all duration-200"
                aria-label={secondaryCta.text}
              >
                {secondaryCta.text}
              </a>
            )}
          </div>
        </div>

        {/* Right Image */}
        {imageSource && (
          <div className="mt-12 lg:mt-0 lg:col-span-6">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <OptimizedImage
                src={imageSource}
                alt={imageAlt}
                width={600}
                height={400}
                priority
                className="rounded-2xl shadow-xl ring-1 ring-gray-200"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
