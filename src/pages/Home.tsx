import { useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Grain from "../components/Grain";
import Particles from "../components/Particles";
import PageTransition from "../components/PageTransition";
import CustomCursor from "../components/CustomCursor";
import { useStructuredData } from "../hooks/useStructuredData";

const About = lazy(() => import("../components/About"));
const Services = lazy(() => import("../components/Services"));
const Projects = lazy(() => import("../components/Projects"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const Skills = lazy(() => import("../components/Skills"));
const Contact = lazy(() => import("../components/Contact"));
const Footer = lazy(() => import("../components/Footer"));

const Skeleton = ({ height }: { height: string }) => (
  <div className={`w-full ${height} bg-brand-black animate-pulse`} />
);

export default function Home() {
  useStructuredData([
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Habib",
      "url": "https://solodev_.com",
      "jobTitle": "Self-made Developer and Video editor",
      "description": "Self-made Developer and Video editor building modern digital experiences.",
      "email": "hello@solodev_.com",
      "sameAs": [
        "https://github.com/itsGods",
        "https://instagram.com/solodev_"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Solodev | Self-made Developer and Video editor",
      "url": "https://solodev_.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://solodev_.com/blog?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]);

  return (
    <PageTransition>
      <Helmet>
        <title>Solodev | Self-made Developer and Video editor</title>
        <meta name="description" content="Solodev is a Self-made Developer and Video editor building fast, modern web apps with React, Firebase, and TypeScript. Available for freelance projects." />
        <meta name="keywords" content="Developer, Video Editor, Self-made, React Developer, Firebase, TypeScript, Web Apps, Next.js" />
        <link rel="canonical" href="https://solodev_.com/" />
        <meta property="og:title" content="Solodev | Self-made Developer and Video editor" />
        <meta property="og:description" content="Solodev is a Self-made Developer and Video editor building fast, modern web apps with React, Firebase, and TypeScript." />
        <meta property="og:url" content="https://solodev_.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Solodev" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@solodev_" />
        <meta name="twitter:url" content="https://solodev_.com/" />
        <meta name="twitter:title" content="Solodev | Self-made Developer and Video editor" />
        <meta name="twitter:description" content="Solodev is a Self-made Developer and Video editor building fast, modern web apps with React, Firebase, and TypeScript." />
        <meta name="twitter:image" content="https://raw.githubusercontent.com/itsGods/Personal/refs/heads/main/file_0000000038e47208a7c7e84e80a5026d.png" />
        <meta name="twitter:creator" content="@solodev_" />
      </Helmet>
      <main className="relative bg-brand-black text-brand-light selection:bg-brand-orange selection:text-white md:cursor-none">
        <CustomCursor />
        <Grain />
        <Particles />
        <Navbar />
        <Hero />
        <Suspense fallback={<Skeleton height="h-screen" />}>
          <About />
        </Suspense>
        <Suspense fallback={<Skeleton height="h-screen" />}>
          <Services />
        </Suspense>
        <Suspense fallback={<Skeleton height="h-screen" />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<Skeleton height="h-screen" />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<Skeleton height="h-screen" />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<Skeleton height="h-screen" />}>
          <Contact />
        </Suspense>
        <Suspense fallback={<Skeleton height="h-64" />}>
          <Footer />
        </Suspense>
      </main>
    </PageTransition>
  );
}
