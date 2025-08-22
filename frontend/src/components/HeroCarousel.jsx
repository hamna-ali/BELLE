// src/components/HeroCarousel.jsx
import { useEffect, useRef, useState } from "react";
import "./HeroCarousel.css";

import slide5 from "../assets/images/slide4.jpg";
import slide6 from "../assets/images/slide6.jpg";
import slide7 from "../assets/images/slide7.jpg";
import slide12 from "../assets/images/slide20.jpg";
import slide13 from "../assets/images/slide13.jpg";
import slide17 from "../assets/images/slide17.jpg";
import slide18 from "../assets/images/slide18.jpg";

const slides = [
  { 
    title: "Chic College Vibes", 
    desc: "Effortless style ideas to elevate your everyday campus look.  A mix of casual comfort and fashion-forward confidence.", 
    img: slide5 
  },
  { 
    title: "Sporty Glam with Gigi Hadid", 
    desc: "A race car inspired outfit blended with high-fashion edge.  Bold, fierce, and ready to turn every runway into a track.", 
    img: slide6 
  },
  { 
    title: "Alia Bhatt’s Timeless Saree", 
    desc: "Pure grace in a classic white saree styled with modern elegance. A perfect balance of tradition and contemporary chic.", 
    img: slide7 
  },
  { 
    title: "Selena’s Warm Brown Glow", 
    desc: "Brown hair styled with soft waves brings out her natural warmth.  A minimal yet impactful look that radiates confidence.", 
    img: slide12 
  },
  { 
    title: "Kylie-Inspired Nude Glam", 
    desc: "Subtle nude lips paired with glowing skin for a chic aesthetic.  The perfect blend of modern minimalism and timeless beauty.", 
    img: slide13 
  },
  { 
    title: "Ana de Armas’ Innocent Glow", 
    desc: "Soft and delicate makeup that highlights natural beauty.  A look that speaks elegance with an effortless charm.", 
    img: slide17 
  },
  { 
    title: "Bold Eyes, Nude Lips", 
    desc: "Striking eye makeup paired with understated nude lips.  A statement-making editorial look for fearless personalities.", 
    img: slide18 
  },
];

const AUTOPLAY_MS = 4500;

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const hasSlides = slides.length > 0;

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const next = () => {
    if (!hasSlides) return;
    setIndex((i) => (i + 1) % slides.length);
  };

  const prev = () => {
    if (!hasSlides) return;
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!hasSlides) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSlides]);

  if (!hasSlides) return null;

  const current = slides[index];

  return (
    <section className="hero">
      <div className="hero-inner">
        <button className="hero-nav prev" aria-label="Previous" onClick={prev}>
          ‹
        </button>

        <div className="hero-slide">
          <div
            className="hero-image"
            style={{ backgroundImage: `url(${current.img})` }}
          />

          <div className="hero-overlay">
            {current.title && (
              <h1 className="hero-title">{current.title}</h1>
            )}
            {current.desc && (
              <p className="hero-desc">{current.desc}</p>
            )}
            {/* Uncomment if you want CTA */}
            {/* <button className="hero-cta">Book Now</button> */}
          </div>
        </div>

        <button className="hero-nav next" aria-label="Next" onClick={next}>
          ›
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;
