import Hero from "@/components/Hero";
import AboutSection from "@/components/sections/AboutSection";
import PlantsSection from "@/components/sections/PlantsSection";
import EventsSection from "@/components/sections/EventsSection";
import GallerySection from "@/components/sections/GallerySection";
import MembershipSection from "@/components/sections/MembershipSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BlogPreviewSection from "@/components/sections/BlogPreviewSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <PlantsSection />
      <EventsSection />
      <GallerySection />
      <MembershipSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <NewsletterSection />
    </>
  );
}
